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
let videoCallE;
let idCartoonUser;
let groupId;
let user;
socket.on("user-join", async (username, userId, roomId) => {
  console.log(roomId, groupId);
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
        video: true,
        audio: true,
      })
      .then((stream) => {
        connectToNewUser(userId, stream, videoCallE);
      });
  }
});
socket.on("disconnected-user", async (username, userId, roomId) => {
  console.log(roomId, groupId);
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
      const videoCallChildList = [...videoCallE.childNodes];
      console.log(videoCallChildList);
      videoCallChildList.forEach((child) => {
        if(!child.id){
          child.muted = true;
          child.remove()
        }
      })
      console.log(userId, videoCallE.childNodes[0]);
      console.log(videoCallE.childNodes[0].id,"first element");
    }
  }
});
socket.on("fetch-user-online", () => {
  fetchUserOnline$(groupId, idCartoonUser).subscribe((users) => {
    theaterStream.updateUsersOnline(users);
  });
});

const replaySubject = new ReplaySubject(3);
const TheaterWatch = (props) => {
  groupId = props.match.params.groupId;
  replaySubject.next(groupId);
  user = userStream.currentState() || {};
  const [theaterState, setTheaterState] = useState(theaterStream.initialState);
  const inputPasswordRef = useRef();
  const notificationRef = useRef();
  const videoCallRef = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);
  useEffect(() => {
    notificationE = notificationRef.current;
    videoCallE = videoCallRef.current;
    idCartoonUser = cookies.idCartoonUser;
    const subscription = theaterStream.subscribe(setTheaterState);
    theaterStream.init();
    let submitFormSub;
    if (theaterState.isSignIn) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          myPeer = new Peer(nanoid(), {
            host: "localhost",
            port: 5000,
            path: "/peerjs",
          });
          const myVideo = document.createElement("video");
          myVideo.muted = true;
          myPeer.on("open", async (id) => {
            myVideo.id = id;
            await Axios.post(
              `/api/theater/${groupId}/members`,
              {
                userId: id,
                username: user.username,
              },
              {
                headers: {
                  authorization: `Bearer ${idCartoonUser}`,
                },
              }
            );
            socket.emit("new-user", user.username, groupId, id);
            addVideoStream(myVideo, stream, videoCallRef.current);
            // connectToNewUser(id, stream, videoCallRef.current);
            myPeer.on("call", (call) => {
              call.answer(stream); //get the video of current user to other people
              const video = document.createElement("video");
              call.on("stream", (stream) => {
                // console.log("stream add another video");
                //get video of other user to the current user
                addVideoStream(video, stream, videoCallE);
              });
            });
          });
          // console.log("stream add my video");
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
      console.log("out");
    };
  }, [
    cookies.idCartoonUser,
    props.match.params.groupId,
    theaterState.allowFetchCurrentRoomDetail,
    theaterState.isSignIn,
  ]);
  if (!theaterState.isSignIn && notificationRef.current) {
    notificationRef.current.innerHTML = "";
    if (videoCallRef.current) {
      if (theaterState.usersOnline.length === 1) {
        console.log("delete all");
        replaySubject.pipe(first()).subscribe((groupId) => {
          deleteAllMembers(groupId);
        });
      }
      theaterState.usersOnline = [];
      videoCallRef.current.innerHTML = "";
      socket.emit("disconnect-custom");
    }
  }
  console.log(theaterState);
  return (
    <div className="theater-user-login">
      {theaterState.isSignIn && theaterState.currentRoomDetail && (
        <div>
          <div className="notification-user-join" ref={notificationRef}></div>
          {theaterState.currentRoomDetail.roomName}
          <div className="container-video">Video watch</div>
          <div className="container-video-call" ref={videoCallRef}></div>
          <input type="file" />
        </div>
      )}
      {theaterState.isSignIn && (
        <div className="user-list-online">
          Member Online
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

function addVideoStream(videoElement, stream, videoGridElement) {
  videoElement.srcObject = stream;
  videoElement.addEventListener("loadedmetadata", () => {
    videoElement.play();
  });
  if (videoGridElement) {
    videoGridElement.append(videoElement);
  }
}

function connectToNewUser(userId, stream, videoGridElement) {
  console.log("other user",userId);
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  try {
    call.on("stream", (userVideoStream) => {
      video.id = userId;
      addVideoStream(video, userVideoStream, videoGridElement);
    });
    call.on("close", () => {
      video.remove();
      const videoCallChildList = [...videoCallE.childNodes];
      console.log(videoCallChildList);
      videoCallChildList.forEach((child) => {
        if(!child.id){
          child.muted = true;
          child.remove()
        }
      })
      console.log(userId, videoCallE.childNodes[0]);
      console.log(videoCallE.childNodes[0].id,"first element");
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
