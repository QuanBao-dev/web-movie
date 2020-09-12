import "./Comment.css";

import Axios from "axios";
import React, { createRef, useEffect, useRef, useState } from "react";

import {
  chatStream,
  fetchPageMessage$,
  validateInput$,
} from "../../epics/comment";
import Input from "../Input/Input";
import { useCookies } from "react-cookie";
import { allowShouldFetchComment } from "../../store/comment";

function Comment({ malId, user }) {
  chatStream.initialState.malId = malId;
  let [chatState, setChatState] = useState(chatStream.initialState);
  const [cookies] = useCookies(["idCartoonUser"]);
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
    const subscription = chatStream.subscribe(setChatState);
    chatStream.init();
    let subscription1;
    let subscription2;
    let subscription3;

    if (user) {
      inputAuthor.current.value = user.username;
      if (chatState.shouldFetchComment) {
        subscription1 = fetchPageMessage$(malId).subscribe(
          (responseMessage) => {
            chatStream.initMessage(responseMessage);
            chatStream.updateCurrentPage(1);
            wrapperMessage.current.style.display = "block";
            allowShouldFetchComment(false);
          }
        );
      }
      if (
        chatState.indexInputDisplayBlock !== null &&
        inputRefs[chatState.indexInputDisplayBlock] &&
        inputAuthorRefs[chatState.indexInputDisplayBlock] &&
        buttonSubmitRefs[chatState.indexInputDisplayBlock]
      ) {
        inputAuthorRefs[chatState.indexInputDisplayBlock].current.value =
          user.username;
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
        buttonSubmit.current,
        user
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
    chatState.indexInputDisplayBlock,
    chatState.shouldFetchComment,
    inputAuthorRefs,
    inputRefs,
    malId,
    user,
  ]);
  const e = document.getElementsByClassName("comment-button-see").item(0);
  if (e) {
    if (
      chatState.messages.length <
      chatState.currentPage * chatState.numberCommentOfEachPage
    ) {
      e.style.display = "none";
    } else {
      e.style.display = "block";
    }
  }
  // console.log(chatState);
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
        <Input label={"Your comment"} input={input} />
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
        .slice(0, chatState.currentPage * chatState.numberCommentOfEachPage)
        .map((v, index) => {
          return (
            <div key={index}>
              <UserComment
                v={v}
                user={user}
                index={index}
                chatState={chatState}
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
            behavior: "smooth",
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
  chatState,
  malId,
  cookies,
  containerInputRefs,
  buttonSubmitRefs,
}) {
  return (
    <div style={{ marginLeft: v.marginLeft }} className="comment">
      {user && user.role === "Admin" && (
        <DeleteComment
          index={index}
          chatState={chatState}
          malId={malId}
          cookies={cookies}
        />
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
      <div>{new Date(v.createdAt).toUTCString()}</div>
      <div className="author">{v.author}</div>
      <div className="content-comment">
        <div>{v.textContent}</div>
        <div
          className="link"
          onClick={() =>
            addInputReply(user, containerInputRefs, buttonSubmitRefs, index)
          }
        >
          Reply
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
      <Input label={"Your comment"} input={inputRefs[index]} />
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

function DeleteComment({ index, chatState, malId, cookies }) {
  return (
    <div
      onClick={async () => {
        let listDelete = [index];
        allowShouldFetchComment(false);
        for (let i = index + 1; i < chatState.messages.length; i++) {
          if (
            convertPxToInt(chatState.messages[i].marginLeft) <=
            convertPxToInt(chatState.messages[index].marginLeft)
          ) {
            break;
          }
          listDelete.push(i);
        }
        chatStream.updateDeleteMessage(listDelete);
        await Axios.put(
          "/api/movies/admin/" + malId,
          chatStream.currentState().messages,
          {
            headers: {
              authorization: `Bearer ${cookies.idCartoonUser}`,
            },
          }
        );
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
      ref.current.style.display = "none";
      buttonSubmitRefs[index].current.disabled = true;
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
  const newMessage = {
    author: inputAuthorElement.value,
    createdAt: new Date(Date.now()).toISOString(),
    textContent: inputElement.value,
    marginLeft: elementMarginLeft,
  };
  chatStream.updateMessage(newMessage, index, isPush);
  // console.log(chatStream.currentState());
  try {
    await Axios.put(`/api/movies/${malId}`, {
      messages: chatStream.currentState().messages,
    });
    allowShouldFetchComment(true);
    inputElement.value = "";
  } catch (error) {}
}

export default Comment;
