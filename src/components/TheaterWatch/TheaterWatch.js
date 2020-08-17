import "./TheaterWatch.css";

import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

import { submitFormPasswordRoom$, theaterStream } from "../../epics/theater";
import { userStream } from "../../epics/user";
import {
  updateAllowAppendDisconnectedMessage,
  updateAllowAppendMessage,
  updateAllowFetchCurrentRoomDetail,
  updateSignIn,
} from "../../store/theater";
import Input from "../Input/Input";
import Peer from "peerjs";
import { nanoid } from "nanoid";
let myPeer;
let peers = {};
const socket = theaterStream.socket;
const TheaterWatch = (props) => {
  const { groupId } = props.match.params;
  const user = userStream.currentState() || {};
  const [theaterState, setTheaterState] = useState(theaterStream.initialState);
  const inputPasswordRef = useRef();
  const notificationRef = useRef();
  const videoCallRef = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);
  socket.on("disconnected-user-video",(userId) => {
    console.log(videoCallRef);
    if (peers[userId]){
      peers[userId].close();
    }
  })
  
  useEffect(() => {
    const subscription = theaterStream.subscribe(setTheaterState);
    theaterStream.init();
    let submitFormSub;
    if (theaterState.isSignIn) {
      const myVideo = document.createElement("video");
      myVideo.muted = true;
      // console.log({ peers });
      navigator.mediaDevices
        .getUserMedia({
          // video: true,
          audio: true,
        })
        .then((stream) => {
          myPeer = new Peer(nanoid(), {
            host: "localhost",
            port: 5000,
            path: "/peerjs",
          });
          myPeer.on("open", (id) => {
            socket.emit("new-user", user.username, groupId, id);
          });        
          // console.log(stream);
          addVideoStream(myVideo, stream, videoCallRef.current);
          myPeer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            // video.muted = true;
            call.on("stream",(userVideoStream)=>{
              addVideoStream(video,userVideoStream,videoCallRef.current);
            }) 
          });
          socket.on("user-join", (username, userId) => {
            // const myVideo = document.createElement("video");
            // myVideo.muted = true;
            // console.log({ peers });
            navigator.mediaDevices
              .getUserMedia({
                // video: true,
                audio: true,
              })
              .then((stream) => {
                connectToNewUser(userId, stream, videoCallRef.current);
              });
            appendNewMessage(`${username} joined`, notificationRef);
          });
          updateAllowAppendMessage(false);    
        });
    }
    if (theaterState.allowAppendDisconnectedMessage) {
      socket.on("disconnected-user", (username) => {
        appendNewMessage(
          `${username} left`,
          notificationRef,
          "disconnected-danger"
        );
      });
      updateAllowAppendDisconnectedMessage(false);
    }
    if (inputPasswordRef && inputPasswordRef.current) {
      submitFormSub = submitFormPasswordRoom$(
        inputPasswordRef.current,
        groupId,
        cookies.idCartoonUser
      ).subscribe((v) => {
        if (!!v) {
          inputPasswordRef.current.value = "";
          // appendNewMessage(`${user.username} joined`, notificationRef);
          if (theaterState.allowFetchCurrentRoomDetail) {
            fetchGroup(groupId, cookies.idCartoonUser, user);
          }
        }
      });
    }
    return () => {
      subscription.unsubscribe();
      submitFormSub && submitFormSub.unsubscribe();
    };
  }, [
    cookies.idCartoonUser,
    groupId,
    theaterState.allowAppendDisconnectedMessage,
    theaterState.allowAppendMessage,
    theaterState.allowFetchCurrentRoomDetail,
    theaterState.isSignIn,
    user,
  ]);
  if (!theaterState.isSignIn && notificationRef.current) {
    notificationRef.current.innerHTML = "";
    if (videoCallRef.current) {
      videoCallRef.current.innerHTML = "";
    }
  }
  // console.log(theaterState);
  return (
    <div>
      <div className="notification-user-join" ref={notificationRef}></div>
      {theaterState.isSignIn && theaterState.currentRoomDetail && (
        <div>
          {theaterState.currentRoomDetail.roomName}
          <div className="container-video">Video watch</div>
          <div className="container-video-call" ref={videoCallRef}></div>
          <input type="file" />
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

function appendNewMessage(message, notificationRef, className) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  if (className) {
    messageElement.className += ` ${className}`;
  }
  if (notificationRef.current) {
    notificationRef.current.append(messageElement);
  }
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
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  // video.muted = true;
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, videoGridElement);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
}

async function fetchGroup(groupId, idCartoonUser, user) {
  const res = await Axios.get(`/api/theater/${groupId}`, {
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  });
  updateAllowFetchCurrentRoomDetail(false);
  updateAllowAppendMessage(false);
  updateAllowAppendDisconnectedMessage(false);
  updateSignIn(true);
  theaterStream.updateCurrentRoomDetail(res.data.message);
  console.log("fetch");
}
export default TheaterWatch;
