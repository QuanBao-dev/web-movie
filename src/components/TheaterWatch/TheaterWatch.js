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
const replaySubject = new ReplaySubject(3);

const TheaterWatch = (props) => {
  groupId = props.match.params.groupId;
  replaySubject.next(groupId);
  user = userStream.currentState() || {};
  const [theaterState, setTheaterState] = useState(theaterStream.initialState);
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
      newUserJoinHandleVideo(audioCallRef.current);
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
      // console.log("out");
      videoWatchElement && (videoWatchElement.src = "");
      videoWatchElement && videoWatchElement.remove();
      videoWatchElement && (videoWatchElement.muted = true);
      videoWatchElement && removeEventListenerVideoElement(videoWatchElement);
    };
  }, [
    cookies.idCartoonUser,
    props.match.params.groupId,
    theaterState.allowFetchCurrentRoomDetail,
    theaterState.isSignIn,
  ]);
  if (!theaterState.isSignIn && notificationRef.current) {
    notificationRef.current.innerHTML = "";
    if (audioCallRef.current) {
      if (theaterState.usersOnline.length === 1) {
        // console.log("delete all");
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
  // console.log({ theaterState });
  return (
    <div className="theater-user-login">
      {theaterState.isSignIn && theaterState.currentRoomDetail && (
        <div className="section-center">
          <div className="notification-user-join" ref={notificationRef}></div>
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
                      // console.log(videoUrlUpload.current.value);
                      createNewVideo(videoUrlUpload.current.value, true);
                      videoUrlUpload.current.value = "";
                    }
                  }}
                >
                  Upload
                </button>
              </div>
              <input
                type="file"
                ref={inputVideoRef}
                onChange={() => {
                  createVideoUri(inputVideoRef.current);
                }}
              />
            </div>
            {theaterState.isSignIn && (
              <UserListOnline usersOnline={theaterState.usersOnline} />
            )}
            <div className="container-section-video">
              <div className="wrapper-video-button">
                <video
                  height="500px"
                  poster="https://videopromotion.club/assets/images/default-video-thumbnail.jpg"
                  ref={videoWatchRef}
                ></video>
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
              </div>
              <div className="container-message-dialog">
                <Chat groupId={groupId} user={user} />
              </div>
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

socket.on("greeting", async () => {
  console.log("hello");
  if (theaterStream.currentState()) {
    const { isSignIn } = theaterStream.currentState();
    if (isSignIn) {
      await newUserJoinHandleVideo(audioCallE);
    }
  }
});

socket.on("reconnect", async () => {
  console.log("reconnect");
  if (theaterStream.currentState()) {
    const { isSignIn } = theaterStream.currentState(); /////check if sign in = true then ...
    if (isSignIn) {
      await newUserJoinHandleVideo(audioCallE);
    }
  }
});

socket.on("mongo-change-watch",() => {
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateUsersOnline(users);
  });
})

function newUserJoinHandleVideo(audioCallE) {
  const id = nanoid();
  updateUserIdNow(id);
  try {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
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
        const myAudio = document.createElement("audio");
        myAudio.muted = true;
        myPeer.on("open", async (id) => {
          myAudio.id = id;
          console.log(groupId);
          socket.emit("new-user", user.username, groupId, id, user.email);
          addAudioStream(myAudio, stream, audioCallE);
          appendNewMessage(
            "Your audio is connected",
            notificationE,
            "audio-connected"
          );
          // connectToNewUser(id, stream, videoCallRef.current);
          myPeer.on("call", (call) => {
            call.answer(stream); //get the video of current user to other people
            const audio = document.createElement("audio");
            call.on("stream", (stream) => {
              // console.log("stream add another video");
              //get video of other user to the current user
              addAudioStream(audio, stream, audioCallE);
            });
          });
        });
        // console.log("stream add my video");
      })
      .catch(async (err) => {
        await newUserJoin(id, groupId);
        console.log(err);
      });
  } catch (error) {
    newUserJoin(id, groupId);
    console.log(error);
  }
}

async function newUserJoin(id, groupId) {
  console.log(user.username, groupId, id, user.email);
  socket.emit("new-user", user.username, groupId, id, user.email);
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
    // console.log(inputVideoE.files[0]);
    console.log(URL.createObjectURL(inputVideoE.files[0]));
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
  // removeEventListenerVideoElement(videoWatchElement);
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
  // console.log(roomId, groupId);
  if (roomId !== groupId) {
    return;
  }
  if (notificationE) {
    appendNewMessage(
      `${username} joined at ${new Date(Date.now()).toUTCString()}`,
      notificationE
    );
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((stream) => {
        connectToNewUser(userId, stream, audioCallE);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

socket.on("disconnected-user", async (username, userId, roomId) => {
  // console.log(roomId, groupId);
  if (roomId !== groupId) {
    return;
  }
  if (notificationE) {
    fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
      theaterStream.updateUsersOnline(users);
    });
    appendNewMessage(
      `${username} left at ${new Date(Date.now()).toUTCString()}`,
      notificationE,
      "disconnected-danger"
    );
    if (peers[userId]) {
      peers[userId].close();
      // delete peers[userId];
    } else {
      const audioCallChildList = [...audioCallE.childNodes];
      // console.log(videoCallChildList);
      audioCallChildList.forEach((child) => {
        if (!child.id) {
          child.muted = true;
          child.remove();
        }
      });
    }
  }
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
        .catch((error) => {
          console.log(error);
        });
    }
  }
});
socket.on("pause-video-user", (currentTime, idGroup) => {
  // console.log("group", idGroup, "current", groupId);
  if (idGroup === groupId && videoWatchElement) {
    const playPromise = videoWatchElement.play();
    if (playPromise) {
      playPromise
        .then(() => {
          videoWatchElement.pause();
          videoWatchElement.currentTime = currentTime;
        })
        .catch((err) => {
          console.log(err);
        });
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
  } catch (error) {
    console.log(error);
  }
}

function appendNewMessage(message, notificationE, className) {
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
  // console.log("other user", userId);
  const call = myPeer.call(userId, stream);
  const audio = document.createElement("audio");
  try {
    call.on("stream", (userVideoStream) => {
      audio.id = userId;
      addAudioStream(audio, userVideoStream, audioGridElement);
    });
    call.on("close", () => {
      audio.remove();
      const audioCallChildList = [...audioCallE.childNodes];
      // console.log(videoCallChildList);
      audioCallChildList.forEach((child) => {
        if (!child.id) {
          child.muted = true;
          child.remove();
        }
      });
      // console.log(userId, videoCallE.childNodes[0]);
      // console.log(videoCallE.childNodes[0].id,"first element");
    });
    peers[userId] = call;
  } catch (error) {
    console.log(error);
  }
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
  } catch (error) {
    console.log(error);
  }
}
export default TheaterWatch;
