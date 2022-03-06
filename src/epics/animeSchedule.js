import { from, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  mergeMap,
  pluck,
  retry,
  filter,
  tap,
} from "rxjs/operators";
import animeScheduleStore from "../store/animeSchedule";

export const animeScheduleStream = animeScheduleStore;

export const fetchAnimeSchedule$ = (weekIndex) => {
  const source$ = from(weekIndex);
  return source$.pipe(
    mergeMap((day) =>
      timer(0).pipe(
        filter(
          () => !animeScheduleStream.currentState().dataScheduleMovie[day]
        ),
        mergeMap(() =>
          ajax(`https://api.jikan.moe/v4/schedules?filter=${day}`).pipe(
            pluck("response", "data"),
            retry(20),
            catchError((err) => {
              return of([]);
            }),
            tap((v) => animeScheduleStream.updateDataSchedule({ [day]: v }))
          )
        )
      )
    )
  );
};
