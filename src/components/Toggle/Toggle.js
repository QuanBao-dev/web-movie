import "./Toggle.css";
import React, { useEffect } from "react";
import { theaterStream } from "../../epics/theater";
import Switch from "@material-ui/core/Switch";
const Toggle = ({ mode }) => {
  useEffect(() => {
    return () => {
      theaterStream.updateData({
        modeRoom: 1,
      });
    };
  }, []);
  return (
    <div
      className="toggle"
      onClick={() => {
        if (mode === 1) {
          theaterStream.updateData({
            modeRoom: 0,
          });
        } else {
          theaterStream.updateData({
            modeRoom: 1,
          });
        }
      }}
    >
      <Switch
        checked={mode === 1}
        name="checkedA"
        inputProps={{ "aria-label": "secondary checkbox" }}
      ></Switch>
    </div>
  );
};

export default Toggle;
