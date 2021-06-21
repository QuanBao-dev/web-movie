import "./TheaterWatch.css";

import loadable from "@loadable/component";
import Axios from "axios";
import { nanoid } from "nanoid";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { ReplaySubject } from "rxjs";
import { first } from "rxjs/operators";

import Input from "../../components/Input/Input";
import {
  fetchUserOnline$,
  submitFormPasswordRoom$,
  theaterStream,
} from "../../epics/theater";
import { userStream } from "../../epics/user";
import {
  updateAllowFetchCurrentRoomDetail,
  updateAllowRemoveVideoWatch,
  updateAllowUserJoin,
  updateSignIn,
  updateUserIdNow,
} from "../../store/theater";

const Chat = loadable(() => import("../../components/Chat/Chat"), {
  fallback: <i className="fas fa-spinner fa-9x fa-spin"></i>,
});

const socket = theaterStream.socket;
const peers = {};
let myPeer;
let notificationE;
let audioCallE;
let idCartoonUser;
let groupId;
let user;
let videoWatchElement;
let elementCall = "audio";
const replaySubject = new ReplaySubject(3);

const TheaterWatch = (props) => {
  groupId = props.match.params.groupId;
  replaySubject.next(groupId);
  user = userStream.currentState() || {};
  const [theaterState, setTheaterState] = useState(theaterStream.initialState);
  const [isFullScreenState, setIsFullScreenState] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const inputPasswordRef = useRef();
  const notificationRef = useRef();
  const audioCallRef = useRef();
  const inputVideoRef = useRef();
  const videoWatchRef = useRef();
  const videoUrlUpload = useRef();
  const transcriptUrlUpload = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);
  useEffect(() => {
    videoWatchElement = videoWatchRef.current;
    notificationE = notificationRef.current;
    audioCallE = audioCallRef.current;
    idCartoonUser = cookies.idCartoonUser;
    const subscription = theaterStream.subscribe(setTheaterState);
    theaterStream.init();
    let submitFormSub;
    if (theaterState.isSignIn) {
      if (theaterStream.currentState().allowUserJoin) {
        newUserJoinHandleVideo(
          audioCallRef.current ||
            document.querySelector(".container-audio-call")
        );
        setErrorPassword(null);
        updateAllowUserJoin(false);
      }
      if (isFullScreenState) {
        const navBar = document.querySelector(".nav-bar");
        navBar && (navBar.style.transform = "translateY(-100px)");
        allowFullscreen();
        const video = videoWatchRef.current;
        video && (video.className = "video-zoom");
        const containerMessageDialog = document.querySelector(
          ".container-message-dialog"
        );
        containerMessageDialog &&
          (containerMessageDialog.className =
            "container-message-dialog container-message-zoom");
      } else {
        const navBar = document.querySelector(".nav-bar");
        const video = videoWatchRef.current;
        const containerMessageDialog = document.querySelector(
          ".container-message-dialog"
        );
        navBar && (navBar.style.transform = "");
        video && (video.className = "");
        allowExitFullscreen(containerMessageDialog);
      }
    }

    if (inputPasswordRef && inputPasswordRef.current) {
      submitFormSub = submitFormPasswordRoom$(
        inputPasswordRef.current,
        groupId,
        cookies.idCartoonUser,
        setErrorPassword
      ).subscribe((v) => {
        if (!!v) {
          inputPasswordRef.current.value = "";
          if (theaterState.allowFetchCurrentRoomDetail) {
            fetchGroup(groupId, cookies.idCartoonUser);
          }
        }
      });
    }
    return () => {
      subscription.unsubscribe();
      submitFormSub && submitFormSub.unsubscribe();
      if (theaterStream.currentState().allowRemoveVideoWatch) {
        videoWatchElement && (videoWatchElement.src = "");
        videoWatchElement && videoWatchElement.remove();
        videoWatchElement && (videoWatchElement.muted = true);
        videoWatchElement && removeEventListenerVideoElement(videoWatchElement);
        updateAllowUserJoin(true);
      }
      updateAllowRemoveVideoWatch(true);
      const buttonScrollTopE = document.querySelector(".button-scroll-top");
      buttonScrollTopE.style.display = "block";
    };
  }, [
    cookies.idCartoonUser,
    isFullScreenState,
    props.match.params.groupId,
    theaterState.allowFetchCurrentRoomDetail,
    theaterState.allowRemoveVideoWatch,
    theaterState.isSignIn,
  ]);
  useEffect(() => {
    socket.emit("update-user-avatar", user.userId, groupId, user.avatarImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.avatarImage]);

  if (!theaterState.isSignIn && notificationRef.current) {
    notificationRef.current.innerHTML = "";
    if (audioCallRef.current) {
      if (theaterState.usersOnline.length === 1) {
        replaySubject.pipe(first()).subscribe((groupId) => {
          socket.emit("delete-specific-member", user.userId, groupId);
        });
      }
      theaterState.usersOnline = [];
      audioCallRef.current.innerHTML = "";
      updateSignIn(false);
      socket.emit("disconnect-custom");
    }
  }
  // console.log(theaterState.usersOnline);
  return (
    <div className="theater-user-login">
      {theaterState.isSignIn && theaterState.currentRoomDetail && (
        <div className="section-center">
          <h2 className="notification-user-join" ref={notificationRef}>
            {" "}
          </h2>
          <div>
            <h1 className="title-room">
              {theaterState.currentRoomDetail.roomName}
            </h1>
            <div className="container-input-section">
              <div
                style={{
                  width: "90%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Input label={"Video url"} input={videoUrlUpload} />
                <button
                  onClick={() => {
                    if (videoUrlUpload.current.value !== "") {
                      createNewVideo(
                        videoUrlUpload.current.value,
                        true,
                        undefined
                      );
                    }
                  }}
                >
                  Upload
                </button>
                <Input label={"Transcript url"} input={transcriptUrlUpload} />
                <button
                  onClick={() => {
                    if (transcriptUrlUpload.current.value !== "") {
                      createNewVideo(
                        undefined,
                        true,
                        transcriptUrlUpload.current.value
                      );
                    }
                  }}
                >
                  Upload
                </button>
              </div>
              <input
                type="file"
                ref={inputVideoRef}
                onChange={() => createVideoUri(inputVideoRef.current)}
              />
            </div>
            {theaterState.isSignIn && (
              <UserListOnline usersOnline={theaterState.usersOnline} />
            )}
            <div className="container-section-video">
              <Chat
                groupId={groupId}
                user={user}
                withoutName={true}
                isZoom={isFullScreenState}
              />
              <div className="wrapper-video-player">
                <video
                  className="video-watch"
                  poster="https://media.istockphoto.com/videos/movie-time-concept-background-video-id1127766856?s=640x640"
                  ref={videoWatchRef}
                  crossOrigin="anonymous"
                  onContextMenu={(e) => e.preventDefault()}
                  playsInline
                ></video>
                <div className="container-message-dialog">
                  <button
                    id="button-get-remote"
                    className="btn btn-danger"
                    onClick={async (e) => {
                      console.log("change remote", videoWatchRef.current);
                      if (
                        videoWatchRef.current &&
                        videoWatchRef.current.childElementCount > 0
                      ) {
                        videoWatchRef.current.controls = true;
                        const element = e.target;
                        addEventListenerVideoElement(videoWatchRef.current);
                        element.disabled = true;
                        await updateUserKeepRemote(groupId, user.userId);
                        socket.emit("user-keep-remote-changed", groupId);
                      }
                    }}
                  >
                    Get Remote
                  </button>
                  <button
                    className="btn btn-primary button-zoom"
                    onClick={() => {
                      updateAllowRemoveVideoWatch(false);
                      if (isFullScreenState) {
                        document
                          .getElementsByTagName("body")
                          .item(0).className = "";
                        setIsFullScreenState(false);
                      } else {
                        document
                          .getElementsByTagName("body")
                          .item(0).className = "hidden-scroll";
                        setIsFullScreenState(true);
                      }
                    }}
                  >
                    {!isFullScreenState ? (
                      <i className="fas fa-expand"></i>
                    ) : (
                      <i className="fas fa-compress"></i>
                    )}
                  </button>
                </div>
              </div>
              {isFullScreenState && (
                <div
                  className="button-display-control"
                  onClick={() => {
                    const e = document.querySelector(".container-message-zoom");
                    const chatBot = document.querySelector(".chat-bot");
                    if (e) {
                      if (chatBot.style.transform === "scale(0)") {
                        if (theaterState.unreadMessage !== 0)
                          socket.emit(
                            "new-user-seen",
                            user.avatarImage,
                            groupId
                          );
                        e.style.transform = "scale(1)";
                        chatBot.style.transform = "scale(1)";
                        chatBot.scroll({
                          top: chatBot.scrollHeight,
                          behavior: "smooth",
                        });
                        theaterStream.updateData({
                          unreadMessage: 0,
                        });
                      } else {
                        e.style.transform = "scale(0)";
                        chatBot.style.transform = "scale(0)";
                      }
                    }
                  }}
                >
                  <i className="far fa-bell fa-4x"></i>
                  {theaterState.unreadMessage !== 0 && (
                    <span className="number-unread-message">
                      {theaterState.unreadMessage}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="container-audio-call" ref={audioCallRef}></div>
          </div>
        </div>
      )}
      <div style={{ width: "300px" }} hidden={theaterState.isSignIn}>
        <Input
          label={"Password Room"}
          type={"password"}
          input={inputPasswordRef}
          error={errorPassword}
        />
      </div>
    </div>
  );
};

socket.on("reconnect", async () => {
  console.log("reconnect");
  if (theaterStream.currentState()) {
    const { isSignIn } = theaterStream.currentState();
    if (isSignIn) {
      if (!audioCallE)
        audioCallE = document.querySelector(".container-audio-call");
      await newUserJoinHandleVideo(audioCallE);
    }
  }
});

socket.on("mongo-change-watch", () => {
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateData({
      usersOnline: users,
    });
  });
});

function allowExitFullscreen(containerMessageDialog) {
  containerMessageDialog &&
    (containerMessageDialog.className = "container-message-dialog");
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen().catch(() => {});
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen().catch(() => {});
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen().catch(() => {});
  }
}

function allowFullscreen() {
  document.querySelector("#root").allowfullscreen = true;
  if (document.querySelector("#root").requestFullscreen) {
    document
      .querySelector("#root")
      .requestFullscreen()
      .catch(() => {});
  } else if (document.querySelector("#root").webkitRequestFullScreen) {
    document
      .querySelector("#root")
      .webkitRequestFullScreen()
      .catch(() => {});
  } else if (document.querySelector("#root").mozRequestFullScreen) {
    document
      .querySelector("#root")
      .mozRequestFullScreen()
      .catch(() => {});
  } else if (document.querySelector("#root").msRequestFullScreen) {
    document
      .querySelector("#root")
      .msRequestFullScreen()
      .catch(() => {});
  }
}

async function newUserJoinHandleVideo(
  audioCallE = document.querySelector(".container-audio-call")
) {
  const id = nanoid();
  let isError = false;
  updateUserIdNow(id);
  try {
    navigator.mediaDevices
      .getUserMedia({
        video: elementCall === "video" && true,
        audio: true,
      })
      .then((stream) => {
        let options = {
          host: window.location.origin.replace(/http(s)?:\/\//g, ""),
          path: "/peerjs",
        };
        if (process.env.NODE_ENV === "development") {
          options.host = "localhost";
          options.port = 5000;
        }
        myPeer = new Peer(id, options);
        const myAudio = document.createElement(elementCall);
        myAudio.muted = true;
        const buttonGetRemoteElement =
          document.getElementById("button-get-remote");
        socket.emit(
          "new-user",
          user.avatarImage,
          user.username,
          groupId,
          id,
          user.userId,
          buttonGetRemoteElement ? buttonGetRemoteElement.disabled : false
        );
        if (!audioCallE)
          audioCallE = document.querySelector(".container-audio-call");
        addAudioStream(myAudio, stream, audioCallE);
        appendNewMessageNotification(
          "Your " + elementCall + " is connected",
          notificationE,
          "audio-connected"
        );
        myPeer.on("open", (id) => {
          myAudio.id = id;
          myPeer.on("call", (call) => {
            call.answer(stream);
            const audio = document.createElement(elementCall);
            call.on("stream", (stream) => {
              if (!audioCallE)
                audioCallE = document.querySelector(".container-audio-call");
              addAudioStream(audio, stream, audioCallE);
            });
          });
        });
      })
      .catch(async (err) => {
        isError = true;
        await newUserJoin(id, groupId);
        console.log(err, ": join error 1");
      });
  } catch (error) {
    isError = true;
    console.log(error, ": join error 2");
  }
  if (isError) {
    await newUserJoin(id, groupId);
    console.log("user join error");
  }
}

async function newUserJoin(id, groupId) {
  const buttonGetRemoteElement = document.getElementById("button-get-remote");
  if (buttonGetRemoteElement) {
    socket.emit(
      "new-user",
      user.avatarImage,
      user.username,
      groupId,
      id,
      user.userId,
      buttonGetRemoteElement.disabled
    );
    socket.emit("fetch-updated-user-online");
  }
}

function UserListOnline({ usersOnline }) {
  return (
    <div className="user-list-online">
      <div className="title-room">Members Online</div>
      {usersOnline &&
        usersOnline.map((member, key) => {
          return (
            <div key={key}>
              <div
                style={{
                  color: member.keepRemote ? "red" : "",
                  margin: "0",
                }}
              >
                {member.username}
              </div>
            </div>
          );
        })}
    </div>
  );
}

function createVideoUri(inputVideoE) {
  if (inputVideoE.files[0] && inputVideoE.files[0].type === "video/mp4") {
    createNewVideo(URL.createObjectURL(inputVideoE.files[0]), false, undefined);
    inputVideoE.value = "";
  } else {
    alert("required file mp4");
  }
}

async function createNewVideo(source, uploadOtherUser = false, transcriptUrl) {
  uploadNewVideo(source, videoWatchElement, true, transcriptUrl);
  addEventListenerVideoElement(videoWatchElement);
  document.getElementById("button-get-remote").disabled = true;
  await updateUserKeepRemote(groupId, user.userId);
  socket.emit("new-video", source, groupId, uploadOtherUser, transcriptUrl);
}

async function updateUserKeepRemote(groupId, userId) {
  await Axios.put(
    `/api/theater/${groupId}/members`,
    {
      userId: userId,
      keepRemote: true,
    },
    {
      headers: {
        authorization: `Bearer ${idCartoonUser}`,
      },
    }
  );
}

function addEventListenerVideoElement(
  videoWatchElement = document.querySelector(".video-watch")
) {
  if (videoWatchElement && videoWatchElement.childElementCount > 0) {
    videoWatchElement.addEventListener("pause", socketPauseAll);
    videoWatchElement.addEventListener("play", socketPlayAll);
    videoWatchElement.addEventListener("ended", socketPauseAll);
  }
}

function removeEventListenerVideoElement(
  videoWatchElement = document.querySelector(".video-watch")
) {
  if (videoWatchElement && videoWatchElement.childElementCount > 0) {
    videoWatchElement.controls = false;
    videoWatchElement.removeEventListener("pause", socketPauseAll);
    videoWatchElement.removeEventListener("play", socketPlayAll);
    videoWatchElement.removeEventListener("ended", socketPauseAll);
  }
}

function socketPauseAll() {
  if (!videoWatchElement)
    videoWatchElement = document.querySelector(".video-watch");
  socket.emit("pause-all-video", videoWatchElement.currentTime, groupId);
}

function socketPlayAll() {
  if (!videoWatchElement)
    videoWatchElement = document.querySelector(".video-watch");
  socket.emit("play-all-video", videoWatchElement.currentTime, groupId);
}

socket.on("user-join", async (username, userId, roomId) => {
  if (roomId !== groupId) {
    return;
  }
  navigator.mediaDevices
    .getUserMedia({
      video: elementCall === "video" && true,
      audio: true,
    })
    .then((stream) => {
      if (!audioCallE)
        audioCallE = document.querySelector(".container-audio-call");
      connectToNewUser(userId, stream, audioCallE);
    })
    .catch((err) => {
      console.log(err);
    });
});

socket.on("disconnected-user", async (userId) => {
  // console.log(roomId, groupId);
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateData({
      usersOnline: users,
    });
  });
  if (peers[userId]) {
    peers[userId].close();
  }
  if (!audioCallE) audioCallE = document.querySelector(".container-audio-call");
  if (audioCallE) {
    const audioCallChildList = [...audioCallE.childNodes];
    audioCallChildList.forEach((child) => {
      if (!child.id) {
        child.muted = true;
        child.remove();
      }
    });
  }
});

socket.on("disconnect", () => {
  console.log("disconnect");
  socket.emit("disconnect-custom");
});

socket.on("fetch-user-online", () => {
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateData({
      usersOnline: users,
    });
  });
});
socket.on("play-video-user", (currentTime, idGroup) => {
  if (!videoWatchElement)
    videoWatchElement = document.querySelector(".video-watch");
  if (idGroup === groupId && videoWatchElement) {
    if (videoWatchElement.childElementCount > 0) {
      videoWatchElement
        .play()
        .then(() => {
          videoWatchElement.currentTime = currentTime;
        })
        .catch((error) => {});
    }
  }
});
socket.on("pause-video-user", (currentTime, idGroup) => {
  if (!videoWatchElement)
    videoWatchElement = document.querySelector(".video-watch");
  if (idGroup === groupId && videoWatchElement) {
    const playPromise = videoWatchElement.play();
    if (playPromise) {
      playPromise
        .then(() => {
          videoWatchElement.pause();
          videoWatchElement.currentTime = currentTime;
        })
        .catch((err) => {});
    }
  }
});

