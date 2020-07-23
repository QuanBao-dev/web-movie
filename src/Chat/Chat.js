import "./Chat.css";

import React, { useEffect, useRef, useState, createRef } from "react";
import { validateInput$, chatStream } from "../epics/chat";
import Input from "../components/Input/Input";

function Chat() {
  const [chatState, setChatState] = useState(chatStream.initialState);
  const input = useRef();
  const inputAuthor = useRef();
  const buttonSubmit = useRef();
  const numberOfMessage = chatState.messages.length;
  const containerInputRefs = Array.from(Array(numberOfMessage).keys()).map(() =>
    createRef()
  );
  const inputRefs = Array.from(Array(numberOfMessage).keys()).map(() =>
    createRef()
  );
  const inputAuthorRefs = Array.from(Array(numberOfMessage).keys()).map(() =>
    createRef()
  );

  const buttonSubmitRefs = Array.from(Array(numberOfMessage).keys()).map(() =>
    createRef()
  );

  useEffect(() => {
    const subscription = chatStream.subscribe(setChatState);
    chatStream.init();
    let subscription2;
    if (chatState.indexInputDisplayBlock !== null) {
      subscription2 = validateInput$(
        inputRefs[chatState.indexInputDisplayBlock].current,
        inputAuthorRefs[chatState.indexInputDisplayBlock].current,
        buttonSubmitRefs[chatState.indexInputDisplayBlock].current
      ).subscribe();
    }

    let subscription3 = validateInput$(
      input.current,
      inputAuthor.current,
      buttonSubmit.current
    ).subscribe();

    return () => {
      subscription.unsubscribe();
      if (subscription2) {
        subscription2.unsubscribe();
      }
      subscription3.unsubscribe();
    };
  }, [
    buttonSubmitRefs,
    chatState.indexInputDisplayBlock,
    containerInputRefs,
    inputAuthorRefs,
    inputRefs,
  ]);
  console.log(chatState);
  return (
    <div className="wrapper-messages">
      <div style={{ marginBottom: "50px" }}>
        <Input label={"Author"} input={inputAuthor} />
        <Input label={"Your text"} input={input} />
        <button
          ref={buttonSubmit}
          onClick={() => {
            handleUpdateMessage(
              inputAuthor.current,
              input.current,
              `${50}px`,
              null
            );
          }}
        >
          Submit
        </button>
      </div>
      {chatState.messages.map((v, index) => {
        return (
          <div key={index}>
            <div style={{ marginLeft: v.marginLeft }} className="message">
              <div className="author">{v.author}</div>
              <div className="content-message">
                <div>{v.textContent}</div>
                <div
                  className="link"
                  onClick={() => {
                    containerInputRefs.forEach((ref, index) => {
                      ref.current.style.display = "none";
                      buttonSubmitRefs[index].current.disabled = true;
                    });
                    containerInputRefs[index].current.style.display = "block";
                    chatStream.updateInputDisplayBlock(index);
                  }}
                >
                  Reply
                </div>
              </div>
            </div>
            <div
              ref={containerInputRefs[index]}
              style={{
                marginLeft: v.marginLeft,
                marginBottom: "50px",
                display: "none",
              }}
            >
              <Input label={"Author"} input={inputAuthorRefs[index]} />
              <Input label={"Your text"} input={inputRefs[index]} />
              <button
                ref={buttonSubmitRefs[index]}
                onClick={() => {
                  handleUpdateMessage(
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
          </div>
        );
      })}
    </div>
  );
}

function handleUpdateMessage(
  inputAuthorElement,
  inputElement,
  elementMarginLeft,
  index
) {
  const newMessage = {
    author: inputAuthorElement.value,
    time: new Date(Date.now()).toISOString(),
    textContent: inputElement.value,
    marginLeft: elementMarginLeft,
  };
  chatStream.updateMessage(newMessage, index);
  inputAuthorElement.value = "";
  inputElement.value = "";
}

export default Chat;
