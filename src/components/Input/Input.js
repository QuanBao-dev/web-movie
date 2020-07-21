import React from "react";
import "./Input.css";
const Input = ({ label, input }) => {
  return (
    <div className="form-custom">
      <input ref={input} type="text" required />
      <label className="label-name">{label}</label>
    </div>
  );
};

export default Input;
