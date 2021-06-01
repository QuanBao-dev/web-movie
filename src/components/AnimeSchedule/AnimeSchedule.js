import "./AnimeSchedule.css";

import loadable from "@loadable/component";
import axios from "axios";
import React, { createRef, useRef, useState } from "react";
import { useCookies } from "react-cookie";

import { animeScheduleStream } from "../../epics/animeSchedule";
import { updatedAnimeStream } from "../../epics/updatedAnime";
import { userStream } from "../../epics/user";
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
  const selectRef = useRef();
  const buttonScheduleRef = useRef();
  const [cookies] = useCookies(["idCartoonUser"]);
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
        <div>
          <h1>Schedule</h1>
          {userStream.currentState() &&
            userStream.currentState().role === "Admin" && (
              <select ref={selectRef} className="select-schedule">
                {week.map((date, index) => (
                  <option key={index}>{date}</option>
                ))}
              </select>
            )}
          {userStream.currentState() &&
            userStream.currentState().role === "Admin" && (
              <button
                className="button-update-select"
                ref={buttonScheduleRef}
                onClick={async () => {
                  buttonScheduleRef.current.disabled = true;
                  await axios.put(
                    "/api/movies/date/" + selectRef.current.value,
                    {},
                    {
                      headers: {
                        authorization: "Bearer " + cookies.idCartoonUser,
                      },
                    }
                  );
                  if (buttonScheduleRef.current)
                    buttonScheduleRef.current.disabled = false;
                  updatedAnimeStream.updateData({
                    triggerFetch:
                      !updatedAnimeStream.currentState().triggerFetch,
                  });
                }}
              >
                update
              </button>
            )}
        </div>
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
                  transition: "1s",
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
    animeScheduleState.dateSchedule[index] =
      !animeScheduleState.dateSchedule[index];
    const showMovie = movieRefs.map((_, i) => {
      return index === i && movieRefs[index].current.style.maxHeight === "3px";
    });
    animeScheduleStream.updateData({ dateSchedule: showMovie });
    if (movieRefs[index].current.style.maxHeight === "3px")
      window.scroll({
        top: movieRefs[index].current.offsetTop - 60,
      });
  };
}
