import "./AnimeStaffPositionItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function AnimeStaffPositionItem({
  updateStaffPosition,
  lazy = false,
  isManga,
}) {
  return (
    <div
      className={
        updateStaffPosition.position.includes("Theme Song Performance")
          ? "anime-theme-song-performance-role"
          : ""
      }
    >
      <Link
        to={
          `/${!isManga ? "anime" : "manga"}/` +
          (!isManga
            ? updateStaffPosition.anime.mal_id
            : updateStaffPosition.manga.mal_id)
        }
      >
        {!lazy && (
          <img
            src={
              !isManga
                ? updateStaffPosition.anime.images.webp.large_image_url
                : updateStaffPosition.manga.images.webp.large_image_url
            }
            alt="image_anime"
          />
        )}
        {lazy && (
          <LazyLoadImage
            src={
              !isManga
                ? updateStaffPosition.anime.images.webp.large_image_url
                : updateStaffPosition.manga.images.webp.large_image_url
            }
            alt="image_anime"
            effect="opacity"
          />
        )}
        <div className="pop-up-hover">
          <h3 title="name">
            {!isManga
              ? updateStaffPosition.anime.title
              : updateStaffPosition.manga.title}
          </h3>
          <span title="role">( {updateStaffPosition.position} )</span>
        </div>
      </Link>
    </div>
  );
}

export default AnimeStaffPositionItem;
