import React from "react";
import "./AnimeItem.css";
const AnimeItem = ({anime}) => {
  return (
    <div className="anime-item">
      <span>{anime.title}</span>
      <div>{anime.airing_start}</div>
      <a href={anime.url}>
        <img src={anime.image_url} alt="NOT_FOUND" />
      </a>
    </div>
  )
};

export default AnimeItem;
