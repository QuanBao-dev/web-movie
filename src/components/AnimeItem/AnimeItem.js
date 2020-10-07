import "./AnimeItem.css";

import React from "react";
import { useHistory } from "react-router-dom";

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
          <div className="anime-info-display_summary top-left_summary color-green">
            Airing
          </div>
        )}

      {anime.end_date &&
        anime.end_date.length > 8 &&
        new Date(anime.end_date).getTime() <=
          new Date(Date.now()).getTime() && (
          <div className="anime-info-display_summary top-left_summary color-green">
            Finished
          </div>
        )}
      <div className="anime-info-display_summary top-right_summary color-red">
        {!anime.score || anime.score === "null" ? "?" : anime.score}/10
      </div>
      <img
        style={{
          objectFit: "contain",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        src={anime.imageUrl || anime.image_url}
        alt="NOT_FOUND"
      />
      {anime.synopsis && (
        <div className="anime-item-synopsis">
          <p className="text-synopsis">
            {anime.synopsis === " " && "No content."}
            {anime.synopsis
              ? anime.synopsis
                  .split(" ")
                  .slice(0, window.innerWidth <= 700 ? 10 : 40)
                  .join(" ")
              : "No content."}
            {anime.synopsis &&
            anime.synopsis.split(" ").length >
              anime.synopsis
                .split(" ")
                .slice(0, window.innerWidth <= 700 ? 10 : 40).length
              ? "....."
              : ""}
          </p>
        </div>
      )}
      <div className="anime-item-info">
        <h3 style={{ margin: "5px" }}>
          {anime.title.split(" ").slice(0, 6).join(" ")}
          {anime.title.split(" ").length >
          anime.title.split(" ").slice(0, 6).length
            ? "..."
            : ""}
        </h3>
        {anime.airing_start && (
          <div>
            {new Date(anime.airing_start).getMonth() + 1}-
            {new Date(anime.airing_start).getDate()}-
            {new Date(anime.airing_start).getFullYear()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeItem;
