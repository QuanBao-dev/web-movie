import "./AnimeStaffPositionItem.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

function AnimeStaffPositionItem({
  updateStaffPosition,
  keyData,
  history,
  lazy = false,
}) {
  return (
    <div
      className={
        updateStaffPosition[keyData].positions.includes(
          "Theme Song Performance"
        )
          ? "anime-theme-song-performance-role"
          : ""
      }
      onClick={() =>
        history.push("/anime/" + updateStaffPosition[keyData].mal_id)
      }
    >
      {!lazy && (
        <img src={updateStaffPosition[keyData].image_url} alt="image_anime" />
      )}
      {lazy && (
        <LazyLoadImage
          src={updateStaffPosition[keyData].image_url}
          alt="image_anime"
        />
      )}
      <div className="pop-up-hover">
        <h3 title="name">{updateStaffPosition[keyData].name}</h3>
        {updateStaffPosition[keyData].positions.map((theme, index) => (
          <span title="role" key={index}>
            ( {theme} )
          </span>
        ))}
      </div>
    </div>
  );
}

export default AnimeStaffPositionItem;
