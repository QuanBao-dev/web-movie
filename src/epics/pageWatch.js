import pageWatchStore from "../store/pageWatch";
import { timer, of } from "rxjs";
import { switchMapTo, pluck, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
export const pageWatchStream = pageWatchStore;

export const fetchEpisodesOfMovie$ = (malId) => {
  return timer(0).pipe(
    switchMapTo(
      ajax({
        url: `http://localhost:5000/api/movies/${malId}/episodes`,
      }).pipe(
        pluck("response", "message"),
        catchError(() => {
          return of([]);
        })
      )
    )
  );
};
