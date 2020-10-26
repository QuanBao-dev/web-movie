import './Comment.css';

import Axios from 'axios';
import { nanoid } from 'nanoid';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';

import { chatStream, fetchPageMessage$, timeSince, validateInput$ } from '../../epics/comment';
import { updateCurrentName } from '../../store/comment';
import navBarStore from '../../store/navbar';
import Input from '../Input/Input';

// import theaterStore from "../../store/theater";
// const socket = theaterStore.socket;
let idCartoonUser;
let userGlobal;
// let malIdGlobal;
// socket.on("comment-change", () => {
//   fetchPageMessage$(malIdGlobal).subscribe((responseMessage) => {
//     chatStream.updateMessages(responseMessage);
//     chatStream.updateCurrentPage(chatStream.currentState().currentPage);
//     allowShouldFetchComment(false);
//   });
// });
function Comment({ malId, user }) {
  userGlobal = user;
  // malIdGlobal = malId;
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
    return () => {
      navBarStore.updateIsShowBlockPopUp(false);
    };
  }, []);
  useEffect(() => {
    if (user) updateCurrentName(user.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    let subscription1;
    subscription1 = fetchPageMessage$(malId).subscribe(({ data, lastPage }) => {
      const updatedData = [...chatStream.currentState().messages, ...data];
      chatStream.updateMessages(updatedData, lastPage);
      wrapperMessage.current.style.display = "block";
    });
    return () => {
      subscription1 && subscription1.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatState.currentPage, chatState.triggerFetch]);
  useEffect(() => {
    const subscription = chatStream.subscribe(setChatState);
    chatStream.init();
    let subscription2;
    let subscription3;

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
    user,
  ]);
  // console.log(allPos50pxMargin);

  const e = document.getElementsByClassName("comment-button-see").item(0);
  if (e) {
    if (chatState.currentPage >= chatState.lastPageComment) {
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
      {chatState.messages.map((v, index) => {
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
      <div
        className="comment-button-see"
        onClick={() => {
          const nextPage = chatState.currentPage;
          chatStream.updateCurrentPage(nextPage + 1);
        }}
      >
        See more
      </div>
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
        <div className="time-since-comment">
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
          await Axios.put(
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
          if (chatStream.currentState().currentPage !== 1) {
            chatStream.resetComments();
          } else {
            chatStream.updateTriggerFetch(
              !chatStream.currentState().triggerFetch
            );
          }
          // chatStream.updateMessages(
          //   messages.data.message,
          //   chatStream.currentState().lastPageComment
          // );
        } catch (error) {
          const { message } = error.response.data.error;
          alert(message);
          if (chatStream.currentState().currentPage !== 1) {
            chatStream.resetComments();
          } else {
            chatStream.updateTriggerFetch(
              !chatStream.currentState().triggerFetch
            );
          }
          // chatStream.updateMessages(
          //   comments,
          //   chatStream.currentState().lastPageComment
          // );
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
    await Axios.put(
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
    if (chatStream.currentState().currentPage !== 1) {
      chatStream.resetComments();
    } else {
      chatStream.updateTriggerFetch(!chatStream.currentState().triggerFetch);
    }
    inputElement.innerText = "";
  } catch (error) {
    const { message } = error.response.data.error;
    alert(message);
    if (chatStream.currentState().currentPage !== 1) {
      chatStream.resetComments();
    } else {
      chatStream.updateTriggerFetch(!chatStream.currentState().triggerFetch);
    }
  }
  navBarStore.updateIsShowBlockPopUp(false);
}

export default Comment;
