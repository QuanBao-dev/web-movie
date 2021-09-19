import loadable from "@loadable/component";
import React from "react";
import { useRef } from "react";
import { animeScheduleStream } from "../../epics/animeSchedule";
import { resetScheduleDate } from "../../store/animeSchedule";
const AnimeList = loadable(() => import("../AnimeList/AnimeList"));
resetScheduleDate();

const AnimeScheduleItem = ({ index, animeScheduleState, date }) => {
  const indexActive = animeScheduleState.indexActive;
  const movieRef = useRef();
  return (
    <li className="day-schedule-movie" ref={movieRef}>
      <div
        className="title"
        onClick={() => {
          const dateSchedule = [...animeScheduleState.dateSchedule];
          const boolList = Array.from(Array(7).keys()).map(() => false);
          if (!dateSchedule[index]) {
            boolList[index] = true;
            animeScheduleStream.updateData({
              dateSchedule: boolList,
              indexActive: index,
            });
            window.scroll({ top: movieRef.current.offsetTop });
          } else {
            boolList[index] = false;
            animeScheduleStream.updateData({
              dateSchedule: boolList,
              indexActive: null,
            });
          }
        }}
      >
        {index === animeScheduleState.todayIndex ? "Today" : date}
      </div>
      <div
        style={{
          maxHeight: index === indexActive ? "3500px" : "0px",
          transition: "1s",
        }}
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
};

export default AnimeScheduleItem;
