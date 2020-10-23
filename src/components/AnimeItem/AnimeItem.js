import "./AnimeItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useHistory } from "react-router-dom";
import { limitAdultGenre } from "../../epics/home";

const AnimeItem = ({ anime, lazy = false }) => {
  const history = useHistory();
  // {!limitAdultGenre(anime.genres) ? "/18+" : ""}
  return (
    <div
      className="anime-item"
      onClick={() => {
        history.push(`/anime/${anime.malId || anime.mal_id}`);
      }}
    >
      {anime.airing_start &&
        new Date(anime.airing_start).getTime() <=
          new Date(Date.now()).getTime() && (
          <div
            title="Already_Aired"
            className="anime-info-display_summary top-left_summary color-green"
          >
            Aired
          </div>
        )}
      {anime.airing_start &&
        new Date(anime.airing_start).getTime() >
          new Date(Date.now()).getTime() && (
          <div
            title="start_date_airing"
            className="anime-info-display_summary top-left_summary color-green"
          >
            {anime.airing_start && (
              <div>
                {new Date(anime.airing_start).getMonth() + 1}-
                {new Date(anime.airing_start).getDate()}-
                {new Date(anime.airing_start).getFullYear()}
              </div>
            )}
          </div>
        )}
      {anime.airing_start &&
        new Date(anime.airing_start).getTime() <=
          new Date(Date.now()).getTime() && (
          <div
            title="Already_Aired"
            className="anime-info-display_summary top-left_summary color-green"
          >
            Aired
          </div>
        )}
      {(new Date(anime.end_date).getTime() > new Date(Date.now()).getTime() ||
        !anime.end_date) &&
        anime.start_date &&
        new Date(anime.start_date).getTime() >
          new Date(Date.now()).getTime() && (
          <div
            title="start_date_airing"
            className="anime-info-display_summary top-left_summary color-green"
          >
            {anime.start_date.slice(0, 10)}
          </div>
        )}
      {(new Date(anime.end_date).getTime() > new Date(Date.now()).getTime() ||
        !anime.end_date) &&
        anime.start_date &&
        new Date(anime.start_date).getTime() <=
          new Date(Date.now()).getTime() && (
          <div
            title="start_date_airing"
            className="anime-info-display_summary top-left_summary color-green"
          >
            Aired
          </div>
        )}
      {anime.end_date &&
        anime.end_date.length > 8 &&
        new Date(anime.end_date).getTime() <=
          new Date(Date.now()).getTime() && (
          <div
            title={"End_Airing"}
            className="anime-info-display_summary top-left_summary color-yellow"
          >
            Finished
          </div>
        )}

      {!anime.score &&
        anime.end_date &&
        new Date(anime.end_date).getTime() > new Date(Date.now()).getTime() && (
          <div
            title={"End_date_Airing"}
            className="anime-info-display_summary top-right_summary color-yellow"
          >
            {anime.end_date.slice(0, 10)}
          </div>
        )}
      {!anime.recommendation_count && (
        <div
          title="Score"
          className="anime-info-display_summary top-right_summary color-red"
          style={{
            display: !anime.score || anime.score === "null" ? "none" : "block",
          }}
        >
          {anime.score}/10
        </div>
      )}
      {anime.recommendation_count && (
        <div
          title={"recommendation count"}
          className="anime-info-display_summary top-right_summary color-red"
        >
          {anime.recommendation_count}
        </div>
      )}
      {lazy === true && (
        <LazyLoadImage
          style={{
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          effect="opacity"
          src={anime.imageUrl || anime.image_url}
          alt="NOT_FOUND"
        />
      )}
      {lazy === false && (
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
      )}
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
        <h3 style={{ margin: "5px" }} title="title_anime">
          {anime.title.split(" ").slice(0, 6).join(" ")}
          {anime.title.split(" ").length >
          anime.title.split(" ").slice(0, 6).length
            ? "..."
            : ""}
        </h3>
        {anime.genres && !limitAdultGenre(anime.genres) && (
          <h3 title={`age_limited`} style={{ color: "red", margin: "0" }}>
            18+
          </h3>
        )}
      </div>
    </div>
  );
};

export default AnimeItem;
