import "./Register.css";

import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../components/Input/Input";
import { validateFormSubmit$ } from "../../epics/home";

const Register = () => {
  // eslint-disable-next-line no-unused-vars
  const emailRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
  const usernameRef = useRef();
  const history = useHistory();
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  useEffect(() => {
    const subscription = validateFormSubmit$(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      submitRef.current
    ).subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <div className="container-background-form">
      <div className="form-register">
        <h1 style={{ color: "white", textAlign: "center" }}>Register</h1>
        <Input label="Email" input={emailRef} error={emailError} />
        <Input
          label="Password"
          input={passwordRef}
          type="password"
          error={passwordError}
        />
        <Input label="Username" input={usernameRef} error={usernameError} />
        <button
          className="btn btn-primary button-right"
          type="submit"
          ref={submitRef}
          onClick={() => {
            submitForm(
              emailRef.current.value,
              passwordRef.current.value,
              usernameRef.current.value,
              history,
              setEmailError,
              setPasswordError,
              setUsernameError
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
  username,
  history,
  setEmailError,
  setPasswordError,
  setUsernameError
) {
  try {
    setEmailError(null);
    setPasswordError(null);
    setUsernameError(null);
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
      }),
    });
    const resJson = await res.json();
    if (resJson.error) throw Error(resJson.error);
    // console.log(resJson);
    history.push("/auth/login");
  } catch (error) {
    // alert(error.response.data.error);
    // console.log(email,password);
    if (error.message.toLowerCase().includes("email")) {
      setEmailError(error.message);
    } else {
      setEmailError(null);
    }
    if (error.message.toLowerCase().includes("password")) {
      setPasswordError(error.message);
    } else {
      setPasswordError(null);
    }
    if (error.message.toLowerCase().includes("username")) {
      setUsernameError(error.message);
    } else {
      setUsernameError(null);
    }
  }
}

export default Register;
