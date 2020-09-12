import React from "react";
import "./AnimeItem.css";
import { useHistory } from "react-router-dom";
// import { timer } from "rxjs";
const AnimeItem = ({ anime }) => {
  const history = useHistory();
  // console.log(anime.score);
  return (
    <div
      className="anime-item"
      onClick={() => history.push(`/anime/${anime.malId || anime.mal_id}`)}
    >
      {anime.airing_start &&
        new Date(anime.airing_start).getTime() <=
          new Date(Date.now()).getTime() && (
          <div className="anime-info-display_summary top-left_summary color-green">
            Airing
          </div>
        )}
      <div className="anime-info-display_summary top-right_summary color-red">
        {anime.score || "?"}/10
      </div>
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
          {anime.synopsis
            ? anime.synopsis.slice(0, window.innerWidth <= 700 ? 85 : 200)
            : "No content."}
          {anime.synopsis &&
          anime.synopsis.length >
            anime.synopsis.slice(0, window.innerWidth <= 700 ? 85 : 220).length
            ? "..."
            : ""}
        </p>
      </div>
      <div className="anime-item-info">
        <h3>
          {anime.title.slice(0, 52)}
          {anime.title.length > anime.title.slice(0, 52).length ? "..." : ""}
        </h3>
      </div>
    </div>
  );
};

export default AnimeItem;
