import "./MessageInput.css";

import React, { useEffect, useRef, useState } from "react";
import { fromEvent } from "rxjs";
import { debounceTime, first } from "rxjs/operators";

import { createCaretPlacer, messageInputStream } from "../../epics/message-input";
import { nanoid } from "nanoid";
const idTyping = nanoid();
const MessageInput = ({
  appendNewMessageDialog,
  appendNewPhotoMessage,
  inputNameDialogRef,
  idGroup,
  socket,
  user,
  messageDialogE,
  isWithoutName,
  setErrorName,
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
  }, []);
  useEffect(() => {
    let subStartTyping, subStopTyping;
    subStartTyping = fromEvent(messageInputRef.current, "input")
      .pipe(first())
      .subscribe(() => {
        if (isWithoutName) {
          socket.emit("notify-user-typing", idGroup, idTyping, user.username);
        } else {
          socket.emit("notify-user-typing", idGroup);
        }
      });
    subStopTyping = fromEvent(messageInputRef.current, "input")
      .pipe(debounceTime(600))
      .subscribe(() => {
        socket.emit("notify-user-stop-type", idGroup, idTyping);
        fromEvent(messageInputRef.current, "input")
          .pipe(first())
          .subscribe(() => {
            if (isWithoutName) {
              socket.emit(
                "notify-user-typing",
                idGroup,
                idTyping,
                user.username
              );
            } else {
              socket.emit("notify-user-typing", idGroup);
            }
          });
      });
    return () => {
      subStartTyping && subStartTyping.unsubscribe();
      subStopTyping && subStopTyping.unsubscribe();
    };
  }, [idGroup, isWithoutName, socket, user]);
  if (messageInputRef.current) {
    messageInputRef.current.innerHTML = messageInputRef.current.innerText;
  }
  if (messageInputState.imgsMessage.length > 0) {
    messageInputRef.current.style.transition = "0s";
    messageInputRef.current.style.width = "100%";
  }
  // console.log(messageInputState);
  return (
    <div className="message-input-wrapper">
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
        onPaste={(event) => {
          event.preventDefault();
          let text = (event.originalEvent || event).clipboardData.getData(
            "text/plain"
          );
          if (event.clipboardData.items[0].type.indexOf("image") !== -1) {
            var blob = event.clipboardData.items[0].getAsFile();
            var reader = new FileReader();
            reader.onload = function (event) {
              messageInputStream.updateImgsMessage(event.target.result);
            };
            reader.readAsDataURL(blob);
          }
          document.execCommand("insertHTML", false, text);
        }}
        className="message-input-container"
        onFocus={(e) => {
          e.target.style.transition = "0.4s";
          e.target.style.width = "100%";
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
            e.target.style.width = "100%";
          }
        }}
        onInput={(e) => {
          if (
            e.target.innerHTML.replace(/&nbsp;( )?/g, "") !== "" ||
            messageInputState.imgsMessage.length > 0
          ) {
            e.target.style.width = "100%";
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
          createCaretPlacer(e.target, false);
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
            if (!isWithoutName)
              if (inputNameDialogRef.current.value.trim() === "") {
                e.preventDefault();
                return setErrorName("please type in your name");
              } else {
                setErrorName(null);
              }
            if (message.images.length > 0) {
              message.images.forEach((uri) => {
                appendNewPhotoMessage(uri, "You", true, messageDialogE);
                if (user) {
                  socket.emit(
                    "new-message-photo",
                    inputNameDialogRef.current &&
                      inputNameDialogRef.current.value.trim() !== ""
                      ? inputNameDialogRef.current.value
                      : user.username,
                    uri,
                    idGroup,
                    user.avatarImage
                  );
                  const buttonGetRemoteElement = document.getElementById(
                    "button-get-remote"
                  );
                  if (buttonGetRemoteElement) {
                    socket.emit(
                      "update-user-online",
                      buttonGetRemoteElement.disabled
                    );
                  }
                } else
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
              if (user) {
                socket.emit(
                  "new-message",
                  inputNameDialogRef.current &&
                    inputNameDialogRef.current.value.trim() !== ""
                    ? inputNameDialogRef.current.value
                    : user.username,
                  message.text,
                  idGroup,
                  user.avatarImage
                );
                const buttonGetRemoteElement = document.getElementById(
                  "button-get-remote"
                );
                if (buttonGetRemoteElement) {
                  socket.emit(
                    "update-user-online",
                    buttonGetRemoteElement.disabled
                  );
                }
              } else
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