socket.on(
  "upload-video",
  (uri, idGroup, uploadVideoOtherUser, transcriptUrl) => {
    if (!videoWatchElement)
      videoWatchElement = document.querySelector(".video-watch");
    if (idGroup === groupId && videoWatchElement) {
      if (uploadVideoOtherUser) {
        uploadNewVideo(uri, videoWatchElement, false, transcriptUrl);
      }
      if (document.getElementById("button-get-remote")) {
        document.getElementById("button-get-remote").disabled = false;
      }
      removeEventListenerVideoElement(videoWatchElement);
    }
  }
);

socket.on("change-user-keep-remote", (idGroup) => {
  if (!videoWatchElement)
    videoWatchElement = document.querySelector(".video-watch");
  if (idGroup === groupId && videoWatchElement) {
    removeEventListenerVideoElement(videoWatchElement);
    if (document.getElementById("button-get-remote")) {
      document.getElementById("button-get-remote").disabled = false;
    }
  }
});

function uploadNewVideo(
  fileContent,
  videoWatchElement = document.querySelector(".video-watch"),
  isControls = false,
  transcriptUrl
) {
  try {
    if (fileContent && fileContent.trim() !== "") {
      videoWatchElement.controls = isControls;
      let sourceElement = videoWatchElement.querySelector("source");
      if (!sourceElement) {
        sourceElement = document.createElement("source");
        sourceElement.src = fileContent;
        sourceElement.type = "video/mp4";
        videoWatchElement.append(sourceElement);
      }
      if(sourceElement){
        sourceElement.src = fileContent;
        sourceElement.type = "video/mp4";
      }
    }
    if (transcriptUrl && transcriptUrl.trim() !== "") {
      let trackElement = videoWatchElement.querySelector("track");
      if(!trackElement){
        trackElement = document.createElement("track");
        trackElement.src = transcriptUrl.trim();
        trackElement.default = true;
        videoWatchElement.append(trackElement);
      }
      if(trackElement){
        trackElement.src = transcriptUrl.trim();
        trackElement.default = true;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function appendNewMessageNotification(
  message,
  notificationE = document.querySelector(".notification-user-join"),
  className
) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.style.wordWrap = "break-word";
  if (className) {
    messageElement.className += ` ${className}`;
  }
  if (notificationE) {
    notificationE.append(messageElement);
  }
}

function addAudioStream(audioElement, stream, audioGridElement) {
  audioElement.srcObject = stream;
  audioElement.addEventListener("loadedmetadata", () => {
    audioElement.play();
  });
  if (audioGridElement) {
    audioGridElement.append(audioElement);
  }
}

function connectToNewUser(userId, stream, audioGridElement) {
  const call = myPeer.call(userId, stream);
  if (!call) {
    return;
  }
  const audio = document.createElement(elementCall);
  call.on("stream", (userVideoStream) => {
    audio.id = userId;
    addAudioStream(audio, userVideoStream, audioGridElement);
  });
  call.on("close", () => {
    audio.remove();
    if (!audioCallE)
      audioCallE = document.querySelector(".container-audio-call");
    if (audioCallE) {
      const audioCallChildList = [...audioCallE.childNodes];
      audioCallChildList.forEach((child) => {
        if (!child.id) {
          child.muted = true;
          child.remove();
        }
      });
    }
  });
  peers[userId] = call;
}

async function fetchGroup(groupId, idCartoonUser) {
  const res = await Axios.get(`/api/theater/${groupId}`, {
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  });
  try {
    updateAllowFetchCurrentRoomDetail(false);
    updateSignIn(true);
    theaterStream.updateData({
      currentRoomDetail: res.data.message,
    });
  } catch (error) {}
}
export default TheaterWatch;
