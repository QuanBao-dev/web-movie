import React, { useEffect, useRef } from "react";
import Input from "../components/Input/Input";
import { validateFormSubmit$ } from "../epics/todo";
import "./Register.css";
// import uid from "uid";
// import { useHistory } from "react-router-dom";

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
  // const history = useHistory();
  useEffect(() => {
    const subscription = validateFormSubmit$(
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
      <div className="form-register">
        <h1 style={{ color: "white", textAlign: "center" }}>Register</h1>
        <Input label="Email" input={emailRef} />
        <Input label="Password" input={passwordRef} type="password" />
        <button
          type="submit"
          ref={submitRef}
          onClick={() => {
            submitForm(
              emailRef.current.value,
              passwordRef.current.value,
              // history
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

function submitForm(email, password) {
  console.log(email, password);
}

export default Register;
