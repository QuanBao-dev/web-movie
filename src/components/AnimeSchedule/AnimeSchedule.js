import "./AnimeSchedule.css";

import loadable from "@loadable/component";
import React, { createRef, useState } from "react";

import { animeScheduleStream } from "../../epics/animeSchedule";
import { useFetchAnimeSchedule } from "../../Functions/animeSchedule";
import { resetScheduleDate } from "../../store/animeSchedule";

const AnimeList = loadable(() => import("../AnimeList/AnimeList"));
resetScheduleDate();
const AnimeSchedule = () => {
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
  const [animeScheduleState, setAnimeScheduleState] = useState(
    animeScheduleStream.currentState()
  );
  useFetchAnimeSchedule(animeScheduleState, setAnimeScheduleState);
  return (
    <div className="container-week-schedule-movie">
      <ul className="week-schedule-movie">
        <h1>Schedule</h1>
        {week.map((date, index) => {
          return (
            <li key={index} className="day-schedule-movie">
              <div
                className="title"
                onClick={toggleShowHideAnimeSchedule(
                  animeScheduleState,
                  index,
                  movieRefs
                )}
              >
                {index === animeScheduleState.todayIndex ? "Today" : date}
              </div>
              <div
                style={{
                  maxHeight: animeScheduleState.dateSchedule[index]
                    ? "5000px"
                    : "3px",
                  transition: "0.4s",
                }}
                ref={movieRefs[index]}
              >
                {animeScheduleState.dataScheduleMovie[date] && (
                  <AnimeList
                    empty={true}
                    data={animeScheduleState.dataScheduleMovie[date]}
                    lazy={true}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AnimeSchedule;
function toggleShowHideAnimeSchedule(animeScheduleState, index, movieRefs) {
  return () => {
    animeScheduleState.dateSchedule[index] = !animeScheduleState.dateSchedule[
      index
    ];
    const maxHeight = animeScheduleState.dateSchedule[index] ? "5000px" : "3px";
    movieRefs[index].current.style.maxHeight = maxHeight;
    const showMovie = movieRefs.map((movie) => {
      return movie.current.style.maxHeight !== "3px";
    });
    animeScheduleStream.updateData({ dateSchedule: showMovie });
  };
}
