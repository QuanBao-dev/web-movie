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
let idCartoonUser;
function Comment({ malId, user }) {
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
            chatStream.updateCurrentPage(chatState.currentPage);
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
  console.log(chatState.messages, allPos50pxMargin);
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
            block: "start",
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
          className="button-comment-reply"
          onClick={() =>
            addInputReply(user, containerInputRefs, buttonSubmitRefs, index)
          }
        >
          <i class="fas fa-reply fa-1x"></i>
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
  const newMessage = {
    author: inputAuthorElement.value,
    createdAt: new Date(Date.now()).toISOString(),
    textContent: inputElement.value,
    marginLeft: elementMarginLeft,
  };
  chatStream.updateMessage(newMessage, index, isPush);
  // console.log(currentUser);
  try {
    await Axios.put(
      `/api/movies/${malId}`,
      {
        messages: chatStream.currentState().messages,
      },
      {
        headers: {
          authorization: "Bearer " + idCartoonUser,
        },
      }
    );
    allowShouldFetchComment(true);
    inputElement.value = "";
  } catch (error) {}
}

export default Comment;
