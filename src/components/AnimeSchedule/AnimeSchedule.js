import "./AnimeSchedule.css";

import React, { createRef, useEffect, useState } from "react";

import { fetchAnimeSchedule$, stream } from "../../epics/home";
import { resetScheduleDate } from "../../store/home";
import AnimeList from "../AnimeList/AnimeList";
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
            <li
              key={index}
              className="day-schedule-movie"
              onClick={() => {
                homeState.dateSchedule[index] = !homeState.dateSchedule[index];
                const display = homeState.dateSchedule[index] ? "grid" : "none";
                movieRefs[index].current.style.display = display;
                const showMovie = movieRefs.map((movie) => {
                  return movie.current.style.display !== "none";
                });
                stream.updateDate(showMovie);
              }}
            >
              <div className="title">{date}</div>
              <div
                style={{
                  display: homeState.dateSchedule[index] ? "block" : "none",
                }}
                ref={movieRefs[index]}
              >
                {homeState.dataScheduleMovie[date] && (
                  <AnimeList data={homeState.dataScheduleMovie[date]} />
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
