import lazyLoadAnimeListStore from "../store/lazyLoadAnimeList";
import { fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  filter,
  mergeMap,
  pluck,
  retry,
  tap,
} from "rxjs/operators";

export const lazyLoadAnimeListStream = lazyLoadAnimeListStore;

export function fetchDataGenreAnimeList$(genreId, page, url) {
  return timer(0).pipe(
    tap(() => {
      lazyLoadAnimeListStream.updateAllowUpdatePageGenre(false);
      if (
        document.querySelector(".loading-symbol") &&
        document.querySelector(".loading-symbol").style.display !== "flex"
      )
        document.querySelector(".loading-symbol").style.display = "flex";
      else endFetching();
    }),
    //`https://api.jikan.moe/v3/genre/anime/${genreId}/${page}`
    mergeMap(() =>
      ajax(url.replace("{genreId}",genreId).replace("{page}",page)).pipe(
        retry(5),
        pluck("response"),
        tap(
          () =>
            document.querySelector(".loading-symbol") &&
            (document.querySelector(".loading-symbol").style.display = "none")
        ),
        catchError(() => {
          endFetching();
          return of({ error: true });
        })
      )
    )
  );
}

function endFetching() {
  if (document.querySelector(".loading-symbol")) {
    document.querySelector(".loading-symbol").style.display = "none";
  }
}

export function updatePageScrollingWindow$() {
  return fromEvent(window, "scroll").pipe(
    debounceTime(1000),
    filter(() => document.body.scrollHeight - (window.scrollY + 2000) < 0)
  );
}
