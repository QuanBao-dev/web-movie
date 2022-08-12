import './AnimeSchedule.css';

import React, { useState } from 'react';

import { animeScheduleStream } from '../../epics/animeSchedule';
import { useFetchAnimeSchedule } from '../../Functions/animeSchedule';
import AnimeScheduleItem from '../AnimeScheduleItem/AnimeScheduleItem';

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
            <AnimeScheduleItem
              animeScheduleState={animeScheduleState}
              date={date}
              index={index}
              key={index}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default AnimeSchedule;