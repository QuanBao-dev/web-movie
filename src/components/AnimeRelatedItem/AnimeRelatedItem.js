import "./AnimeRelatedItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function AnimeRelatedItem({ anime, lazy = false }) {
  return (
    <div className={anime.role === "Main" ? "anime-main-role" : ""}>
      <Link
        to={
          "/anime/" +
          anime.mal_id +
          "-" +
          anime.name.replace(/[ /%^&*()]/g, "-").toLocaleLowerCase()
        }
      >
        {lazy && (
          <LazyLoadImage
            src={anime.image_url}
            alt="image_anime"
            effect="opacity"
          />
        )}
        {!lazy && <img src={anime.image_url} alt="image_anime" />}
        <div className="pop-up-hover">
          <h3>{anime.name}</h3>
          <div title="role">({anime.role} )</div>
        </div>
      </Link>
    </div>
  );
}
export default AnimeRelatedItem;
