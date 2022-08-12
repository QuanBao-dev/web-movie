import "./EditUser.css";

import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { from, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, debounceTime, exhaustMap, pluck } from "rxjs/operators";

import { userStream } from "../../epics/user";
import Input from "../../components/Input/Input";
const EditUser = () => {
  const user = userStream.currentState();
  const inputNewUsernameRef = useRef();
  const inputNewEmailRef = useRef();
  const inputCurrentPasswordRef = useRef();
  const inputNewPasswordRef = useRef();
  const [cookies, setCookie] = useCookies(["idCartoonUser"]);
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newEmailError, setNewEmailError] = useState(null);
  const [newUsernameError, setNewUsernameError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  useEffect(() => {
    const buttonScrollTopE = document.querySelector(".button-scroll-top");
    buttonScrollTopE.style.transform = "translateY(500px)";
    return () => {
      if (window.scrollY === 0)
        buttonScrollTopE.style.transform = "translateY(0)";
    };
  }, []);
  return (
    <div className="container-edit-user">
      <h1>Change information your account</h1>
      <Input
        label="New Username"
        defaultValue={user.username}
        input={inputNewUsernameRef}
        error={newUsernameError}
      />
      <Input label="New Email" input={inputNewEmailRef} error={newEmailError} />
      <Input
        label="Current Password"
        type="password"
        input={inputCurrentPasswordRef}
        error={currentPasswordError}
      />
      <Input
        label={"New Password"}
        type="password"
        input={inputNewPasswordRef}
        error={newPasswordError}
      />
      <button
        className="btn btn-primary button-submit-edit"
        onClick={() =>
          submitForm$(
            inputNewUsernameRef.current,
            inputNewEmailRef.current,
            inputCurrentPasswordRef.current,
            inputNewPasswordRef.current,
            cookies.idCartoonUser,
            setCurrentPasswordError,
            setNewEmailError,
            setNewUsernameError,
            setNewPasswordError
          ).subscribe((response) => {
            setCookie("idCartoonUser", response, {
              expires: new Date(Date.now() + 43200000),
              path: "/",
            });
            alert("Success changing your account");
            window.location.replace("/");
          })
        }
      >
        Submit
      </button>
    </div>
  );
};

function submitForm$(
  inputNewUsernameElement,
  inputNewEmailElement,
  inputCurrentPasswordElement,
  inputNewPasswordElement,
  idCartoonUser,
  setCurrentPasswordError,
  setNewEmailError,
  setNewUsernameError,
  setNewPasswordError
) {
  const data = createDataSubmit(
    inputNewUsernameElement,
    inputNewEmailElement,
    inputCurrentPasswordElement,
    inputNewPasswordElement
  );
  return timer(0).pipe(
    debounceTime(500),
    exhaustMap(() =>
      ajax({
        method: "PUT",
        url: "/api/users/current",
        body: data,
        headers: {
          authorization: `Bearer ${idCartoonUser}`,
        },
      }).pipe(
        pluck("response", "message"),
        catchError((err) => {
          if (
            err.response.error
              .replace(/ /g, "")
              .toLowerCase()
              .includes("currentpassword")
          ) {
            setCurrentPasswordError(err.response.error);
            return from([]);
          } else {
            setCurrentPasswordError(null);
          }
          if (err.response.error.toLowerCase().includes("email")) {
            setNewEmailError(err.response.error);
            return from([]);
          } else {
            setNewEmailError(null);
          }
          if (err.response.error.toLowerCase().includes("username")) {
            setNewUsernameError(err.response.error);
            return from([]);
          } else {
            setNewUsernameError(null);
          }
          if (err.response.error.toLowerCase().includes("password")) {
            setNewPasswordError(err.response.error);
            return from([]);
          } else {
            setNewPasswordError(null);
          }
          alert(err.response.error);
          return from([]);
        })
      )
    )
  );
}

function createDataSubmit(
  inputNewUsernameElement,
  inputNewEmailElement,
  inputCurrentPasswordElement,
  inputNewPasswordElement
) {
  let data = {
    userId: userStream.currentState().userId,
    password: inputCurrentPasswordElement.value,
  };
  if (inputNewUsernameElement.value) {
    data = {
      ...data,
      newUsername: inputNewUsernameElement.value,
    };
  }
  if (inputNewPasswordElement.value) {
    data = {
      ...data,
      newPassword: inputNewPasswordElement.value,
    };
  }
  if (inputNewEmailElement.value) {
    data = {
      ...data,
      newEmail: inputNewEmailElement.value,
    };
  }
  return data;
}

export default EditUser;
