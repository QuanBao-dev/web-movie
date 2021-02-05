import "./AnimeStaffPositions.css";

import React from "react";
import loadable from "@loadable/component";
const AnimeStaffPositionItem = loadable(() =>
  import("../AnimeStaffPostionItem/AnimeStaffPositionItem")
);

function AnimeStaffPositions({ updateStaffPosition, lazy = false }) {
  return (
    <div className="container-staff-position">
      {updateStaffPosition &&
        Object.keys(updateStaffPosition) &&
        Object.keys(updateStaffPosition).map((keyData, index) => (
          <AnimeStaffPositionItem
            lazy={lazy}
            key={index}
            updateStaffPosition={updateStaffPosition}
            keyData={keyData}
          />
        ))}
    </div>
  );
}

export default AnimeStaffPositions;
