import { of, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, pluck, switchMapTo } from 'rxjs/operators';

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