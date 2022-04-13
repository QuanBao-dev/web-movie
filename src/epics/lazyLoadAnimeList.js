import { fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  filter,
  mergeMap,
  pluck,
  tap,
  timeout,
} from "rxjs/operators";

import lazyLoadAnimeListStore from "../store/lazyLoadAnimeList";

export const lazyLoadAnimeListStream = lazyLoadAnimeListStore;

export function fetchDataGenreAnimeList$(page, url, idCartoonUser, searchBy) {
  let obj = {
    method: "GET",
    url: url.replace("{page}", page),
  };
  if (["latest", "box"].includes(searchBy)) {
    obj.headers = {
      authorization: `Bearer ${idCartoonUser}`,
    };
  }
  return timer(0).pipe(
    filter(() => page === parseInt(page)),
    tap(() => {
      lazyLoadAnimeListStream.updateData({
        pageIsLoaded: page,
      });
    }),
    mergeMap(() =>
      ajax(obj).pipe(
        timeout(5000),
        pluck("response"),
        catchError(() => {
          return of({ error: true });
        })
      )
    )
  );
}

export function updatePageScrollingWindow$() {
  return fromEvent(window, "scroll").pipe(
    filter(
      () =>
        document.body.scrollHeight - (window.scrollY + window.innerHeight) < 0
    ),
    debounceTime(300)
  );
}

export function calculateRowStartEnd(containerListRef, heightItem) {
  const offsetTopContainerList = containerListRef.current.offsetTop;
  const currentRow = Math.ceil(
    (-offsetTopContainerList + window.scrollY + window.innerHeight) / heightItem
  );
  const numberRowToFillTheScreen =
    Math.ceil(window.innerHeight / heightItem) +
    lazyLoadAnimeListStream.currentState().quantityItemPerRow;
  const rowStart =
    currentRow - numberRowToFillTheScreen >= 1
      ? currentRow - numberRowToFillTheScreen
      : 1;
  const rowEnd = currentRow + numberRowToFillTheScreen;
  return { rowStart, rowEnd };
}
