import React from "react";
import "./AnimeItem.css";
import { useHistory } from "react-router-dom";
// import { timer } from "rxjs";
const AnimeItem = ({ anime }) => {
  const history = useHistory();
  return (
    <div
      className="anime-item"
      onClick={() => history.push(`/anime/${anime.malId || anime.mal_id}`)}
    >
      {anime.airing_start &&
        new Date(anime.airing_start).getTime() <=
          new Date(Date.now()).getTime() && (
          <div className="anime-airing-symbol">Airing</div>
        )}
      <img
        style={{
          objectFit: "contain",
          position: "absolute",
        }}
        src={anime.imageUrl || anime.image_url}
        alt="NOT_FOUND"
      />
      <div className="anime-item-synopsis">
        <p className="text-synopsis">
          {anime.synopsis === " " && "No content."}
          {anime.synopsis ? anime.synopsis.slice(0,200) : "No content."}
          {anime.synopsis &&
          anime.synopsis.length > anime.synopsis.slice(0,220).length
            ? "..."
            : ""}
        </p>
      </div>
      <div className="anime-item-info">
        <h3>{anime.title}</h3>
        {anime.updatedAt && (
          <h3>
            Time: {new Date(anime.updatedAt).getMonth() + 1}-
            {new Date(anime.updatedAt).getDate()}-
            {new Date(anime.updatedAt).getFullYear()}
          </h3>
        )}
        {anime.airing_start && (
          <h3>
            {new Date(anime.airing_start).getMonth() + 1}-
            {new Date(anime.airing_start).getDate()}-
            {new Date(anime.airing_start).getFullYear()}
          </h3>
        )}
      </div>
    </div>
  );
};

export default AnimeItem;
