import { from, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  pluck,
  retry,
  switchMap,
  switchMapTo,
} from "rxjs/operators";
import updatedAnimeStore from "../store/updatedAnime";

export const updatedAnimeStream = updatedAnimeStore;

export const fetchUpdatedMovie$ = () => {
  return timer(0).pipe(
    switchMapTo(
      ajax({
        url:
          "/api/movies/latest?page=" +
          updatedAnimeStream.currentState().currentPageUpdatedMovie,
      }).pipe(
        pluck("response", "message"),
        retry(20),
        catchError(() => of([]))
      )
    )
  );
};

export const fetchBoxMovie$ = (idCartoonUser) => {
  return timer(0).pipe(
    switchMap(() =>
      ajax({
        url:
          "/api/movies/box?page=" +
          updatedAnimeStream.currentState().currentPageBoxMovie,
        headers: {
          authorization: `Bearer ${idCartoonUser}`,
        },
      }).pipe(
        pluck("response", "message"),
        retry(20),
        catchError((err) => from([]))
      )
    )
  );
};
