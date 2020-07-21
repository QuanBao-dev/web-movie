import React from "react";
import "./Input.css";
const Input = ({ label, input }) => {
  return (
    <form className="form-custom">
      <input ref={input} type="text" required />
      <label className="label-name">{label}</label>
    </form>
  );
};

export default Input;
