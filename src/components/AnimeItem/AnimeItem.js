import "./AnimeItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import Axios from "axios";
import React from "react";
import { useRef } from "react";
import { useCookies } from "react-cookie";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

import { upcomingAnimeListStream } from "../../epics/upcomingAnimeList";
import { updatedAnimeStream } from "../../epics/updatedAnime";
import { limitAdultGenre } from "../../Functions/animeListSeason";
import navBarStore from "../../store/navbar";

const AnimeItem = ({
  anime,
  lazy = false,
  virtual = false,
  isAllowDelete,
  styleAnimeItem = {},
  searchBy,
}) => {
  const animeItemRef = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);
  return (
    <div
      ref={animeItemRef}
      style={styleAnimeItem}
      className="anime-item"
      onMouseDown={mouseDownAnimeItem(animeItemRef)}
      onMouseLeave={mouseLeaveAnimeItem(animeItemRef)}
      onMouseMove={mouseMoveAnimeItem(animeItemRef, virtual)}
      title={anime.title || anime.name}
    >
      <div className="layer-upcoming-anime"></div>
      {isAllowDelete && (
        <div className="anime-delete-button top-left_summary">
          <i
            className="fas fa-times"
            onClick={async () => {
              try {
                navBarStore.updateIsShowBlockPopUp(true);
                await Axios.delete(`/api/movies/box/${anime.malId}`, {
                  headers: {
                    authorization: `Bearer ${cookies.idCartoonUser}`,
                  },
                });
                updatedAnimeStream.updateData({
                  triggerFetch: !updatedAnimeStream.currentState().triggerFetch,
                });
              } catch (error) {}
            }}
          ></i>
        </div>
      )}
      <Link
        to={`/${
          searchBy !== "anime"
            ? `anime/${searchBy === "people" ? "person" : searchBy}`
            : "anime"
        }/${anime.malId || anime.mal_id}-${
          anime.title
            ? anime.title.replace(/[ /%^&*():.$,]/g, "-").toLocaleLowerCase()
            : anime.name.replace(/[ /%^&*():.$,]/g, "-").toLocaleLowerCase()
        }`}
      >
        {anime.airing_start &&
          new Date(anime.airing_start).getTime() <=
            new Date(Date.now()).getTime() && (
            <div
              title={new Date(anime.airing_start).toUTCString().slice(4, 17)}
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
              title={new Date(anime.airing_start).toUTCString().slice(4, 17)}
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
              title={new Date(anime.airing_start).toUTCString().slice(4, 17)}
              className="anime-info-display_summary top-left_summary color-green"
            >
              {new Date(anime.airing_start).getMonth() + 1}-
              {new Date(anime.airing_start).getDate()}-
              {new Date(anime.airing_start).getFullYear()}
            </div>
          )}
        {anime.aired && anime.aired.prop.from.day && (
          <div
            title={
              "Started airing on " + new Date(anime.aired.from).toUTCString()
            }
            className="anime-info-display_summary top-left_summary color-green"
          >
            {anime.aired.prop.from.month}
            {anime.aired.prop.from.month && "/"}
            {anime.aired.prop.from.day}
            {anime.aired.prop.from.day && "/"}
            {anime.aired.prop.from.year}
          </div>
        )}
        {anime.aired && anime.aired.prop.to.day && (
          <div
            title={
              "Finished airing on " + new Date(anime.aired.to).toUTCString()
            }
            className="anime-info-display_summary top-left_summary color-yellow"
          >
            {anime.aired.prop.to.month}
            {anime.aired.prop.to.month && "/"}
            {anime.aired.prop.to.day}
            {anime.aired.prop.to.day && "/"}
            {anime.aired.prop.to.year}{" "}
          </div>
        )}

        {!anime.recommendation_count && (
          <div
            title={anime.score ? `${anime.score} out of 10` : "Favorites"}
            className="anime-info-display_summary top-right_summary color-red"
          >
            {anime.score ? `${anime.score}/10` : anime.favorites}
          </div>
        )}
        {anime.recommendation_count && (
          <div
            title={`${anime.recommendation_count} people recommend`}
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
            src={
              anime.imageUrl ||
              (anime.images.webp && anime.images.webp.large_image_url) ||
              (anime.images.jpg && anime.images.jpg.large_image_url) ||
              (anime.images.webp && anime.images.webp.image_url) ||
              (anime.images.jpg && anime.images.jpg.image_url) ||
              anime.image_url
            }
            alt={anime.title || anime.name}
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
            src={
              anime.imageUrl ||
              (anime.images.webp && anime.images.webp.large_image_url) ||
              (anime.images.jpg && anime.images.jpg.large_image_url) ||
              (anime.images.webp && anime.images.webp.image_url) ||
              (anime.images.jpg && anime.images.jpg.image_url) ||
              anime.image_url
            }
            alt={anime.title || anime.name}
          />
        )}
        <div className="anime-item-info">
          <h3 style={{ margin: "5px" }} title={anime.title}>
            {anime.title || anime.name}
          </h3>
          {anime.genres && !limitAdultGenre(anime.genres) && (
            <h3 title={`age_limited`} style={{ color: "red", margin: "0" }}>
              18+
            </h3>
          )}
          {anime.explicit_genres && !limitAdultGenre(anime.explicit_genres) && (
            <h3 title={`age_limited`} style={{ color: "red", margin: "0" }}>
              18+
            </h3>
          )}
        </div>
      </Link>
    </div>
  );
};

export default AnimeItem;
let x = 0;
function mouseLeaveAnimeItem(animeItemRef) {
  return () => {
    x = 0;
    animeItemRef.current.style.transition = "0.1s";
    animeItemRef.current.style.transform =
      "perspective(500px) scale(1) rotateX(0) rotateY(0)";
    animeItemRef.current.style.zIndex = 1;
    setTimeout(() => {
      if (animeItemRef.current) animeItemRef.current.style.transition = "0s";
    }, 300);
  };
}

function mouseDownAnimeItem(animeItemRef) {
  return () => {
    animeItemRef.current.style.transition = "0.3s";
    animeItemRef.current.style.transform = "scale(1)";
  };
}

function mouseMoveAnimeItem(animeItemRef, virtual) {
  return (e) => {
    let xVal;
    let yVal;
    const { isScrolling } = upcomingAnimeListStream.currentState();
    animeItemRef.current.style.transition = "0.3s";
    if (isScrolling) animeItemRef.current.className = "anime-item relative";
    else {
      if (animeItemRef.current.className === "anime-item relative") {
        animeItemRef.current.className = "anime-item";
        return;
      }
      if (x === 0) {
        x = animeItemRef.current.getBoundingClientRect().x;
      }
      const isHalf =
        e.pageX - ((x + e.movementX) % e.pageX) >
        animeItemRef.current.offsetWidth / 2;
      xVal = isHalf ? animeItemRef.current.offsetWidth : 0;
      if (
        animeItemRef.current.parentElement.className.includes(
          "list-anime-nowrap"
        )
      ) {
        yVal =
          e.pageY - animeItemRef.current.parentElement.parentElement.offsetTop;
      } else if (virtual) {
        yVal =
          e.pageY -
          (animeItemRef.current.parentElement.parentElement.offsetTop +
            animeItemRef.current.parentElement.offsetTop);
      } else {
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
      animeItemRef.current.style.zIndex = 10;
    }
  };
}
