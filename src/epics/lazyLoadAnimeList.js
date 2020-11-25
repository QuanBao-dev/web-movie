import { fromEvent, iif, of, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, debounceTime, filter, mergeMap, mergeMapTo, pluck, retry, tap } from 'rxjs/operators';

import lazyLoadAnimeListStore from '../store/lazyLoadAnimeList';

export const lazyLoadAnimeListStream = lazyLoadAnimeListStore;

export function fetchDataGenreAnimeList$(genreId, page, url) {
  return timer(0).pipe(
    tap(() => {
      lazyLoadAnimeListStream.updateAllowUpdatePageGenre(false);
    }),
    mergeMap(() =>
      ajax(url.replace("{genreId}", genreId).replace("{page}", page)).pipe(
        retry(5),
        pluck("response"),
        catchError(() => {
          return of({ error: true });
        })
      )
    )
  );
}

export function updatePageScrollingWindow$() {
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
              lazyLoadAnimeListStream.currentState().pageSplit * 10 <=
              lazyLoadAnimeListStream.currentState().genreDetailData.length
            )
              lazyLoadAnimeListStream.updatePageSplit(
                lazyLoadAnimeListStream.currentState().pageSplit + 1
              );
          })
        ),
        fromEvent(window, "scroll").pipe(
          filter(
            () => document.body.scrollHeight - (window.scrollY + 1000) < 0
          ),
          tap(() => {
            if (
              lazyLoadAnimeListStream.currentState().pageSplit * 10 <=
              lazyLoadAnimeListStream.currentState().genreDetailData.length
            )
              lazyLoadAnimeListStream.updatePageSplit(
                lazyLoadAnimeListStream.currentState().pageSplit + 1
              );
          })
        )
      )
    )
  );
}
