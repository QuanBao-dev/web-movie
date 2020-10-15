import "./AnimeRelatedItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { nameStream } from "../../epics/name";

function AnimeRelatedItem({ anime, history, lazy = false }) {
  return (
    <div
      className={anime.role === "Main" ? "anime-main-role" : ""}
      onClick={() => {
        nameStream.resetState();
        history.push("/anime/" + anime.mal_id);
      }}
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
    </div>
  );
}
export default AnimeRelatedItem;
