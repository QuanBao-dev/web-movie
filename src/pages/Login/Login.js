import "./Login.css";

import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import Axios from "axios";

import Input from "../../components/Input/Input";
import { validateFormSubmitLogin$ } from "../../epics/home";
import { useHistory } from "react-router-dom";
import { fetchingUser$ } from "../../epics/user";
import { userStream } from "../../epics/user";
const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["idCartoonUser"]);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
  const history = useHistory();
  useEffect(() => {
    const subscription = validateFormSubmitLogin$(
      emailRef.current,
      passwordRef.current,
      submitRef.current
    ).subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="form-login">
        <h1 style={{ color: "white", textAlign: "center" }}>Login</h1>
        <Input
          label="Email"
          input={emailRef}
          error={emailError}
          onKeyDown={(e) => {
            if (e.keyCode === 13)
              submitForm(
                emailRef.current,
                passwordRef.current,
                setCookie,
                setEmailError,
                setPasswordError,
                history
              );
          }}
        />
        <Input
          onKeyDown={(e) => {
            if (e.keyCode === 13)
              submitForm(
                emailRef.current,
                passwordRef.current,
                setCookie,
                setEmailError,
                setPasswordError,
                history
              );
          }}
          label="Password"
          input={passwordRef}
          type="password"
          error={passwordError}
        />
        <button
          className="btn btn-primary button-right"
          type="submit"
          ref={submitRef}
          onClick={() => {
            submitForm(
              emailRef.current,
              passwordRef.current,
              setCookie,
              setEmailError,
              setPasswordError,
              history
            );
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

async function submitForm(
  email,
  password,
  setCookie,
  setEmailError,
  setPasswordError,
  history
) {
  try {
    const res = await Axios.post("/api/users/login", {
      email: email.value,
      password: password.value,
    });
    const resJson = res.data;
    const token = resJson.message;
    setCookie("idCartoonUser", token, {
      expires: new Date(Date.now() + 43200000),
      path: "/",
    });
    fetchingUser$(token).subscribe((v) => {
      if (!v.error) {
        history.replace("/");
        userStream.updateUser(v.response.message);
      }
    });
    // history.push("/");
  } catch (error) {
    // console.log(email,password);
    if (
      error.response &&
      error.response.data.error.toLowerCase().includes("email")
    ) {
      setEmailError(error.response.data.error);
    } else {
      setEmailError(null);
    }
    if (
      error.response &&
      error.response.data.error.toLowerCase().includes("password")
    ) {
      setPasswordError(error.response.data.error);
    } else {
      setPasswordError(null);
    }
  }
}

export default Login;
