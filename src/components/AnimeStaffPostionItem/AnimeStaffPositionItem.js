import "./AnimeStaffPositionItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function AnimeStaffPositionItem({
  updateStaffPosition,
  keyData,
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
    >
      <Link to={"/anime/" + updateStaffPosition[keyData].mal_id}>
        {!lazy && (
          <img src={updateStaffPosition[keyData].image_url} alt="image_anime" />
        )}
        {lazy && (
          <LazyLoadImage
            src={updateStaffPosition[keyData].image_url}
            alt="image_anime"
            effect="opacity"
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
      </Link>
    </div>
  );
}

export default AnimeStaffPositionItem;
