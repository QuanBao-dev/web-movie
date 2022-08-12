import "./AnimeStaffPositions.css";

import React from "react";
import loadable from "@loadable/component";
const AnimeStaffPositionItem = loadable(() =>
  import("../AnimeStaffPostionItem/AnimeStaffPositionItem")
);

function AnimeStaffPositions({ updateStaffPosition, lazy = false, isManga }) {
  return (
    <div className="container-staff-position">
      {updateStaffPosition && updateStaffPosition.map((data, index) => (
          <AnimeStaffPositionItem
            lazy={lazy}
            key={index}
            updateStaffPosition={data}
            isManga={isManga}
          />
        ))}
    </div>
  );
}

export default AnimeStaffPositions;
