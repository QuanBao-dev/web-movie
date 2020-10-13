import { fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  mergeMap,
  pluck,
  retry,
  tap,
} from "rxjs/operators";

import lazyLoadAnimeListStore from "../store/lazyLoadAnimeList";

export const lazyLoadAnimeListStream = lazyLoadAnimeListStore;

export function fetchDataGenreAnimeList$(genreId, page, url) {
  return timer(0).pipe(
    tap(() => {
      lazyLoadAnimeListStream.updateAllowUpdatePageGenre(false);
    }),
    mergeMap(() =>
      ajax(url.replace("{genreId}", genreId).replace("{page}", page)).pipe(
        retry(),
        pluck("response"),
        tap(
          () =>
            document.querySelector(".loading-symbol") &&
            (document.querySelector(".loading-symbol").style.display = "none")
        ),
        catchError(() => {
          return of({ error: true });
        })
      )
    )
  );
}

export function updatePageScrollingWindow$() {
  return fromEvent(window, "scroll").pipe(
    filter(() => document.body.scrollHeight - (window.scrollY + 1000) < 0),
    tap(() => {
      if (
        lazyLoadAnimeListStream.currentState().pageSplit * 10 <=
        lazyLoadAnimeListStream.currentState().genreDetailData.length
      )
        lazyLoadAnimeListStream.updatePageSplit(
          lazyLoadAnimeListStream.currentState().pageSplit + 1
        );
    })
  );
}
