import "./TopAnimeItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function TopAnimeItem({ movie, lazy = false }) {
  return (
    <li>
      <h2>Rank {movie.rank}</h2>
      <div>
        <div className="top-anime-list-info">
          <div className="top-movie-score__home">{movie.score}/10</div>
          <Link to={"/anime/" + movie.mal_id}>
            {lazy && (
              <LazyLoadImage
                src={movie.image_url}
                alt="Preview"
                effect="opacity"
                height="100%"
                width="100%"
              />
            )}
            {!lazy && <img src={movie.image_url} alt="Preview" />}
          </Link>
          <div className="title">
            <span>{movie.title}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default TopAnimeItem;
