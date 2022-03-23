import "./AnimeRelatedItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function AnimeRelatedItem({ anime, role, lazy = false }) {
  return (
    <div
      title={anime.title}
      className={role === "Main" ? "anime-main-role" : ""}
    >
      <Link
        to={
          "/anime/" +
          anime.mal_id +
          "-" +
          anime.title.replace(/[ /%^&*()]/g, "-").toLocaleLowerCase()
        }
      >
        {lazy && (
          <LazyLoadImage
            src={(anime.images.jpg.large_image_url || anime.images.jpg.image_url)}
            alt="image_anime"
            effect="opacity"
          />
        )}
        {!lazy && <img src={anime.images.jpg.large_image_url ||anime.images.jpg.image_url} alt="image_anime" />}
        <div className="pop-up-hover">
          <h3>{anime.title}</h3>
          <div title={anime.role + " role"}>({role})</div>
        </div>
      </Link>
    </div>
  );
}
export default AnimeRelatedItem;
