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
} from "../../store/theater";
import Input from "../Input/Input";

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
      navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: true,
        })
        .then((stream) => {
          myPeer = new Peer(nanoid(), {
            host: "my-web-movie.herokuapp.com",
            // host: "localhost",
            // port: 5000,
            path: "/peerjs",
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
          });
          // const tracks = stream.getAudioTracks();
          // console.log(tracks);
          const myAudio = document.createElement("audio");
          myAudio.muted = true;
          myPeer.on("open", async (id) => {
            myAudio.id = id;
            await Axios.post(
              `/api/theater/${groupId}/members`,
              {
                userId: id,
                username: user.username,
                email: user.email,
              },
              {
                headers: {
                  authorization: `Bearer ${idCartoonUser}`,
                },
              }
            );
            socket.emit("new-user", user.username, groupId, id, user.email);
            addAudioStream(myAudio, stream, audioCallRef.current);
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
          const id = nanoid();
          socket.emit("new-user", user.username, groupId, id, user.email);
          await Axios.post(
            `/api/theater/${groupId}/members`,
            {
              userId: id,
              username: user.username,
              email: user.email,
            },
            {
              headers: {
                authorization: `Bearer ${idCartoonUser}`,
              },
            }
          );
          console.log(err);
        });
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
      socket.emit("disconnect-custom");
    }
  }
  // console.log(theaterState);
  return (
    <div className="theater-user-login">
      {theaterState.isSignIn && theaterState.currentRoomDetail && (
        <div className="section-center">
          <div className="notification-user-join" ref={notificationRef}></div>
          <div>
            <h1 className="title-room">
              {theaterState.currentRoomDetail.roomName}
            </h1>
            <div> Video watch</div>
            <input
              type="file"
              ref={inputVideoRef}
              onChange={() => createVideoUri(inputVideoRef.current)}
            />
            <div className="container-section-video">
              <video ref={videoWatchRef}></video>
              <MessageDialog />
            </div>
            <div className="container-audio-call" ref={audioCallRef}></div>
          </div>
        </div>
      )}
      {theaterState.isSignIn && (
        <div className="user-list-online">
          <div className="title-room">Member Online</div>
          {theaterState.usersOnline &&
            theaterState.usersOnline.map((member, key) => {
              return (
                <div key={key}>
                  <p>{member.username}</p>
                </div>
              );
            })}
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

function MessageDialog() {
  return (
    <div className="message-dialog-container">
      <div className="message-dialog">
        <span>1:03 </span>
        <span>Hello</span>
      </div>
      <div className="input-message-dialog">
        <Input label={"Your comment"} />
      </div>
    </div>
  );
}

function createVideoUri(inputVideoE) {
  const reader = new FileReader();
  // console.log("submit");
  reader.onload = function (file) {
    const fileContent = file.target.result;
    socket.emit("new-video", fileContent);
    // uploadNewVideo(fileContent, videoWatchRef.current);
  };
  reader.readAsDataURL(inputVideoE.files[0]);
  inputVideoE.value = "";
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
socket.on("play-video-user", (currentTime) => {
  videoWatchElement.play();
  videoWatchElement.currentTime = currentTime;
});
socket.on("pause-video-user", () => {
  videoWatchElement.pause();
});
socket.on("end-video-user", () => {
  socket.emit("pause-all-video");
});

socket.on("upload-video", (uri) => {
  uploadNewVideo(uri, videoWatchElement);
  videoWatchElement.onended = () => {
    socket.emit("end-all-video");
  };
  videoWatchElement.oncanplay = () => {
    videoWatchElement.onplay = () => {
      socket.emit("play-all-video", videoWatchElement.currentTime);
    };
    videoWatchElement.onpause = () => {
      socket.emit("pause-all-video");
    };
  };
});

function uploadNewVideo(fileContent, videoWatchElement) {
  videoWatchElement.controls = true;
  videoWatchElement.src = fileContent;
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
