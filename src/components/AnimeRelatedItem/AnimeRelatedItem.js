import "./AnimeRelatedItem.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

function AnimeRelatedItem({ anime, history, lazy = false }) {
  return (
    <div
      className={anime.role === "Main" ? "anime-main-role" : ""}
      onClick={() => history.push("/anime/" + anime.mal_id)}
    >
      {lazy && <LazyLoadImage src={anime.image_url} alt="image_anime" />}
      {!lazy && <img src={anime.image_url} alt="image_anime" />}
      <div className="pop-up-hover">
        <h3>{anime.name}</h3>
        <div title="role">({anime.role} )</div>
      </div>
    </div>
  );
}
export default AnimeRelatedItem;
