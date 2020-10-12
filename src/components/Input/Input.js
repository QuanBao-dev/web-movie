import React from 'react';

const Input = ({ label, input, type, error = null, defaultValue = "" }) => {
  return (
    <div style={{ width: "100%" }}>
      <div className="form-custom">
        <input
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
