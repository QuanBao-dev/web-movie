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
    const week = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const filterWeek = week.filter((v, index) => homeState.dateSchedule[index]);
    // console.log(filterWeek);
    const fetchDataScheduleSub = fetchAnimeSchedule$(filterWeek).subscribe();
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
                  const maxHeight = homeState.dateSchedule[index]
                    ? "4000px"
                    : "3px";
                  movieRefs[index].current.style.maxHeight = maxHeight;
                  const showMovie = movieRefs.map((movie) => {
                    return movie.current.style.maxHeight !== "3px";
                  });
                  stream.updateDate(showMovie);
                }}
              >
                {date}
              </div>
              <div
                style={{
                  maxHeight: homeState.dateSchedule[index] ? "4000px" : "3px",
                  transition: "0.4s",
                }}
                ref={movieRefs[index]}
              >
                {homeState.dataScheduleMovie[date] && (
                  <AnimeList
                    data={homeState.dataScheduleMovie[date]}
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
