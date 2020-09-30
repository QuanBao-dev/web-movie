import "./Comment.css";

import Axios from "axios";
import React, { createRef, useEffect, useRef, useState } from "react";

import {
  chatStream,
  fetchPageMessage$,
  timeSince,
  validateInput$,
} from "../../epics/comment";
import Input from "../Input/Input";
import { useCookies } from "react-cookie";
import {
  allowShouldFetchComment,
  updateCurrentName,
} from "../../store/comment";
import navBarStore from "../../store/navbar";
import { nanoid } from "nanoid";
import theaterStore from "../../store/theater";
const socket = theaterStore.socket;
let idCartoonUser;
let userGlobal;
let malIdGlobal;
socket.on("comment-change", () => {
  fetchPageMessage$(malIdGlobal).subscribe((responseMessage) => {
    chatStream.updateMessages(responseMessage);
    chatStream.updateCurrentPage(chatStream.currentState().currentPage);
    allowShouldFetchComment(false);
  });
});
function Comment({ malId, user }) {
  userGlobal = user;
  malIdGlobal = malId;
  chatStream.initialState.malId = malId;
  let [chatState, setChatState] = useState(chatStream.initialState);
  const [cookies] = useCookies(["idCartoonUser"]);
  idCartoonUser = cookies && cookies.idCartoonUser;
  const input = useRef();
  const inputAuthor = useRef();
  const buttonSubmit = useRef();
  const wrapperMessage = useRef();
  const numberOfMessage = chatState.messages.length;

  const containerInputRefs = multipleCreateRefList(numberOfMessage);
  const inputRefs = multipleCreateRefList(numberOfMessage);
  const inputAuthorRefs = multipleCreateRefList(numberOfMessage);
  const buttonSubmitRefs = multipleCreateRefList(numberOfMessage);
  useEffect(() => {
    if (user) updateCurrentName(user.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    const subscription = chatStream.subscribe(setChatState);
    chatStream.init();
    let subscription1;
    let subscription2;
    let subscription3;

    if (chatState.shouldFetchComment) {
      subscription1 = fetchPageMessage$(malId).subscribe((responseMessage) => {
        chatStream.updateMessages(responseMessage);
        chatStream.updateCurrentPage(chatState.currentPage);
        wrapperMessage.current.style.display = "block";
        allowShouldFetchComment(false);
      });
    }
    if (user) {
      inputAuthor.current.value = chatStream.currentState().currentName;
      if (
        chatState.indexInputDisplayBlock !== null &&
        inputRefs[chatState.indexInputDisplayBlock] &&
        inputAuthorRefs[chatState.indexInputDisplayBlock] &&
        buttonSubmitRefs[chatState.indexInputDisplayBlock]
      ) {
        inputAuthorRefs[
          chatState.indexInputDisplayBlock
        ].current.value = chatStream.currentState().currentName;
        subscription2 = validateInput$(
          inputRefs[chatState.indexInputDisplayBlock].current,
          inputAuthorRefs[chatState.indexInputDisplayBlock].current,
          buttonSubmitRefs[chatState.indexInputDisplayBlock].current,
          user
        ).subscribe();
      }

      subscription3 = validateInput$(
        input.current,
        inputAuthor.current,
        buttonSubmit.current
      ).subscribe();
    }
    return () => {
      subscription.unsubscribe();
      subscription1 && subscription1.unsubscribe();
      subscription2 && subscription2.unsubscribe();
      subscription3 && subscription3.unsubscribe();
    };
  }, [
    buttonSubmitRefs,
    chatState.currentPage,
    chatState.indexInputDisplayBlock,
    chatState.shouldFetchComment,
    inputAuthorRefs,
    inputRefs,
    malId,
    user,
  ]);
  let allPos50pxMargin = [];
  for (let i = 1; i < chatState.messages.length; i++) {
    if (
      chatState.messages[i - 1].marginLeft === "50px" &&
      convertPxToInt(chatState.messages[i].marginLeft) >=
        convertPxToInt(chatState.messages[i - 1].marginLeft)
    ) {
      allPos50pxMargin.push({ pos: i });
    }
  }
  if (
    chatState.messages[chatState.messages.length - 1] &&
    chatState.messages[chatState.messages.length - 1].marginLeft === "50px"
  ) {
    allPos50pxMargin.push({ pos: chatState.messages.length });
  }
  // console.log(allPos50pxMargin);

  const e = document.getElementsByClassName("comment-button-see").item(0);
  if (e) {
    if (
      allPos50pxMargin.length <=
      chatState.currentPage * chatState.numberCommentOfEachPage
    ) {
      e.style.display = "none";
    } else {
      e.style.display = "block";
    }
  }
  // console.log(chatStream.currentState());
  return (
    <div className="wrapper-messages" ref={wrapperMessage}>
      <h2>Comments</h2>
      <div
        style={{
          marginBottom: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Input label={"Name"} input={inputAuthor} />
        <h2 style={{ width: "100%" }}>Your comment</h2>
        <div className="textarea-comment-container">
          <div
            className="textarea-comment"
            onPaste={(e) => {
              e.preventDefault();
              let text = (e.originalEvent || e).clipboardData.getData(
                "text/plain"
              );
              document.execCommand("insertHTML", false, text);
            }}
            ref={input}
            contentEditable
            suppressContentEditableWarning
          />
        </div>
        {user && (
          <button
            className="btn btn-danger button-submit-comment"
            ref={buttonSubmit}
            onClick={() => {
              handleUpdateMessage(
                malId,
                inputAuthor.current,
                input.current,
                `${50}px`,
                null,
                false
              );
            }}
          >
            Submit
          </button>
        )}
        {!user && <h3>You need to sign in to comment</h3>}
      </div>
      {chatState.messages
        .slice(
          0,
          allPos50pxMargin[
            chatState.currentPage * chatState.numberCommentOfEachPage
          ]
            ? allPos50pxMargin[
                chatState.currentPage * chatState.numberCommentOfEachPage
              ].pos - 1
            : chatState.messages.length
        )
        .map((v, index) => {
          return (
            <div key={index}>
              <UserComment
                v={v}
                user={user}
                index={index}
                malId={malId}
                cookies={cookies}
                containerInputRefs={containerInputRefs}
                buttonSubmitRefs={buttonSubmitRefs}
              />
              <FormReply
                containerInputRefs={containerInputRefs}
                index={index}
                v={v}
                inputAuthorRefs={inputAuthorRefs}
                inputRefs={inputRefs}
                buttonSubmitRefs={buttonSubmitRefs}
                malId={malId}
              />
            </div>
          );
        })}
      <button
        className="comment-button-see"
        onClick={(e) => {
          e.target.scrollIntoView({
            block: "end",
            inline: "nearest",
          });
          const nextPage = chatState.currentPage;
          if (
            chatState.messages.length <
            nextPage * chatState.numberCommentOfEachPage
          ) {
            return;
          }
          chatStream.updateCurrentPage(nextPage + 1);
        }}
      >
        See more
      </button>
    </div>
  );
}
function UserComment({
  v,
  user,
  index,
  malId,
  cookies,
  containerInputRefs,
  buttonSubmitRefs,
}) {
  return (
    <div style={{ marginLeft: v.marginLeft }} className="comment">
      {user && user.userId === v.userId && (
        <DeleteComment v={v} malId={malId} cookies={cookies} />
      )}
      <CommentDetail
        v={v}
        user={user}
        containerInputRefs={containerInputRefs}
        buttonSubmitRefs={buttonSubmitRefs}
        index={index}
      />
    </div>
  );
}

function CommentDetail({
  v,
  user,
  containerInputRefs,
  buttonSubmitRefs,
  index,
}) {
  return (
    <div>
      <div className="container-avatar">
        <img
          className="image-avatar"
          width={"50"}
          height="50"
          src={
            v.avatar ||
            "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
          }
          alt="image_avatar"
        />
      </div>
      <div>
        <div>
          {timeSince(new Date(v.createdAt).getTime()) === "Recently"
            ? `Recently`
            : `${timeSince(new Date(v.createdAt).getTime())} ago`}
        </div>
        <div className="author">{v.author}</div>
        <div className="content-comment">
          <div dangerouslySetInnerHTML={{ __html: v.textContent }}></div>
          <div
            className="button-comment-reply"
            onClick={() =>
              addInputReply(user, containerInputRefs, buttonSubmitRefs, index)
            }
          >
            <i className="fas fa-reply fa-1x"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormReply({
  containerInputRefs,
  index,
  v,
  inputAuthorRefs,
  inputRefs,
  buttonSubmitRefs,
  malId,
}) {
  return (
    <div
      ref={containerInputRefs[index]}
      style={{
        marginLeft: v.marginLeft,
        marginBottom: "50px",
        display: "none",
      }}
    >
      <Input label={"Name"} input={inputAuthorRefs[index]} />
      <h1>Your comment</h1>
      <div className="textarea-comment-container">
        <div
          className="textarea-comment"
          onPaste={(e) => {
            e.preventDefault();
            let text = (e.originalEvent || e).clipboardData.getData(
              "text/plain"
            );
            document.execCommand("insertHTML", false, text);
          }}
          ref={inputRefs[index]}
          contentEditable
          suppressContentEditableWarning
        />
      </div>
      <button
        className="btn btn-danger button-submit-comment"
        ref={buttonSubmitRefs[index]}
        onClick={() => {
          handleUpdateMessage(
            malId,
            inputAuthorRefs[index].current,
            inputRefs[index].current,
            `${parseInt(v.marginLeft.replace(/px/g, "")) + 50}px`,
            index
          );
          containerInputRefs[index].current.style.display = "none";
        }}
      >
        Submit
      </button>
    </div>
  );
}

function DeleteComment({ v, malId, cookies }) {
  return (
    <div
      onClick={async () => {
        navBarStore.updateIsShowBlockPopUp(true);
        try {
          const messages = await Axios.put(
            "/api/movies/message/delete/" + malId,
            {
              commentId: v.commentId,
            },
            {
              headers: {
                authorization: `Bearer ${cookies.idCartoonUser}`,
              },
            }
          );
          chatStream.updateMessages(messages.data.message);
        } catch (error) {
          const { message, comments } = error.response.data.error;
          alert(message);
          chatStream.updateMessages(comments);
        }
        navBarStore.updateIsShowBlockPopUp(false);
      }}
      className="delete-symbol"
    >
      X
    </div>
  );
}

function addInputReply(user, containerInputRefs, buttonSubmitRefs, index) {
  if (user) {
    containerInputRefs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.style.display = "none";
        buttonSubmitRefs[index].current.disabled = true;
      }
    });
    containerInputRefs[index].current.style.display = "block";
    chatStream.updateInputDisplayBlock(index);
  }
}

function multipleCreateRefList(n) {
  return Array.from(Array(n).keys()).map(() => createRef());
}
function convertPxToInt(string = "") {
  return parseInt(string.replace(/px/g, ""));
}
async function handleUpdateMessage(
  malId,
  inputAuthorElement,
  inputElement,
  elementMarginLeft,
  index,
  isPush
) {
  const link = inputElement.innerText.match(
    /http[s]?:\/\/(?:[a-z]|[0-9]|[$-_@.&+#]|[!*(),]|(?:%[0-9a-f][0-9a-f]))+/g
  );
  if (link) {
    inputElement.innerHTML = inputElement.innerHTML.replace(
      link[0],
      `<a href=${link[0]} target="_blank" style="color:white">${link[0]}</a>`
    );
  }
  const newMessage = {
    userId: userGlobal.userId,
    author: inputAuthorElement.value,
    createdAt: new Date(Date.now()).toISOString(),
    textContent: inputElement.innerHTML,
    commentId: nanoid(),
    marginLeft: elementMarginLeft,
    avatar: userGlobal.avatarImage,
  };
  updateCurrentName(newMessage.author);
  const commentId = chatStream.currentState().messages[index]
    ? chatStream.currentState().messages[index].commentId
    : null;
  try {
    navBarStore.updateIsShowBlockPopUp(true);
    const messages = await Axios.put(
      `/api/movies/${malId}`,
      {
        newMessage,
        commentId,
        isPush,
      },
      {
        headers: {
          authorization: "Bearer " + idCartoonUser,
        },
      }
    );
    chatStream.updateMessages(messages.data.message);
    inputElement.innerText = "";
  } catch (error) {
    const { message, comments } = error.response.data.error;
    alert(message);
    chatStream.updateMessages(comments);
  }
  navBarStore.updateIsShowBlockPopUp(false);
}

export default Comment;
