import "./TopAnimeItem.css";

import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
function TopAnimeItem({ movie, lazy = false }) {
  return (
    <li>
      <h2>Rank {movie.rank}</h2>
      <div>
        <div className="top-anime-list-info">
          <div className="top-movie-score__home">{movie.score}/10</div>
          <Link to={"/anime/" + movie.mal_id}>
            {lazy && <LazyLoadImage src={movie.image_url} alt="Preview" />}
            {!lazy && <img src={movie.image_url} alt="Preview" />}
          </Link>
          <div className="title">{movie.title}</div>
        </div>
      </div>
    </li>
  );
}

export default TopAnimeItem;
