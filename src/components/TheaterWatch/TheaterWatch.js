import "./TheaterWatch.css";

import Axios from "axios";
import { nanoid } from "nanoid";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { ReplaySubject } from "rxjs";
import { first } from "rxjs/operators";

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
import Input from "../Input/Input";
import Chat from "../Chat/Chat";

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
  const inputPasswordRef = useRef();
  const notificationRef = useRef();
  const audioCallRef = useRef();
  const inputVideoRef = useRef();
  const videoWatchRef = useRef();
  const videoUrlUpload = useRef();
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
        newUserJoinHandleVideo(audioCallRef.current);
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
        cookies.idCartoonUser
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
  if (!theaterState.isSignIn && notificationRef.current) {
    notificationRef.current.innerHTML = "";
    if (audioCallRef.current) {
      if (theaterState.usersOnline.length === 1) {
        replaySubject.pipe(first()).subscribe((groupId) => {
          deleteAllMembers(groupId);
        });
      }
      theaterState.usersOnline = [];
      audioCallRef.current.innerHTML = "";
      updateSignIn(false);
      socket.emit("disconnect-custom");
    }
  }
  // console.log(theaterState);
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
                      createNewVideo(videoUrlUpload.current.value, true);
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
                  poster="https://videopromotion.club/assets/images/default-video-thumbnail.jpg"
                  ref={videoWatchRef}
                ></video>
                <div className="container-message-dialog">
                  <button
                    id="button-get-remote"
                    className="btn btn-danger"
                    onClick={async (e) => {
                      if (videoWatchElement && videoWatchElement.src) {
                        videoWatchElement.controls = true;
                        const element = e.target;
                        addEventListenerVideoElement(videoWatchElement);
                        element.disabled = true;
                        await updateUserKeepRemote(groupId, user.email);
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
                        e.style.transform = "scale(1)";
                        chatBot.style.transform = "scale(1)";
                        chatBot.scroll({
                          top: chatBot.scrollHeight,
                          behavior: "smooth",
                        });
                        theaterStream.updateUnreadMessage(0);
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
      await newUserJoinHandleVideo(audioCallE);
    }
  }
});

