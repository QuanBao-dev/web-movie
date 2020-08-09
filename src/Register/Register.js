import React, { useEffect, useRef } from "react";
import Input from "../components/Input/Input";
import { validateFormSubmit$ } from "../epics/home";
import "./Register.css";
import { useHistory } from "react-router-dom";
import Axios from "axios";

const Register = () => {
  // eslint-disable-next-line no-unused-vars
  const emailRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
  const usernameRef = useRef();
  const history = useHistory();
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
        <Input label="Email" input={emailRef} />
        <Input label="Password" input={passwordRef} type="password" />
        <Input label="Username" input={usernameRef} />
        <button
          type="submit"
          ref={submitRef}
          onClick={() => {
            submitForm(
              emailRef.current.value,
              passwordRef.current.value,
              usernameRef.current.value,
              history,
            );
            emailRef.current.value = "";
            passwordRef.current.value = "";
            usernameRef.current.value = "";
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

async function submitForm(email, password, username, history) {
  try {
    await Axios.post("/api/users/register", {
      email,
      password,
      username
    });
    // console.log(resJson);
    history.push("/auth/login");
  } catch (error) {
    alert("Account already existed");
    // console.log(email,password);
  }
}

export default Register;
