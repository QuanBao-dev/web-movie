import "./AnimeStaffPositions.css";

import React, { Suspense } from "react";
const AnimeStaffPositionItem = React.lazy(() =>
  import("../AnimeStaffPostionItem/AnimeStaffPositionItem")
);

function AnimeStaffPositions({ history, updateStaffPosition }) {
  return (
    <div className="container-staff-position">
      {updateStaffPosition &&
        Object.keys(updateStaffPosition) &&
        Object.keys(updateStaffPosition).map((keyData, index) => (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            <AnimeStaffPositionItem
              updateStaffPosition={updateStaffPosition}
              keyData={keyData}
              history={history}
            />
          </Suspense>
        ))}
    </div>
  );
}

export default AnimeStaffPositions;
