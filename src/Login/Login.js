import './Login.css';

import React, { useEffect, useRef } from 'react';

import Input from '../components/Input/Input';
import { validateFormSubmit$ } from '../epics/todo';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
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
      <div className="form-login">
        <h1 style={{ color: "white", textAlign: "center" }}>Login</h1>
        <Input label="Username" input={emailRef} />
        <Input label="Password" input={passwordRef} type="password" />
        <button
          type="submit"
          ref={submitRef}
          onClick={() => {
            submitForm(emailRef.current.value, passwordRef.current.value);
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

function submitForm(email, password, history) {
  console.log(email,password);
}

export default Login;
