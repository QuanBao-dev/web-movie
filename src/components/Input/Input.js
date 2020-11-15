import "./Input.css";
import React from "react";

const Input = ({
  label,
  input,
  type,
  error = null,
  defaultValue = "",
  onKeyDown,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <div className="form-custom">
        <input
          onKeyDown={onKeyDown}
          defaultValue={defaultValue}
          ref={input}
          type={type || "text"}
          required
        />
        <label className="label-name">{label}</label>
      </div>
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
};

export default Input;
