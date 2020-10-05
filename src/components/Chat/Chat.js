import "./Chat.css";

import React, { useEffect, useRef, useState } from "react";
import { fromEvent } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";

import { messageInputStream } from "../../epics/message-input";
import { theaterStream } from "../../epics/theater";
import Input from "../Input/Input";
import MessageInput from "../MessageInput/MessageInput";

const socket = theaterStream.socket;
let messageDialogE;
let idGroup;
let isWithoutName;
let userGlobal;
const Chat = ({ groupId, user, withoutName = false, isZoom = false }) => {
  idGroup = groupId;
  userGlobal = user;
  isWithoutName = withoutName;
  const inputNameDialogRef = useRef();
  const messageDialogRef = useRef();
  const inputRefFile = useRef();
  const buttonLikeRef = useRef();
  const containerMessageChatBotRef = useRef(null);
  const [errorName, setErrorName] = useState(null);
  useEffect(() => {
    messageDialogE = messageDialogRef.current;
    user && !withoutName && (inputNameDialogRef.current.value = user.username);
  }, [user, withoutName, isZoom]);
  useEffect(() => {
    messageInputStream.init();
    const subscription = fromEvent(containerMessageChatBotRef.current, "scroll")
      .pipe(
        debounceTime(500),
        filter(() => isInBottom())
      )
      .subscribe(() => {
        messageInputStream.updateIsInBottomChatBot(true);
        const buttonScroll = document.querySelector(".button-scroll-bottom");
        buttonScroll.style.transform = "translateY(-100px)";
      });
    const subscription2 = fromEvent(
      containerMessageChatBotRef.current,
      "scroll"
    )
      .pipe(
        debounceTime(500),
        filter(() => !isInBottom())
      )
      .subscribe(() => {
        messageInputStream.updateIsInBottomChatBot(false);
      });
    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
    };
  }, []);
  useEffect(() => {
    let subscription;
    if (buttonLikeRef.current) {
      subscription = fromEvent(buttonLikeRef.current, "click")
        .pipe(debounceTime(500))
        .subscribe(() => {
          if (messageDialogE) {
            if (user) {
              if (inputNameDialogRef.current) {
                if (inputNameDialogRef.current.value.trim() !== "") {
                  setErrorName(null);
                  appendNewMessageDialog(
                    `<i class="fas fa-thumbs-up fa-3x button-like"></i>`,
                    "you",
                    true,
                    messageDialogE,
                    user.avatarImage
                  );
                  socket.emit(
                    "new-message",
                    inputNameDialogRef.current.value,
                    `<i class="fas fa-thumbs-up fa-3x button-like"></i>`,
                    idGroup,
                    user.avatarImage
                  );
                } else {
                  setErrorName("please type in your name");
                }
              } else {
                appendNewMessageDialog(
                  `<i class="fas fa-thumbs-up fa-3x button-like"></i>`,
                  "you",
                  true,
                  messageDialogE,
                  user.avatarImage
                );
                socket.emit(
                  "new-message",
                  user.username,
                  `<i class="fas fa-thumbs-up fa-3x button-like"></i>`,
                  idGroup,
                  user.avatarImage
                );
              }
            } else {
              if (inputNameDialogRef.current.value.trim() !== "") {
                setErrorName(null);
                appendNewMessageDialog(
                  `<i class="fas fa-thumbs-up fa-3x button-like"></i>`,
                  "you",
                  true,
                  messageDialogE
                );

                socket.emit(
                  "new-message",
                  inputNameDialogRef.current.value,
                  `<i class="fas fa-thumbs-up fa-3x button-like"></i>`,
                  idGroup
                );
              } else setErrorName("Error: please type in your name");
            }
            const buttonGetRemoteElement = document.getElementById(
              "button-get-remote"
            );
            if (buttonGetRemoteElement) {
              socket.emit(
                "update-user-online",
                buttonGetRemoteElement.disabled
              );
            }
          }
        });
    }
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  return (
    <div className="container-chat-bot">
      <div className="container-popup-img">
        <img className="pop-up-active" src="" alt="" />
      </div>
      <div className="block-pop-up" style={{ display: "none" }}></div>
      <div className={`chat-bot${isZoom ? " chat-watch-zoom" : ""}`}>
        <div
          className="button-scroll-bottom"
          onClick={() => {
            scrollToBottom();
          }}
        >
          <i className="fas fa-arrow-alt-circle-down fa-3x"></i>
        </div>
        <div
          className={`message-dialog-container${
            isZoom ? " transparent-background" : ""
          }`}
        >
          <div
            className="container-message-chat-bot"
            ref={containerMessageChatBotRef}
            style={{ backgroundColor: isZoom ? "" : "black" }}
          >
            <div
              className={`message-dialog${
                isZoom ? " transparent-background" : ""
              }`}
              ref={messageDialogRef}
            >
              <div className="flex-start-message message-dialog-item current-user-message">
                <span className="content-message">
                  Welcome to AnimeFun, enjoy and have a good day
                </span>
                <span className="username-message">Robot</span>
              </div>
            </div>
            {isWithoutName && (
              <div className="notification-typing-theater-room"></div>
            )}
            {!isWithoutName && (
              <div className="notification-typing">
                <img
                  className="image-dot"
                  src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                  alt="gif_3_dot"
                />
                <div>Someone</div>
              </div>
            )}
          </div>
          {!withoutName && (
            <Input
              label={"Name"}
              input={inputNameDialogRef}
              error={errorName}
            />
          )}
          <div className="input-message-dialog">
            <i
              className="fas fa-thumbs-up fa-2x button-like"
              style={{ color: "white" }}
              ref={buttonLikeRef}
              onClick={() => {}}
            ></i>
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
              isWithoutName={isWithoutName}
              setErrorName={setErrorName}
            />
            <input
              multiple
              type="file"
              ref={inputRefFile}
              className="file-submit-input"
              onChange={async () => {
                try {
                  for (let i = 0; i < inputRefFile.current.files.length; i++) {
                    if (
                      inputRefFile.current.files[i].type.indexOf("image") === -1
                    ) {
                      alert("Just image or gif");
                      continue;
                    }
                    const uri = await base64DataUrl(
                      inputRefFile.current.files[i]
                    );
                    messageInputStream.updateImgsMessage(uri);
                  }
                  isZoom && allowFullscreen();
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

socket.on("user-join", (username, userId, roomId, avatarImage) => {
  if (roomId !== idGroup) {
    return;
  }
  appendNewMessageDialog(
    `NOTIFICATION: ${username} joined`,
    "Robot",
    false,
    messageDialogE,
    avatarImage
  );
});

socket.on(
  "disconnected-user",
  async (username, userId, roomId, avatarImage) => {
    if (roomId !== idGroup || !isWithoutName) {
      return;
    }
    appendNewMessageDialog(
      `NOTIFICATION: ${username} left`,
      "Robot",
      false,
      messageDialogE,
      avatarImage
    );
  }
);

socket.on("send-message-other-users", (username, message, groupId, avatar) => {
  // console.log(username,"sends", groupId);
  if (groupId === idGroup) {
    appendNewMessageDialog(
      message,
      username,
      false,
      messageDialogE,
      avatar ||
        "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
    );
    if (isWithoutName) {
      appendNewUserSeen(avatar);
      const chatBotE = document.querySelector(".chat-bot");
      if (chatBotE && chatBotE.style.transform !== "scale(0)") {
        socket.emit("new-user-seen", userGlobal.avatarImage, groupId);
      }
    }
  }
});

socket.on(
  "send-message-photo-other-users",
  (username, uri, groupId, avatar) => {
    if (groupId === idGroup) {
      appendNewPhotoMessage(
        uri,
        username,
        false,
        messageDialogE,
        avatar ||
          "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
      );
      if (isWithoutName) {
        appendNewUserSeen(avatar);
        const chatBotE = document.querySelector(".chat-bot");
        if (chatBotE && chatBotE.style.transform !== "scale(0)") {
          socket.emit("new-user-seen", userGlobal.avatarImage, groupId);
        }
      }
    }
  }
);

socket.on("send-avatar-seen-user-to-other-user", (avatar, groupId) => {
  if (groupId === idGroup) {
    if (isWithoutName) {
      appendNewUserSeen(avatar);
    }
  }
});

socket.on("new-user-typing", (groupId, idTyping, username) => {
  if (groupId === idGroup) {
    if (!isWithoutName) {
      if (document.querySelector(".notification-typing"))
        document.querySelector(".notification-typing").style.display = "block";
    } else {
      appendNewUserTyping(idTyping, username);
    }
  }
  if (messageInputStream.currentState())
    if (messageInputStream.currentState().isInBottomChatBot) scrollToBottom();
});

socket.on("eliminate-user-typing", (groupId, idTyping) => {
  if (groupId === idGroup) {
    if (!isWithoutName) {
      if (document.querySelector(".notification-typing"))
        document.querySelector(".notification-typing").style.display = "none";
    } else {
      eliminateUserByIdTyping(idTyping);
    }
  }
  if (messageInputStream.currentState().isInBottomChatBot) scrollToBottom();
});

function appendNewUserTyping(idTyping, username) {
  const notificationTypingContainerElement = document.querySelector(
    ".notification-typing-theater-room"
  );
  if (!notificationTypingContainerElement) {
    return;
  }
  const newNotification = document.createElement("div");
  newNotification.id = idTyping;
  newNotification.className = "notification-item-typing";
  const newImg = document.createElement("img");
  newImg.className = "image-dot";
  newImg.src =
    "https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif";
  newImg.alt = "gif_3dot";
  const newUsername = document.createElement("div");
  newUsername.className = "username-message";
  newUsername.innerText = `${username}`;
  newNotification.append(newImg);
  newNotification.append(newUsername);
  if (notificationTypingContainerElement) {
    notificationTypingContainerElement.append(newNotification);
  }
}

function eliminateUserByIdTyping(idTyping) {
  const notificationTypingContainerElement = document.querySelector(
    ".notification-typing-theater-room"
  );
  if (notificationTypingContainerElement) {
    let listNotification = [...notificationTypingContainerElement.childNodes];
    const elementMatchIndex = listNotification.find(
      (element) => element.id === idTyping
    );
    if (elementMatchIndex) {
      elementMatchIndex.remove();
    }
  }
  if (messageInputStream.currentState().isInBottomChatBot) scrollToBottom();
}

function appendNewUserSeen(avatar) {
  const allMessages = document.querySelector(".message-dialog");
  if (!allMessages) {
    return;
  }
  const elements = [...allMessages.childNodes];
  let newSpanContainer = elements[elements.length - 1].querySelector(
    ".seen-user"
  );
  let add = false;
  if (!newSpanContainer) {
    add = true;
    newSpanContainer = document.createElement("div");
    newSpanContainer.className = "seen-user";
  }
  const newSpan = document.createElement("span");
  const newImg = document.createElement("img");
  newImg.src = avatar;
  newImg.alt = "image_avatar";
  newSpan.append(newImg);
  newSpanContainer.append(newSpan);
  if (add) {
    elements[elements.length - 1].append(newSpanContainer);
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
  messageDialogContainerE,
  avatarImage = "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
) {
  const newElement = document.createElement("div");
  const newSpanContentMessage = document.createElement("span");
  const newSpanUsernameMessage = document.createElement("p");
  const imageAvatarMessage = document.createElement("img");
  imageAvatarMessage.src = avatarImage;
  imageAvatarMessage.className = "avatar-user-chat";
  imageAvatarMessage.alt = "avatar";
  if (!isYourMessage) {
    newElement.className =
      "flex-start-message message-dialog-item current-user-message";
  } else {
    newElement.className =
      "flex-end-message message-dialog-item other-user-message";
  }
  newElement.append(imageAvatarMessage);
  if (!/button-like/g.test(message))
    newSpanContentMessage.className = "content-message";
  const link = message.match(
    /http[s]?:\/\/(?:[a-z]|[0-9]|[$-_@.&+]|[!*(),]|(?:%[0-9a-f][0-9a-f]))+/g
  );
  if (link) {
    message = message.replace(
      link[0],
      `<a href=${link[0]} target="_blank" style="color:white">${link[0]}</a>`
    );
  }
  newSpanContentMessage.innerHTML = `<p>${message}</p>`;
  newSpanUsernameMessage.className = "username-message";
  newSpanUsernameMessage.innerText = username;
  newElement.append(newSpanContentMessage);
  newElement.append(newSpanUsernameMessage);
  messageDialogContainerE.append(newElement);
  handleScrollingToBottom(isYourMessage);
  const e = document.querySelector(".chat-watch-zoom");
  if (e && e.style.transform === "scale(0)") {
    const numMessage = theaterStream.currentState().unreadMessage;
    theaterStream.updateUnreadMessage(numMessage + 1);
  }
}

function handleScrollingToBottom(isYourMessage) {
  if (!isYourMessage) {
    if (messageInputStream.currentState()) {
      if (messageInputStream.currentState().isInBottomChatBot) scrollToBottom();
      else {
        const buttonScroll = document.querySelector(".button-scroll-bottom");
        buttonScroll.style.transform = "translateY(0)";
      }
    }
  } else scrollToBottom();
}

function isInBottom() {
  const containerMessageChatBot = document.querySelector(
    ".container-message-chat-bot"
  );
  if (!containerMessageChatBot) return false;
  const distance =
    containerMessageChatBot.scrollHeight -
    (containerMessageChatBot.scrollTop + containerMessageChatBot.offsetHeight);
  return distance < 100;
}

function scrollToBottom() {
  const containerChatBotMessage = document.querySelector(
    ".container-message-chat-bot"
  );
  if (containerChatBotMessage)
    containerChatBotMessage.scroll({
      top: containerChatBotMessage.scrollHeight,
      behavior: "smooth",
    });
}

function appendNewPhotoMessage(
  uri,
  username,
  isYourMessage,
  messageDialogContainerE,
  avatarImage = "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
) {
  const newElement = document.createElement("div");
  const newSpanContentMessage = document.createElement("span");
  const newSpanUsernameMessage = document.createElement("p");
  const newImageAvatar = document.createElement("img");
  newImageAvatar.className = "avatar-user-chat";
  newImageAvatar.src = avatarImage;
  newImageAvatar.alt = "avatar";
  if (!isYourMessage) {
    newElement.className =
      "flex-start-message message-dialog-item current-user-message";
  } else {
    newElement.className =
      "flex-end-message message-dialog-item other-user-message";
  }
  newElement.append(newImageAvatar);
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
  newSpanContentMessage.innerHTML = `<img width="100%" height="100%" src=${uri} alt="image_photo"/>`;
  newSpanUsernameMessage.className = "username-message";
  newSpanUsernameMessage.innerText = username;
  newElement.append(newSpanContentMessage);
  newElement.append(newSpanUsernameMessage);
  messageDialogContainerE.append(newElement);
  handleScrollingToBottom(isYourMessage);
  const e = document.querySelector(".chat-watch-zoom");
  if (e && e.style.transform === "scale(0)") {
    const numMessage = theaterStream.currentState().unreadMessage;
    theaterStream.updateUnreadMessage(numMessage + 1);
  }
}

export default Chat;
