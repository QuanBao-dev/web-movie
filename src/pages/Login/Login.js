import "./Login.css";

import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

import Input from "../../components/Input/Input";
import { validateFormSubmitLogin$ } from "../../epics/home";
import { useHistory } from "react-router-dom";
import { fetchingUser$ } from "../../epics/user";
import { userStream } from "../../epics/user";
const Login = () => {
  const [, setCookie] = useCookies(["idCartoonUser"]);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
  const history = useHistory();
  useEffect(() => {
    document.querySelector(".button-scroll-top").style.transform =
      "translateY(500px)";
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
          onKeyUp={(e) => {
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
          onKeyUp={(e) => {
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
    setEmailError(null);
    setPasswordError(null);
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const resJson = await res.json();
    if (resJson.error) {
      throw Error(JSON.stringify({ error: resJson.error }));
    }
    const token = resJson.message;
    setCookie("idCartoonUser", token, {
      expires: new Date(Date.now() + 43200000),
      path: "/",
    });
    fetchingUser$(token).subscribe((v) => {
      if (!v.error) {
        history.replace("/");
        window.scroll({ top: 0 });
        userStream.updateUser(v.response.message);
      }
    });
    // history.push("/");
  } catch (error) {
    const errorData = JSON.parse(error.message);
    console.log(errorData.error);
    if (
      errorData.error.toLowerCase().includes("email") ||
      errorData.error.toLowerCase().includes("account")
    ) {
      setEmailError(errorData.error);
    } else {
      setEmailError(null);
    }
    if (errorData.error.toLowerCase().includes("password")) {
      setPasswordError(errorData.error);
    } else {
      setPasswordError(null);
    }
  }
}

export default Login;
