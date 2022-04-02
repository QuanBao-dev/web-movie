import { fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  mergeMap,
  pluck,
  retry,
  tap,
  timeout,
} from "rxjs/operators";

import lazyLoadAnimeListStore from "../store/lazyLoadAnimeList";

export const lazyLoadAnimeListStream = lazyLoadAnimeListStore;

export function fetchDataGenreAnimeList$(page, url) {
  return timer(0).pipe(
    tap(() => {
      lazyLoadAnimeListStream.updateDataQuick({
        allowFetchIncreaseGenrePage: false,
      });
      if (page !== parseInt(page)) {
        lazyLoadAnimeListStream.updateData({ isStopScrollingUpdated: true });
      }
    }),
    filter(() => page === parseInt(page)),
    mergeMap(() =>
      ajax(url.replace("{page}", page)).pipe(
        timeout(5000),
        retry(
          lazyLoadAnimeListStream.currentState().genreDetailData.length > 0
            ? 5
            : null
        ),
        pluck("response", "data"),
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
    tap(() => {
      if (
        lazyLoadAnimeListStream.currentState().pageSplit *
          lazyLoadAnimeListStream.currentState().numberAnimeShowMore <=
        lazyLoadAnimeListStream.currentState().genreDetailData.length
      ) {
        lazyLoadAnimeListStream.updateData({
          pageSplit: lazyLoadAnimeListStream.currentState().pageSplit + 1,
        });
      }
    })
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
