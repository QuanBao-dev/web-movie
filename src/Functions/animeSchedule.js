import { useEffect } from "react";
import { fetchAnimeSchedule } from "../Hook/animeSchedule";

export const useFetchAnimeSchedule = (
  animeScheduleState,
  setAnimeScheduleState
) => {
  useEffect(fetchAnimeSchedule(animeScheduleState, setAnimeScheduleState), [
    animeScheduleState.dateSchedule,
  ]);
};
