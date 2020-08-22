import "./Toggle.css";
import React from "react";
import { theaterStream } from "../../epics/theater";
const Toggle = ({ mode }) => {
  return (
    <div className="toggle" onClick={() => {
      if(mode === 1){
        theaterStream.updateModeRoom(0)
      } else {
        theaterStream.updateModeRoom(1)
      }
    }}>
      {mode === 0 && <i className="fas fa-toggle-off fa-2x"></i>}
      {mode === 1 && <i className="fas fa-toggle-on fa-2x"></i>}
    </div>
  );
};

export default Toggle;
