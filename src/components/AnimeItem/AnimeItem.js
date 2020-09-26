import './AnimeItem.css';

import React from 'react';
import { useHistory } from 'react-router-dom';

const AnimeItem = ({ anime }) => {
  const history = useHistory();
  // console.log(anime);
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
              ? anime.synopsis.slice(0, window.innerWidth <= 700 ? 85 : 200)
              : "No content."}
            {anime.synopsis &&
            anime.synopsis.length >
              anime.synopsis.slice(0, window.innerWidth <= 700 ? 85 : 220)
                .length
              ? "..."
              : ""}
          </p>
        </div>
      )}
      <div className="anime-item-info">
        <h3 style={{ margin: "5px" }}>
          {anime.title.slice(0, 52)}
          {anime.title.length > anime.title.slice(0, 52).length ? "..." : ""}
        </h3>
        {anime.airing_start && (
          <div>{new Date(anime.airing_start).toUTCString().slice(0, 17)}</div>
        )}
      </div>
    </div>
  );
};

export default AnimeItem;
