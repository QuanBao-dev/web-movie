import "./AnimeItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useHistory } from "react-router-dom";
import { limitAdultGenre, stream } from "../../epics/home";
import { useRef } from "react";

const AnimeItem = ({ anime, lazy = false }) => {
  const history = useHistory();
  const animeItemRef = useRef();
  // {!limitAdultGenre(anime.genres) ? "/18+" : ""}
  return (
    <div
      ref={animeItemRef}
      className="anime-item"
      onClick={() => {
        if (!stream.currentState().hasMoved) {
          history.push(`/anime/${anime.malId || anime.mal_id}`);
        };
        stream.updateHasMoved(false);
      }}
      onMouseDown={() => {
        animeItemRef.current.style.transform = "scale(1)";
      }}
      onMouseOut={() => {
        animeItemRef.current.style.transform =
          "perspective(500px) scale(1) rotateX(0) rotateY(0)";
      }}
      onMouseMove={(e) => {
        let xVal;
        let yVal;
        if (
          animeItemRef.current.parentElement.className.includes(
            "list-anime-nowrap"
          )
        ) {
          yVal = e.pageY - animeItemRef.current.parentElement.offsetTop;
          xVal = e.pageX - e.target.getBoundingClientRect().x;
        } else {
          xVal = e.pageX - animeItemRef.current.offsetLeft;
          yVal = e.pageY - animeItemRef.current.offsetTop;
        }
        const width = animeItemRef.current.clientWidth;
        const height = animeItemRef.current.clientHeight;
        const yRotation = 20 * ((xVal - width / 2) / width);

        /* Calculate the rotation along the X-axis */
        const xRotation = -20 * ((yVal - height / 2) / height);

        /* Generate string for CSS transform property */
        const string =
          "perspective(500px) scale(1.1) rotateX(" +
          xRotation +
          "deg) rotateY(" +
          yRotation +
          "deg)";

        /* Apply the calculated transformation */
        animeItemRef.current.style.transform = string;
      }}
    >
      {anime.airing_start &&
        new Date(anime.airing_start).getTime() <=
          new Date(Date.now()).getTime() && (
          <div
            title="Already_Aired"
            className="anime-info-display_summary top-left_summary color-green"
          >
            {new Date(anime.airing_start).getMonth() + 1}-
            {new Date(anime.airing_start).getDate()}-
            {new Date(anime.airing_start).getFullYear()}
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
            {new Date(anime.airing_start).getMonth() + 1}-
            {new Date(anime.airing_start).getDate()}-
            {new Date(anime.airing_start).getFullYear()}
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
            {anime.start_date.slice(0, 10)}
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
            {anime.end_date.slice(0, 10)}
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
          draggable={false}
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
          draggable={false}
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
            {anime.synopsis === " " || !anime.synopsis
              ? "No content."
              : anime.synopsis}
          </p>
        </div>
      )}
      <div className="anime-item-info">
        <h3 style={{ margin: "5px" }} title="title_anime">
          {anime.title}
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
