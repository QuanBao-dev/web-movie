import { fromEvent, iif, of, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, debounceTime, filter, mergeMapTo, pluck, retry, switchMapTo, tap } from 'rxjs/operators';

import pageWatchStore from '../store/pageWatch';

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
  return timer(0).pipe(
    mergeMapTo(
      iif(
        () => window.innerWidth < 770,
        fromEvent(window, "scroll").pipe(
          debounceTime(500),
          filter(
            () => document.body.scrollHeight - (window.scrollY + 1500) < 0
          ),
          tap(() => {
            if (
              pageWatchStream.currentState().pageSplit <=
              pageWatchStream.currentState().reviewsData.length
            )
              pageWatchStream.updatePageSplit(
                pageWatchStream.currentState().pageSplit + 1
              );
          })
        ),
        fromEvent(window, "scroll").pipe(
          filter(
            () => document.body.scrollHeight - (window.scrollY + 1500) < 0
          ),
          tap(() => {
            if (
              pageWatchStream.currentState().pageSplit <=
              pageWatchStream.currentState().reviewsData.length
            )
              pageWatchStream.updatePageSplit(
                pageWatchStream.currentState().pageSplit + 1
              );
          })
        )
      )
    )
  );
}
