import React from "react";
import "./BlockPopUp.css";

const BlockPopUp = ({todoState}) => {
  return (
    <div
      className="block-popup"
      style={{
        display:
          !todoState.isLoading &&
          todoState.maxPage >= todoState.currentPage + 1 &&
          todoState.currentPage - 1 >= 1
            ? "block"
            : "none",
      }}
    >
      <h1>Loading...</h1>
    </div>
  );
};

export default BlockPopUp;
