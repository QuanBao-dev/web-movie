import React from "react";
import "./AnimeItem.css";
const AnimeItem = ({anime}) => {
  return (
    <div className="anime-item">
      <a href={anime.url}>
        <img src={anime.image_url} alt="NOT_FOUND" />
        <div className="anime-item-info">
          <h3>{anime.title}</h3>
          <h3>{anime.airing_start}</h3>
        </div>
      </a>
    </div>
  )
};

export default AnimeItem;
