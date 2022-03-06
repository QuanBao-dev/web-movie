import "./AnimeStaffPositionItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function AnimeStaffPositionItem({
  updateStaffPosition,
  lazy = false,
}) {
  return (
    <div
      className={
        updateStaffPosition.position.includes(
          "Theme Song Performance"
        )
          ? "anime-theme-song-performance-role"
          : ""
      }
    >
      <Link to={"/anime/" + updateStaffPosition.anime.mal_id}>
        {!lazy && (
          <img src={updateStaffPosition.anime.images.webp.large_image_url} alt="image_anime" />
        )}
        {lazy && (
          <LazyLoadImage
            src={updateStaffPosition.anime.images.webp.large_image_url}
            alt="image_anime"
            effect="opacity"
          />
        )}
        <div className="pop-up-hover">
          <h3 title="name">{updateStaffPosition.anime.title}</h3>
          <span title="role">
            ( {updateStaffPosition.position} )
          </span>
        </div>
      </Link>
    </div>
  );
}

export default AnimeStaffPositionItem;
