import React from "react";
import "./AnimeItem.css";
import { useHistory } from "react-router-dom";
const AnimeItem = ({ anime }) => {
  const history = useHistory();
  return (
    <div
      className="anime-item"
      onClick={() => history.push(`/anime/${anime.mal_id}`)}
    >
      <img src={anime.image_url} alt="NOT_FOUND" />
      <div className="anime-item-info">
        <h3>{anime.title}</h3>
        <h3>{anime.airing_start}</h3>
      </div>
    </div>
  );
};

export default AnimeItem;
