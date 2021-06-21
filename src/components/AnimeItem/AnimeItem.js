import "./AnimeItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import Axios from "axios";
import React from "react";
import { useRef } from "react";
import { useCookies } from "react-cookie";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

import { updatedAnimeStream } from "../../epics/updatedAnime";
import { virtualAnimeListStream } from "../../epics/virtualAnimeList";
import { limitAdultGenre } from "../../Functions/animeListSeason";
import { updateVirtualStyle } from "../../Functions/virtualAnimeList";
import { useUpdateVirtualAnimeItem } from "../../Hook/virtualAnimeList";
import navBarStore from "../../store/navbar";
import { upcomingAnimeListStream } from "../../epics/upcomingAnimeList";

const AnimeItem = ({
  anime,
  lazy = false,
  virtual = false,
  index,
  isAllowDelete,
}) => {
  const animeItemRef = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);
  useUpdateVirtualAnimeItem(
    animeItemRef,
    virtual,
    virtualAnimeListStream.currentState()
  );
  let virtualStyle = updateVirtualStyle(virtual, index);
  return (
    <div
      ref={animeItemRef}
      style={virtualStyle}
      className="anime-item"
      onMouseDown={mouseDownAnimeItem(animeItemRef)}
      onMouseLeave={mouseLeaveAnimeItem(animeItemRef)}
      onMouseMove={mouseMoveAnimeItem(animeItemRef, virtual)}
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
        to={`/anime/${anime.malId || anime.mal_id}-${anime.title
          .replace(/[ /%^&*():.$]/g, "-")
          .toLocaleLowerCase()}`}
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
          new Date(anime.end_date).getTime() >
            new Date(Date.now()).getTime() && (
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
              display:
                !anime.score || anime.score === "null" ? "none" : "block",
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
      </Link>
    </div>
  );
};

export default AnimeItem;
function mouseLeaveAnimeItem(animeItemRef) {
  return () => {
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
      if (
        animeItemRef.current.parentElement.className.includes(
          "list-anime-nowrap"
        )
      ) {
        xVal = e.pageX - e.target.getBoundingClientRect().x;
        yVal =
          e.pageY - animeItemRef.current.parentElement.parentElement.offsetTop;
      } else if (virtual) {
        xVal = e.pageX - e.target.getBoundingClientRect().x;
        yVal =
          e.pageY -
          (animeItemRef.current.parentElement.offsetTop +
            animeItemRef.current.offsetTop);
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
      animeItemRef.current.style.zIndex = 10;
    }
  };
}
