import "./MessageInput.css";

import React, { useEffect, useRef, useState } from "react";
import { messageInputStream } from "../../epics/message-input";

const MessageInput = ({
  appendNewMessageDialog,
  appendNewPhotoMessage,
  inputNameDialogRef,
  idGroup,
  socket,
  user,
  messageDialogE,
}) => {
  const [messageInputState, setMessageInputState] = useState(
    messageInputStream.initialState
  );
  const messageInputRef = useRef();
  useEffect(() => {
    const subscription = messageInputStream.subscribe(setMessageInputState);
    messageInputStream.init();
    return () => {
      subscription.unsubscribe();
    };
  }, [messageInputState.textMessage]);
  if (messageInputRef.current) {
    messageInputRef.current.innerHTML = messageInputRef.current.innerText;
  }
  if (messageInputState.imgsMessage.length > 0) {
    messageInputRef.current.style.transition = "0s";
    messageInputRef.current.style.width = "220px";
  }
  // console.log(messageInputState);
  return (
    <div>
      <div className="img-message-input">
        {messageInputState.imgsMessage.map((uri, key) => (
          <div key={key} className="img-detail-wrapper">
            <img src={uri} alt={"NOT_FOUND"} width="100%" height="100%" />
            <span
              className="delete-symbol-message"
              onClick={() => {
                messageInputStream.deleteImageByIndex(key);
              }}
            >
              X
            </span>
          </div>
        ))}
      </div>
      <div
        contentEditable
        data-placeholder="Aa"
        ref={messageInputRef}
        suppressContentEditableWarning
        className="message-input-container"
        onFocus={(e) => {
          e.target.style.transition = "0.4s";
          e.target.style.width = "220px";
        }}
        onBlur={(e) => {
          if (
            e.target.innerHTML.replace(/&nbsp;( )?/g, "") === "" &&
            messageInputState.imgsMessage.length <= 0
          ) {
            e.target.style.transition = "0.4s";
            e.target.style.width = "40px";
          } else {
            e.target.style.transition = "0.4s";
            e.target.style.width = "220px";
          }
        }}
        onInput={(e) => {
          if (
            e.target.innerHTML.replace(/&nbsp;( )?/g, "") !== "" ||
            messageInputState.imgsMessage.length > 0
          ) {
            e.target.style.width = "220px";
          }
          const contentHTML = e.target.innerHTML || "";
          let extractImg = contentHTML.match(
            /<img src="[a-zA-Z0-9:/;,+=@#$%^&*\\]+" alt="">/g
          );
          extractImg && (extractImg = extractImg[0]);

          if (extractImg) {
            const base64Img = extractImg.match(
              /data:image\/[a-zA-Z0-9:/;,+=@#$%^&*\\]+/g
            );
            messageInputStream.updateImgsMessage(base64Img);
          }
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            const checkInnerHTML = e.target.innerHTML;
            if (
              checkInnerHTML.replace(/&nbsp;( )?/g, "") === "" &&
              messageInputState.imgsMessage.length === 0
            ) {
              e.preventDefault();
              return;
            }
            const message = {
              text: e.target.innerText,
              images: messageInputState.imgsMessage,
            };
            if (!user && inputNameDialogRef.current.value.trim() === "") {
              e.preventDefault();
              return alert("please type in your name");
            }
            if (message.images.length > 0) {
              message.images.forEach((uri) => {
                appendNewPhotoMessage(uri, "You", true, messageDialogE);
                socket.emit(
                  "new-message-photo",
                  inputNameDialogRef.current &&
                    inputNameDialogRef.current.value.trim() !== ""
                    ? inputNameDialogRef.current.value
                    : user.username,
                  uri,
                  idGroup
                );
              });
            }
            if (message.text && message.text.trim() !== "") {
              appendNewMessageDialog(message.text, "You", true, messageDialogE);
              socket.emit(
                "new-message",
                inputNameDialogRef.current &&
                  inputNameDialogRef.current.value.trim() !== ""
                  ? inputNameDialogRef.current.value
                  : user.username,
                message.text,
                idGroup
              );
            }
            e.target.innerHTML = "";
            messageInputStream.init();
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default MessageInput;
