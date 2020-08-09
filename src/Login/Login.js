import "./Login.css";

import React, { useEffect, useRef } from "react";

import Input from "../components/Input/Input";
import { validateFormSubmitLogin$ } from "../epics/home";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["idCartoonUser"]);
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
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
    <div className="container-background-form">
      <div className="form-login">
        <h1 style={{ color: "white", textAlign: "center" }}>Login</h1>
        <Input label="Email" input={emailRef} />
        <Input label="Password" input={passwordRef} type="password" />
        <button
          type="submit"
          ref={submitRef}
          onClick={() => {
            submitForm(
              emailRef.current.value,
              passwordRef.current.value,
              history,
              setCookie
            );
            emailRef.current.value = "";
            passwordRef.current.value = "";
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

async function submitForm(email, password, history, setCookie) {
  try {
    const res = await Axios.post("/api/users/login", {
      email,
      password,
    });
    const resJson = res.data;
    const token = resJson.message;
    setCookie("idCartoonUser", token, {
      expires: new Date(Date.now() + 43200000),
      path: "/",
    });
    window.location.replace("/");
    // history.push("/");
  } catch (error) {
    // console.log(email,password);
    alert("Invalid account");
  }
}

export default Login;
