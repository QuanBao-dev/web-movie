import "./Chat.css";
import React, { useEffect, useRef } from "react";
import { createNewMessageDialog$, theaterStream } from "../../epics/theater";
import Input from "../Input/Input";
const socket = theaterStream.socket;
let messageDialogE;
let idGroup;

const Chat = ({ groupId, user }) => {
  idGroup = groupId;
  const inputMessageDialogRef = useRef();
  const messageDialogRef = useRef();
  useEffect(() => {
    messageDialogE = messageDialogRef.current;
    let createNewMessageSub;
    if (inputMessageDialogRef.current) {
      createNewMessageSub = createNewMessageDialog$(
        inputMessageDialogRef.current
      ).subscribe((message) => {
        // console.log(message);
        // console.log("idGroup", idGroup);
        socket.emit("new-message", user.username, message, idGroup);
        appendNewMessageDialog(message, "You", true, messageDialogRef.current);
      });
    }
    return () => {
      createNewMessageSub && createNewMessageSub.unsubscribe();
    };
  });
  return (
    <div className="message-dialog-container">
      <div className="message-dialog" ref={messageDialogRef}>
        <div className="flex-start-message message-dialog-item current-user-message">
          <span className="content-message">
            Welcome to AnimeFun, enjoy and have a good day
          </span>
          <span className="username-message">Robot</span>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", fontSize: "2rem" }}
      >
        <i className="fab fa-apple"></i>
      </div>
      <div className="input-message-dialog">
        <Input label={"Your message"} input={inputMessageDialogRef} />
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

function appendNewMessageDialog(
  message,
  username,
  isYourMessage,
  messageDialogContainerE
) {
  const newElement = document.createElement("div");
  const newSpanContentMessage = document.createElement("span");
  const newSpanUsernameMessage = document.createElement("span");
  if (!isYourMessage) {
    newElement.className =
      "flex-start-message message-dialog-item current-user-message";
  } else {
    newElement.className =
      "flex-end-message message-dialog-item other-user-message";
  }
  newSpanContentMessage.className = "content-message";
  newSpanContentMessage.innerText = message;
  newSpanUsernameMessage.className = "username-message";
  newSpanUsernameMessage.innerText = username;
  newElement.append(newSpanContentMessage);
  newElement.append(newSpanUsernameMessage);
  messageDialogContainerE.append(newElement);
  messageDialogContainerE.scroll({
    top: messageDialogContainerE.scrollHeight,
    behavior: "smooth",
  });
}

export default Chat;
