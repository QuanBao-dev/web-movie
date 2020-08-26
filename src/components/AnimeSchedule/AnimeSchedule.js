import React, { createRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { fetchAnimeSchedule$, stream } from "../../epics/home";
import "./AnimeSchedule.css";
const AnimeSchedule = () => {
  const history = useHistory();
  const week = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const movieRefs = Array.from(Array(7).keys()).map(() => {
    return createRef();
  });
  const [homeState, setHomeState] = useState(stream.initialState);
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    stream.init();
    const fetchDataScheduleSub = fetchAnimeSchedule$(
      homeState.dateSchedule
    ).subscribe();
    return () => {
      subscription.unsubscribe();
      fetchDataScheduleSub.unsubscribe();
    };
  }, [homeState.dateSchedule]);
  // console.log(homeState);
  return (
    <div className="container-week-schedule-movie">
      <ul className="week-schedule-movie">
        <h1>Schedule</h1>
        {week.map((date, index) => {
          return (
            <li key={index} className="day-schedule-movie">
              <div
                className="title"
                onClick={() => {
                  homeState.dateSchedule[index] = !homeState.dateSchedule[
                    index
                  ];
                  const display = homeState.dateSchedule[index]
                    ? "grid"
                    : "none";
                  movieRefs[index].current.style.display = display;
                  const showMovie = movieRefs.map((movie) => {
                    return movie.current.style.display !== "none";
                  });
                  stream.updateDate(showMovie);
                }}
              >
                {date}
              </div>
              <div
                style={{
                  display: homeState.dateSchedule[index] ? "flex" : "none",
                }}
                className="all-movies-day"
                ref={movieRefs[index]}
              >
                {homeState.dataScheduleMovie[date] &&
                  homeState.dataScheduleMovie[date]
                    .filter((data) => limitAdultGenre(data.genres))
                    .map((anime, index) => {
                      return (
                        <div
                          className="schedule-movie"
                          key={index}
                          onClick={() => {
                            history.push(`/anime/${anime.mal_id}`);
                          }}
                        >
                          <div className="schedule-movie-content">
                            <div className="title">{anime.title}</div>
                          </div>
                          <div className="schedule-movie-rating">
                            <div className="episodes">
                              {anime.episodes || "???"} ep
                              {anime.episodes > 1 && "s"}
                            </div>
                            <div className="score">
                              {anime.score || "??"} / 10
                            </div>
                          </div>
                          <img
                            className="schedule-movie-img"
                            src={anime.image_url}
                            alt="Preview"
                          />
                        </div>
                      );
                    })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

function limitAdultGenre(genres) {
  let check = true;
  genres.forEach((genre) => {
    if (genre.name === "Hentai") {
      check = false;
    }
  });
  return check;
}

export default AnimeSchedule;
