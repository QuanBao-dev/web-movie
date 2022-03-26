import "./RandomAnimeItem.css";

import React from "react";
import { Link } from "react-router-dom";

const RandomAnimeItem = ({
  title,
  duration,
  aired,
  episodes,
  score,
  rating,
  images,
  length,
  index,
  malId,
}) => {
  return (
    <Link
      title={title}
      to={`/anime/${malId}-${title
        .replace(/[ /%^&*():.$]/g, "-")
        .toLocaleLowerCase()}`}
      className="random-anime-item"
      style={{
        width: index < 3 ? "32%" : "23%",
        height: index < 3 ? "300px" : "200px",
      }}
    >
      <img src={images.webp.large_image_url} alt="" loading="lazy" />
      <div className="random-anime-display">
        <div>
          {score && <span className="random-anime-score">{score}/10</span>}
          {episodes && <span
            style={{
              margin: !score ? "0" : null,
            }}
            className="random-anime-episodes"
          >
            {episodes >= 2 ? `${episodes} episodes` : "one shot"}
          </span>}
        </div>
        <h1 className="random-anime-title">{title}</h1>
        <div className="random-anime-info">
          <div className="random-anime-aired">{aired.string}</div>
        </div>
      </div>
    </Link>
  );
};

export default RandomAnimeItem;