socket.on("mongo-change-watch", () => {
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateUsersOnline(users);
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

function newUserJoinHandleVideo(audioCallE) {
  const id = nanoid();
  updateUserIdNow(id);
  try {
    navigator.mediaDevices
      .getUserMedia({
        video: elementCall === "video" && true,
        audio: true,
      })
      .then((stream) => {
        let options = {
          host: "my-web-movie.herokuapp.com",
          path: "/peerjs",
        };
        if (process.env.NODE_ENV === "development") {
          options.host = "localhost";
          options.port = 5000;
        }
        myPeer = new Peer(id, options);
        const myAudio = document.createElement(elementCall);
        myAudio.muted = true;
        //TODO
        myPeer.on("open", async (id) => {
          myAudio.id = id;
          const buttonGetRemoteElement = document.getElementById(
            "button-get-remote"
          );
          socket.emit(
            "new-user",
            user.username,
            groupId,
            id,
            user.email,
            buttonGetRemoteElement.disabled
          );
          addAudioStream(myAudio, stream, audioCallE);
          appendNewMessageNotification(
            "Your " + elementCall + " is connected",
            notificationE,
            "audio-connected"
          );
          myPeer.on("call", (call) => {
            call.answer(stream);
            const audio = document.createElement(elementCall);
            call.on("stream", (stream) => {
              addAudioStream(audio, stream, audioCallE);
            });
          });
        });
      })
      .catch(async (err) => {
        await newUserJoin(id, groupId);
        console.log(err);
      });
  } catch (error) {
    newUserJoin(id, groupId);
  }
}

async function newUserJoin(id, groupId) {
  const buttonGetRemoteElement = document.getElementById("button-get-remote");
  console.log(buttonGetRemoteElement);
  socket.emit(
    "new-user",
    user.username,
    groupId,
    id,
    user.email,
    buttonGetRemoteElement.disabled
  );
  socket.emit("fetch-updated-user-online");
}

function UserListOnline({ usersOnline }) {
  return (
    <div className="user-list-online">
      <div className="title-room">Member Online</div>
      {usersOnline &&
        usersOnline.map((member, key) => {
          return (
            <div key={key}>
              <p
                style={{
                  color: member.keepRemote ? "red" : "",
                }}
              >
                {member.username}
              </p>
            </div>
          );
        })}
    </div>
  );
}

function createVideoUri(inputVideoE) {
  if (inputVideoE.files[0] && inputVideoE.files[0].type === "video/mp4") {
    createNewVideo(URL.createObjectURL(inputVideoE.files[0]));
    inputVideoE.value = "";
  } else {
    alert("required file mp4");
  }
}

async function createNewVideo(source, uploadOtherUser = false) {
  uploadNewVideo(source, videoWatchElement, true);
  addEventListenerVideoElement(videoWatchElement);
  document.getElementById("button-get-remote").disabled = true;
  await updateUserKeepRemote(groupId, user.email);
  socket.emit("new-video", source, groupId, uploadOtherUser);
}

async function updateUserKeepRemote(groupId, email) {
  await Axios.put(
    `/api/theater/${groupId}/members`,
    {
      email: email,
      keepRemote: true,
    },
    {
      headers: {
        authorization: `Bearer ${idCartoonUser}`,
      },
    }
  );
}

function addEventListenerVideoElement(videoWatchElement) {
  if (videoWatchElement && videoWatchElement.src) {
    videoWatchElement.addEventListener("pause", socketPauseAll);
    videoWatchElement.addEventListener("play", socketPlayAll);
    videoWatchElement.addEventListener("ended", socketPauseAll);
  }
}

function removeEventListenerVideoElement(videoWatchElement) {
  if (videoWatchElement && videoWatchElement.src) {
    videoWatchElement.controls = false;
    videoWatchElement.removeEventListener("pause", socketPauseAll);
    videoWatchElement.removeEventListener("play", socketPlayAll);
    videoWatchElement.removeEventListener("ended", socketPauseAll);
  }
}

function socketPauseAll() {
  socket.emit("pause-all-video", videoWatchElement.currentTime, groupId);
}

function socketPlayAll() {
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
      connectToNewUser(userId, stream, audioCallE);
    })
    .catch((err) => {
      console.log(err);
    });
});

socket.on("disconnected-user", async (username, userId, roomId) => {
  // console.log(roomId, groupId);
  if (roomId !== groupId) {
    return;
  }
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateUsersOnline(users);
  });
  if (audioCallE)
    if (peers[userId]) {
      peers[userId].close();
    } else {
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
    theaterStream.updateUsersOnline(users);
  });
});
socket.on("play-video-user", (currentTime, idGroup) => {
  if (idGroup === groupId && videoWatchElement) {
    if (videoWatchElement.src && videoWatchElement.src !== "") {
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

socket.on("upload-video", (uri, idGroup, uploadVideoOtherUser) => {
  if (idGroup === groupId && videoWatchElement) {
    if (uploadVideoOtherUser) {
      uploadNewVideo(uri, videoWatchElement);
    }
    if (document.getElementById("button-get-remote")) {
      document.getElementById("button-get-remote").disabled = false;
    }
    removeEventListenerVideoElement(videoWatchElement);
  }
});

socket.on("change-user-keep-remote", (idGroup) => {
  if (idGroup === groupId && videoWatchElement) {
    removeEventListenerVideoElement(videoWatchElement);
    if (document.getElementById("button-get-remote")) {
      document.getElementById("button-get-remote").disabled = false;
    }
  }
});

function uploadNewVideo(fileContent, videoWatchElement, isControls = false) {
  try {
    videoWatchElement.controls = isControls;
    videoWatchElement.src = fileContent;
  } catch (error) {}
}

function appendNewMessageNotification(message, notificationE, className) {
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

async function deleteAllMembers(groupId) {
  await Axios.delete(`/api/theater/${groupId}/members`, {
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  });
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
    const audioCallChildList = [...audioCallE.childNodes];
    audioCallChildList.forEach((child) => {
      if (!child.id) {
        child.muted = true;
        child.remove();
      }
    });
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
    theaterStream.updateCurrentRoomDetail(res.data.message);
  } catch (error) {}
}
export default TheaterWatch;
