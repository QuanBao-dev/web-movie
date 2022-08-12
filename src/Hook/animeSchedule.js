import {
  animeScheduleStream,
  fetchAnimeSchedule$,
} from "../epics/animeSchedule";

export const fetchAnimeSchedule = (
  animeScheduleState,
  setAnimeScheduleState
) => {
  return () => {
    const subscription = animeScheduleStream.subscribe(setAnimeScheduleState);
    animeScheduleStream.init();
    const week = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const filterWeek = week.filter(
      (_, index) => animeScheduleState.dateSchedule[index]
    );
    // console.log(filterWeek);
    const fetchDataScheduleSub = fetchAnimeSchedule$(filterWeek).subscribe();
    return () => {
      subscription.unsubscribe();
      fetchDataScheduleSub.unsubscribe();
    };
  };
};
