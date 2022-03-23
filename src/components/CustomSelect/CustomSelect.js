import "./CustomSelect.css";

import React, { useEffect, useRef } from "react";

const CustomSelect = ({
  dataOptions,
  valueRef,
  label,
  triggerReset,
  defaultValue,
  setValue,
  defaultOption,
}) => {
  const customSelectRef = useRef();
  useEffect(() => {
    customSelectRef.current.value = valueRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReset]);
  return (
    <fieldset className="custom-select-container">
      <legend className="label-select">{label}</legend>
      <div className="custom-select-wrapper">
        <i className="fas fa-caret-down"></i>
        <select
          ref={customSelectRef}
          className="custom-select-list"
          onChange={(e) => {
            if (setValue) setValue(e.target.value);
            valueRef.current = e.target.value;
          }}
        >
          {!defaultValue && (
            <option value={""}>{defaultOption || "All"}</option>
          )}
          {dataOptions.map((value) => (
            <option key={value || value.mal_id} value={value || value.mal_id}>
              {value.name
                ? value.name.replace(/[_]/g, " ")
                : value.replace(/[_]/g, " ")}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
};

export default CustomSelect;
