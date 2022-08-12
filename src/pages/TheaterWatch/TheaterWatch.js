import "./TheaterWatch.css";

import loadable from "@loadable/component";
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
import { useHistory } from "react-router-dom";
import navBarStore from "../../store/navbar";

const Chat = loadable(() => import("../../components/Chat/Chat"), {
  fallback: <i className="fas fa-spinner fa-9x fa-spin"></i>,
});

const socket = theaterStream.socket;
const peers = {};
let notificationE;
let idCartoonUser;
let groupId;
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
  const checkBoxVideoRef = useRef();
  const checkBoxRef = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);
  const history = useHistory();
  useEffect(() => {
    if (!theaterState.isReconnect) {
      return;
    }
    console.log("Reconnect");
    if (theaterState.videoUrl) {
      reconnectVideoWatch(theaterState, videoWatchRef);
    }
    theaterStream.updateData({ isReconnect: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theaterState.timePlayingVideo]);

  async function newUserJoinHandleVideo(isReconnect = false, isVideo = false) {
    if (isReconnect) {
      if (isVideo) alert("Please turn on your webcam");
      reconnectPeer(
        history,
        isVideo,
        theaterState.groupId,
        videoWatchRef.current
      );
    }
    if (!isReconnect) {
      if (!userStream.currentState()) {
        return;
      }
      const userId = userStream.currentState().userId;
      let isError = false;
      try {
        navigator.mediaDevices
          .getUserMedia({
            video: isVideo,
            audio: true,
          })
          .then((stream) => {
            const peerRandomId = v4();
            theaterStream.updateData({ peerId: peerRandomId });
            myPeer = new Peer(peerRandomId, options);
            function connectToNewUser(peerId, stream, audioGridElement) {
              if (!myPeer) return;
              let call = myPeer.call(peerId, stream);
              if (!call) {
                return;
              }
              const audio = document.createElement("video");
              call.on("stream", (userVideoStream) => {
                audio.id = peerId;
                peers[call.peer] = call;
                addDeviceStream(
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
            socket.emit(
              "new-user",
              userStream.currentState().avatarImage,
              userStream.currentState().username,
              groupId,
              userId,
              myPeer.id
            );
            socket.on("user-join", (peerId, roomId) => {
              if (roomId !== groupId) {
                return;
              }
              connectToNewUser(peerId, stream, audioCallRef.current);
            });
            myAudio.id = myPeer.id;
            addDeviceStream(myAudio, stream, audioCallRef.current, myPeer.id);
            myPeer.on("call", (call) => {
              call.answer(stream);
              const audio = document.createElement("video");
              call.on("stream", (userVideoStream) => {
                audio.id = call.peer;
                peers[call.peer] = call;
                addDeviceStream(
                  audio,
                  userVideoStream,
                  audioCallRef.current,
                  call.peer
                );
              });
              call.on("close", () => {
                audio.remove();
              });
            });
            myPeer.on("error", (error) => {
              console.error(error);
            });

            if (!document.querySelector(".audio-connected"))
              appendNewMessageNotification(
                "Your device is connected",
                notificationE,
                "audio-connected"
              );
          })
          .catch(async (err) => {
            isError = true;
            alert("Failing access your device call");
            await newUserJoin(userId, groupId);
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
  }
  useEffect(() => {
    theaterStream.updateData({ groupId });

    socket.on("disconnected-user", async (peerId) => {
      if (peers[peerId]) {
        peers[peerId].close();
        delete peers[peerId];
      }
    });

    // socket.on("reconnect", async () => {
    //   console.log("reconnect");
    //   if (theaterStream.currentState()) {
    //     const { isSignIn } = theaterStream.currentState();
    //     if (isSignIn) {
    //       await newUserJoin(userStream.currentState().userId, groupId);
    //     }
    //   }
    // });
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
        newUserJoinHandleVideo(false, theaterState.isVideoCall);
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
          theaterStream.updateData({ modeRoom: false });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cookies.idCartoonUser,
    isFullScreenState,
    props.match.params.groupId,
    theaterState.allowFetchCurrentRoomDetail,
    theaterState.allowRemoveVideoWatch,
    theaterState.isSignIn,
    theaterState.isVideoCall,
  ]);

  useEffect(() => {
    if (audioCallRef.current) {
      [...audioCallRef.current.children].forEach((child) => {
        const user = theaterState.usersOnline.find(
          (user) => user.peerId === child.id
        );
        if (user) {
          child.poster = user.avatar;
          child.title = user.username;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theaterState.peerId, theaterState.usersOnline]);

  if (!theaterState.isSignIn && notificationRef.current) {
    notificationRef.current.innerHTML = "";
    if (audioCallRef.current) {
      if (theaterState.usersOnline.length === 1) {
        replaySubject.pipe(first()).subscribe((groupId) => {
          socket.emit(
            "delete-specific-member",
            userStream.currentState().peerId,
            groupId
          );
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
              <div className="input-section-3">
                <div>
                  <input
                    id="checkbox-video-call"
                    type="checkbox"
                    ref={checkBoxVideoRef}
                    defaultChecked={theaterState.isVideoCall}
                  ></input>
                  <label htmlFor="checkbox-video-call">Video</label>
                </div>
                <button
                  className="button-check-video-call"
                  onClick={() => {
                    newUserJoinHandleVideo(
                      true,
                      checkBoxVideoRef.current.checked
                    );
                  }}
                >
                  Reconnect
                </button>
              </div>
            </div>

            <div
              title={"Users call"}
              className="container-audio-call"
              ref={audioCallRef}
              style={{
                display:
                  theaterState.usersOnline[0] &&
                  theaterState.usersOnline[0].userId !==
                    theaterState.usersOnline[0].peerId
                    ? "flex"
                    : "none",
              }}
            ></div>

            {theaterState.isSignIn && (
              <UserListOnline usersOnline={theaterState.usersOnline} />
            )}
            <div className="container-section-video">
              <Chat
                groupId={groupId}
                user={userStream.currentState()}
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
                      const element = e.target;
                      element.disabled = true;
                      addEventListenerVideoElement(videoWatchRef.current);
                      await updateUserKeepRemote(
                        groupId,
                        userStream.currentState().userId
                      );
                      socket.emit("user-keep-remote-changed", groupId);
                      videoWatchRef.current.controls = true;
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
                            userStream.currentState().avatarImage,
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

function reconnectVideoWatch(theaterState, videoWatchRef) {
  uploadNewVideo(theaterState.videoUrl, videoWatchElement, false, null);
  videoWatchRef.current.addEventListener("loadedmetadata", async () => {
    if (theaterState.isVideoWatchPlaying) videoWatchRef.current.play();
    removeEventListenerVideoElement(videoWatchRef.current);
    videoWatchRef.current.controls = false;
    document.getElementById("button-get-remote").disabled = false;
    videoWatchRef.current.currentTime = theaterState.timePlayingVideo;
  });
}

function reconnectPeer(history, isVideoCall, groupId, videoWatchElement) {
  navBarStore.updateIsShowBlockPopUp(true);
  theaterStream.updateData({
    isReconnect: true,
    timePlayingVideo: videoWatchElement.currentTime,
    videoUrl: videoWatchElement.src,
    isVideoCall: isVideoCall,
    isVideoWatchPlaying: !videoWatchElement.paused,
  });
  history.push("/theater");
  setTimeout(() => {
    history.push("/theater/" + groupId);
    navBarStore.updateIsShowBlockPopUp(false);
  }, 1000);
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
  socket.emit(
    "new-user",
    userStream.currentState().avatarImage,
    userStream.currentState().username,
    groupId,
    id,
    id
  );
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
  await updateUserKeepRemote(groupId, userStream.currentState().userId);
  socket.emit("new-video", source, groupId, uploadOtherUser, transcriptUrl);
}

async function updateUserKeepRemote(groupId, userId) {
  await fetch(`/api/theater/${groupId}/members`, {
    method: "PUT",
    body: JSON.stringify({
      userId: userId,
      keepRemote: true,
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${idCartoonUser}`,
    },
  });
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
  if (videoWatchElement) {
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

socket.on("mongo-change-watch", () => {
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

function addDeviceStream(deviceElement, stream, deviceGridElement, peerId) {
  if (!deviceGridElement) return;
  deviceElement.id = peerId;
  deviceElement.srcObject = stream;
  deviceElement.poster =
    "https://www.kindpng.com/picc/m /24-248253_user-profile-default-image-png-clipart-png-download.png";
  deviceElement.addEventListener("loadedmetadata", () => {
    deviceElement.play();
  });
  deviceElement.addEventListener("click", (e) => {
    console.log(e.target);
    e.target.isMuted = !e.target.isMuted;
    e.target.className = e.target.isMuted ? "video-muted" : "";
    e.target.title = e.target.isMuted
      ? `${e.target.title.replace(/ muted/g, "")} muted`
      : `${e.target.title.replace(/ muted/g, "")}`;
  });
  const children = [...deviceGridElement.children];
  children.forEach((child) => {
    if (child.id === peerId) {
      child.remove();
    }
  });
  deviceGridElement.append(deviceElement);
  [...deviceGridElement.children].forEach((child) => {
    const user = theaterStream
      .currentState()
      .usersOnline.find((user) => user.peerId === child.id);
    if (user) {
      child.poster = user.avatar;
      child.isControls = true;
      child.title = user.username;
    }
  });
}

async function fetchGroup(groupId, idCartoonUser) {
  const res = await fetch(`/api/theater/${groupId}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  });
  const resJson = await res.json();
  try {
    updateAllowFetchCurrentRoomDetail(false);
    updateSignIn(true);
    theaterStream.updateData({
      currentRoomDetail: resJson.message,
    });
  } catch (error) {}
}
export default TheaterWatch;
