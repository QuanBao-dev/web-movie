import "./TheaterWatch.css";

import loadable from "@loadable/component";
import Axios from "axios";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { of, ReplaySubject, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, first, map, pluck, concatMapTo } from "rxjs/operators";

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
} from "../../store/theater";
import { v4 } from "uuid";

const Chat = loadable(() => import("../../components/Chat/Chat"), {
  fallback: <i className="fas fa-spinner fa-9x fa-spin"></i>,
});

const socket = theaterStream.socket;
const peers = {};
let notificationE;
let idCartoonUser;
let groupId;
let user;
let videoWatchElement;
const options = {
  host: "web-rtc-myanimefun.herokuapp.com",
  secure: true,
  path: "/",
  config: {
    iceServers: [
      { url: "stun:stun01.sipphone.com" },
      { url: "stun:stun.ekiga.net" },
      { url: "stun:stunserver.org" },
      { url: "stun:stun.softjoys.com" },
      { url: "stun:stun.voiparound.com" },
      { url: "stun:stun.voipbuster.com" },
      { url: "stun:stun.voipstunt.com" },
      { url: "stun:stun.voxgratia.org" },
      { url: "stun:stun.xten.com" },
      { url: "stun:stun.l.google.com:19302" },
      { url: "stun:stun1.l.google.com:19302" },
      { url: "stun:stun2.l.google.com:19302" },
      { url: "stun:stun3.l.google.com:19302" },
      { url: "stun:stun4.l.google.com:19302" },
      {
        url: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
      {
        url: "turn:192.158.29.39:3478?transport=udp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
      {
        url: "turn:192.158.29.39:3478?transport=tcp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
    ],
  },
};

const replaySubject = new ReplaySubject(3);
let myPeer;
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
  // const checkBoxVideoRef = useRef();
  const checkBoxRef = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);

  async function newUserJoinHandleVideo(isReconnect = false, isVideo = false) {
    const userId = userStream.currentState().userId;
    let isError = false;
    try {
      navigator.mediaDevices
        .getUserMedia({
          video: isVideo,
          audio: true,
        })
        .then((stream) => {
          myPeer = new Peer(v4(), options);
          function connectToNewUser(peerId, stream, audioGridElement) {
            let call = myPeer.call(peerId, stream);
            if (!call) {
              return;
            }
            const audio = document.createElement("video");
            call.on("stream", (userVideoStream) => {
              audio.id = peerId;
              reconnectDeviceStream(
                audio,
                userVideoStream,
                audioGridElement,
                peerId
              );
            });
            call.on("close", () => {
              audio.remove();
            });
            peers[peerId] = call;
          }
          const myAudio = document.createElement("video");
          myAudio.muted = true;
          const buttonGetRemoteElement =
            document.getElementById("button-get-remote");

          if (!isReconnect) {
            console.log(myPeer.id);
            socket.emit(
              "new-user",
              user.avatarImage,
              user.username,
              groupId,
              userId,
              myPeer.id,
              user.userId,
              buttonGetRemoteElement ? buttonGetRemoteElement.disabled : false
            );
            socket.on("user-join", (peerId, roomId) => {
              if (roomId !== groupId) {
                return;
              }
              connectToNewUser(peerId, stream, audioCallRef.current);
            });
          } else {
            console.log(myPeer.id, "reconnect");
            socket.emit("device-reconnect", myPeer.id, groupId);
            socket.on("connect-device-to-others", (peerId, roomId) => {
              if (roomId !== groupId) {
                return;
              }
              connectToNewUser(peerId, stream, audioCallRef.current);
            });
          }

          if (!document.querySelector(".audio-connected"))
            appendNewMessageNotification(
              "Your device is connected",
              notificationE,
              "audio-connected"
            );
          myAudio.id = myPeer.id;
          reconnectDeviceStream(
            myAudio,
            stream,
            audioCallRef.current,
            myPeer.id
          );
          myPeer.on("error", (id) => {
            console.log(id);
          });
          myPeer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
              const audio = document.createElement("video");
              audio.id = call.peer;
              peers[call.peer] = call;
              reconnectDeviceStream(
                audio,
                userVideoStream,
                audioCallRef.current,
                call.peer
              );
            });
          });
        })
        .catch(async (err) => {
          if (isReconnect) {
            alert("Please turn on your webcam");
          }
          isError = true;
          if (!isReconnect) await newUserJoin(userId, groupId);
          console.log(err, ": join error 1");
        });
    } catch (error) {
      isError = true;
      console.log(error, ": join error 2");
    }
    if (isError && !isReconnect) {
      await newUserJoin(userId, groupId);
      console.log("user join error");
    }
  }
  useEffect(() => {
    socket.on("disconnected-user", async (peerId) => {
      console.log(peerId, "disconnected user");
      console.log(peers);
      if (peers[peerId]) {
        peers[peerId].close();
        delete peers[peerId];
      }
      if (audioCallRef.current) {
        const childrenElementList = [...audioCallRef.current.children];
        childrenElementList.forEach((child) => {
          if (child.id === peerId) {
            child.remove();
          }
        });
      }
    });

    socket.on("reconnect", async () => {
      console.log("reconnect");
      if (theaterStream.currentState()) {
        const { isSignIn } = theaterStream.currentState();
        if (isSignIn) {
          await newUserJoin(userStream.currentState().userId, groupId);
        }
      }
    });
  }, []);
  useEffect(() => {
    let subscription;
    if (theaterState.isSignIn) {
      subscription = timer(2000)
        .pipe(
          concatMapTo(
            ajax({
              url: "/api/theater/" + groupId + "/members",
              headers: { authorization: "Bearer " + cookies.idCartoonUser },
            }).pipe(
              pluck("response", "message"),
              catchError((error) =>
                of(error).pipe(
                  pluck("response", "error"),
                  map(() => ({ error }))
                )
              )
            )
          )
        )
        .subscribe((res) => {
          if (!res.error) {
            theaterStream.updateData({
              usersOnline: res,
            });
          }
        });
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theaterState.isSignIn]);
  useEffect(() => {
    videoWatchElement = videoWatchRef.current;
    notificationE = notificationRef.current;
    idCartoonUser = cookies.idCartoonUser;
    const subscription = theaterStream.subscribe(setTheaterState);
    theaterStream.init();
    let submitFormSub;
    if (!theaterState.isSignIn) {
      if (myPeer) {
        myPeer.disconnect();
        myPeer = null;
      }
    }
    if (theaterState.isSignIn) {
      if (theaterStream.currentState().allowUserJoin) {
        // if (!socket.connected) theaterStream.socket.connect();
        newUserJoinHandleVideo(false, false);
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
      // socket.emit("disconnect-custom");
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
              <div className="input-section-1">
                <div
                  style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Input label={"Video url"} input={videoUrlUpload} />
                  <Input label={"Transcript url"} input={transcriptUrlUpload} />
                </div>
                <div className="input-checkbox">
                  <span>
                    <input
                      id="update-other"
                      type="checkbox"
                      ref={checkBoxRef}
                    />
                    <label htmlFor="update-other">
                      Share with other members
                    </label>
                  </span>
                  <button
                    onClick={() => {
                      if (videoUrlUpload.current.value !== "") {
                        createNewVideo(
                          videoUrlUpload.current.value,
                          checkBoxRef.current.checked,
                          undefined
                        );
                      }

                      if (transcriptUrlUpload.current.value !== "") {
                        createNewVideo(
                          undefined,
                          checkBoxRef.current.checked,
                          transcriptUrlUpload.current.value
                        );
                      }
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="input-section-2">
                <input
                  type="file"
                  ref={inputVideoRef}
                  onChange={() => createVideoUri(inputVideoRef.current)}
                />
              </div>
              {/* <div className="input-section-3">
                <input type="checkbox" ref={checkBoxVideoRef}></input>
                <label>Video</label>
                <button
                  onClick={() => {
                    if (myPeer) {
                      console.log("disconnect", myPeer.id);
                      const children = [...audioCallRef.current.children];
                      children.forEach((child) => {
                        if (child.id === myPeer.id) {
                          child.remove();
                        }
                      });
                      myPeer = null;
                    }
                    newUserJoinHandleVideo(
                      true,
                      checkBoxVideoRef.current.checked
                    );
                  }}
                >
                  Reconnect
                </button>
              </div> */}
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
                  onContextMenu={(e) => e.preventDefault()}
                  playsInline
                ></video>
                <div className="container-message-dialog">
                  <button
                    id="button-get-remote"
                    className="btn btn-danger"
                    onClick={async (e) => {
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

socket.on("mongo-change-watch", () => {
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateData({
      usersOnline: users,
    });
  });
});
function checkStream(stream) {
  var hasMedia = { hasVideo: false, hasAudio: false };

  if (stream.getAudioTracks().length)
    // checking audio presence
    hasMedia.hasAudio = true;

  if (stream.getVideoTracks().length)
    // checking video presence
    hasMedia.hasVideo = true;

  return hasMedia;
}
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
    // socket.emit("fetch-updated-user-online");
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
      videoWatchElement.src = fileContent;
      let sourceElement = videoWatchElement.querySelector("source");
      if (!sourceElement) {
        sourceElement = document.createElement("source");
        sourceElement.src = fileContent;
        sourceElement.type = "video/mp4";
        videoWatchElement.append(sourceElement);
      }
      if (sourceElement) {
        sourceElement.src = fileContent;
        sourceElement.type = "video/mp4";
      }
    }
    if (transcriptUrl && transcriptUrl.trim() !== "") {
      let trackElement = videoWatchElement.querySelector("track");
      if (!trackElement) {
        trackElement = document.createElement("track");
        trackElement.src = transcriptUrl.trim();
        trackElement.default = true;
        videoWatchElement.append(trackElement);
      }
      if (trackElement) {
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

function reconnectDeviceStream(
  deviceElement,
  stream,
  deviceGridElement,
  userId
) {
  deviceElement.srcObject = stream;
  deviceElement.addEventListener("loadedmetadata", () => {
    deviceElement.play();
  });
  const children = [...deviceGridElement.children];
  children.forEach((child) => {
    if (child.id === userId) {
      child.remove();
    }
  });
  deviceElement.id = userId;
  deviceGridElement.append(deviceElement);
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
