import "./AnimeStaffPositions.css";

import React from "react";
import loadable from "@loadable/component";
const AnimeStaffPositionItem = loadable(() =>
  import("../AnimeStaffPostionItem/AnimeStaffPositionItem")
);

function AnimeStaffPositions({ updateStaffPosition, lazy = false }) {
  return (
    <div className="container-staff-position">
      {updateStaffPosition && updateStaffPosition.map((data, index) => (
          <AnimeStaffPositionItem
            lazy={lazy}
            key={index}
            updateStaffPosition={data}
          />
        ))}
    </div>
  );
}

export default AnimeStaffPositions;
