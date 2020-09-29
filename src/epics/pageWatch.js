import pageWatchStore from "../store/pageWatch";
import { timer, of, fromEvent } from "rxjs";
import {
  switchMapTo,
  pluck,
  catchError,
  retry,
  debounceTime,
  filter,
  tap,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
export const pageWatchStream = pageWatchStore;

export const fetchEpisodesOfMovie$ = (malId) => {
  return timer(0).pipe(
    switchMapTo(
      ajax({
        url: `/api/movies/${malId}/episodes`,
      }).pipe(
        pluck("response", "message"),
        catchError(() => {
          return of([]);
        })
      )
    )
  );
};

export function fetchReviewsData$(malId, page) {
  return timer(0).pipe(
    tap(() => pageWatchStream.allowUpdatePageReviewsData(false)),
    switchMapTo(
      ajax(`https://api.jikan.moe/v3/anime/${malId}/reviews/${page}`).pipe(
        pluck("response", "reviews"),
        retry(5),
        tap(() => pageWatchStream.updatePageReviewsOnDestroy(page)),
        catchError((error) => {
          return of({ error });
        })
      )
    )
  );
}

export function updatePageScrolling$() {
  return fromEvent(window, "scroll").pipe(
    debounceTime(500),
    filter(() => document.body.scrollHeight - (window.scrollY + 2000) < 0)
  );
}
