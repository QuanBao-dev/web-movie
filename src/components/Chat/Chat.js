import "./Chat.css";
import React, { useEffect, useRef } from "react";
import { theaterStream } from "../../epics/theater";
import Input from "../Input/Input";
import MessageInput from "../MessageInput/MessageInput";
import { messageInputStream } from "../../epics/message-input";
const socket = theaterStream.socket;
let messageDialogE;
let idGroup;

const Chat = ({ groupId, user, withoutName = false, isZoom = false }) => {
  idGroup = groupId;
  const inputNameDialogRef = useRef();
  const messageDialogRef = useRef();
  const inputRefFile = useRef();
  useEffect(() => {
    messageDialogE = messageDialogRef.current;
    user && !withoutName && (inputNameDialogRef.current.value = user.username);
  }, [user, withoutName]);

  return (
    <div>
      <div className="container-popup-img">
        <img className="pop-up-active" src="" alt="" />
      </div>
      <div className="block-pop-up" style={{ display: "none" }}></div>
      <div className={`chat-bot${isZoom ? " chat-watch-zoom" : ""}`}>
        <div className="message-dialog-container">
          <div className="message-dialog" ref={messageDialogRef}>
            <div className="flex-start-message message-dialog-item current-user-message">
              <span className="content-message">
                Welcome to AnimeFun, enjoy and have a good day
              </span>
              <span className="username-message">Robot</span>
            </div>
          </div>
          {!withoutName && <Input label={"Name"} input={inputNameDialogRef} />}
          <div className="input-message-dialog">
            <i
              className="fas fa-images fa-2x symbol-choose-picture"
              onClick={() => inputRefFile.current.click()}
            ></i>
            <MessageInput
              appendNewMessageDialog={appendNewMessageDialog}
              appendNewPhotoMessage={appendNewPhotoMessage}
              inputNameDialogRef={inputNameDialogRef}
              idGroup={idGroup}
              socket={socket}
              user={user}
              messageDialogE={messageDialogE}
            />
            <input
              multiple
              type="file"
              ref={inputRefFile}
              className="file-submit-input"
              onChange={async () => {
                try {
                  for (let i = 0; i < inputRefFile.current.files.length; i++) {
                    const uri = await base64DataUrl(
                      inputRefFile.current.files[i]
                    );
                    messageInputStream.updateImgsMessage(uri);
                  }
                  inputRefFile.current.value = "";
                } catch (error) {
                  alert(error);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

socket.on("send-message-other-users", (username, message, groupId) => {
  // console.log(username,"sends", groupId);
  if (groupId === idGroup) {
    appendNewMessageDialog(message, username, false, messageDialogE);
  }
});

socket.on("send-message-photo-other-users", (username, uri, groupId) => {
  if (groupId === idGroup) {
    appendNewPhotoMessage(uri, username, false, messageDialogE);
  }
});

function base64DataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = function () {
      reject("Your file is too big");
    };
    reader.onload = function (ev) {
      reader.error && reject(reader.error);
      resolve(ev.target.result);
    };
    reader.readAsDataURL(file);
  });
}

function appendNewMessageDialog(
  message,
  username,
  isYourMessage,
  messageDialogContainerE
) {
  const newElement = document.createElement("div");
  const newSpanContentMessage = document.createElement("span");
  const newSpanUsernameMessage = document.createElement("p");
  if (!isYourMessage) {
    newElement.className =
      "flex-start-message message-dialog-item current-user-message";
  } else {
    newElement.className =
      "flex-end-message message-dialog-item other-user-message";
  }
  newSpanContentMessage.className = "content-message";
  newSpanContentMessage.innerHTML = `<p>${message}</p>`;
  newSpanUsernameMessage.className = "username-message";
  newSpanUsernameMessage.innerText = username;
  newElement.append(newSpanContentMessage);
  newElement.append(newSpanUsernameMessage);
  messageDialogContainerE.append(newElement);
  messageDialogContainerE.scroll({
    top: messageDialogContainerE.scrollHeight,
    behavior: "smooth",
  });
  const e = document.querySelector(".chat-watch-zoom");
  if (e && e.style.transform === "scale(0)") {
    const numMessage = theaterStream.currentState().unreadMessage;
    theaterStream.updateUnreadMessage(numMessage + 1);
  }
}

function appendNewPhotoMessage(
  uri,
  username,
  isYourMessage,
  messageDialogContainerE
) {
  const newElement = document.createElement("div");
  const newSpanContentMessage = document.createElement("span");
  const newSpanUsernameMessage = document.createElement("p");
  if (!isYourMessage) {
    newElement.className =
      "flex-start-message message-dialog-item current-user-message";
  } else {
    newElement.className =
      "flex-end-message message-dialog-item other-user-message";
  }
  newSpanContentMessage.className = `pop-up`;
  const popUpActiveContainer = document.querySelector(".container-popup-img");
  const popUpActive = document.querySelector(".pop-up-active");
  newSpanContentMessage.onclick = function (e) {
    if (e.target.parentElement.className === "pop-up") {
      document.querySelector(".block-pop-up").style.display = "block";
      document.getElementsByTagName("body").item(0).className = "hidden-scroll";
      popUpActive.src = e.target.src;
      popUpActive.width = e.target.naturalWidth;
      popUpActive.height = e.target.naturalHeight;
      popUpActiveContainer.style.transition = "0.4s";
      popUpActiveContainer.style.display = "flex";
      popUpActiveContainer.style.transform = "scale(1)";
      popUpActiveContainer.style.opacity = "1";
    }
    document.onclick = function (ev) {
      if (
        !e.target.parentElement.contains(ev.target) &&
        document.querySelector(".block-pop-up")
      ) {
        document.querySelector(".block-pop-up").style.display = "none";
        document.getElementsByTagName("body").item(0).className = "";
        popUpActive.src = "";
        e.target.parentElement.className = "pop-up";
        popUpActiveContainer.style.opacity = "0";
        popUpActiveContainer.style.transition = "0s";
        popUpActiveContainer.style.transform = "scale(0)";
      }
    };
  };
  newSpanContentMessage.innerHTML = `<img width="100%" height="100%" src=${uri} alt="NOT FOUND"/>`;
  newSpanUsernameMessage.className = "username-message";
  newSpanUsernameMessage.innerText = username;
  newElement.append(newSpanContentMessage);
  newElement.append(newSpanUsernameMessage);
  messageDialogContainerE.append(newElement);
  messageDialogContainerE.scroll({
    top: messageDialogContainerE.scrollHeight,
    behavior: "smooth",
  });
  const e = document.querySelector(".chat-watch-zoom");
  if (e && e.style.transform === "scale(0)") {
    const numMessage = theaterStream.currentState().unreadMessage;
    theaterStream.updateUnreadMessage(numMessage + 1);
  }
}

export default Chat;
