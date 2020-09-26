import './EditUser.css';

import React, { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { from, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, debounceTime, exhaustMap, pluck } from 'rxjs/operators';

import { userStream } from '../../epics/user';

const EditUser = () => {
  const user = userStream.currentState();
  const inputNewUsernameRef = useRef();
  const inputNewEmailRef = useRef();
  const inputCurrentPasswordRef = useRef();
  const inputNewPasswordRef = useRef();
  const [cookies, setCookie] = useCookies(["idCartoonUser"]);
  return (
    <div style={{ margin: "100px" }}>
      <div className="container-edit-user">
        <h1>Change information your account</h1>
        <div className="edit-user-item">
          <div>New Username</div>
          <input
            type="text"
            defaultValue={user.username}
            ref={inputNewUsernameRef}
          />
        </div>
        <div className="edit-user-item">
          <div>New Email</div>
          <input type="text" ref={inputNewEmailRef} />
        </div>
        <div className="edit-user-item">
          <div>Your Current Password</div>
          <input
            type="password"
            defaultValue={""}
            ref={inputCurrentPasswordRef}
          />
        </div>
        <div className="edit-user-item">
          <div>New Password</div>
          <input type="password" ref={inputNewPasswordRef} />
        </div>
        <button
          className="btn btn-primary button-submit-edit"
          onClick={() =>
            submitForm$(
              inputNewUsernameRef.current,
              inputNewEmailRef.current,
              inputCurrentPasswordRef.current,
              inputNewPasswordRef.current,
              cookies.idCartoonUser
            ).subscribe(response => {
              setCookie("idCartoonUser",response,{
                expires:new Date(Date.now() + 43200000),
                path:"/"
              });
              alert("Success changing your account");
              window.location.replace("/");
            })
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
};

function submitForm$(
  inputNewUsernameElement,
  inputNewEmailElement,
  inputCurrentPasswordElement,
  inputNewPasswordElement,
  idCartoonUser
) {
  const data = createDataSubmit(
    inputNewUsernameElement,
    inputNewEmailElement,
    inputCurrentPasswordElement,
    inputNewPasswordElement
  );
  return timer(0).pipe(
    debounceTime(500),
    exhaustMap(() => ajax({
      method:"PUT",
      url:"/api/users/current",
      body:data,
      headers:{
        authorization:`Bearer ${idCartoonUser}`
      }
    }).pipe(
      pluck("response","message"),
      catchError((err) => {
        alert(err.response.error);
        return from([])
      })
    ))
  );
}

function createDataSubmit(
  inputNewUsernameElement,
  inputNewEmailElement,
  inputCurrentPasswordElement,
  inputNewPasswordElement
) {
  let data = {
    email: userStream.currentState().email,
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
