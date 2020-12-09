import { fromEvent, iif, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  mergeMapTo,
  pluck,
  retry,
  tap,
} from "rxjs/operators";
import topAnimeListStore from "../store/topAnimeList";

export const topAnimeListStream = topAnimeListStore;

export const topMovieUpdatedScrolling$ = (topAnimeElement) => {
  return timer(0).pipe(
    mergeMapTo(
      iif(
        () => window.innerWidth > 770,
        fromEvent(
          topAnimeListStream.currentState().screenWidth > 1510
            ? topAnimeElement
            : window,
          "scroll"
        ).pipe(
          filter(() =>
            topAnimeListStream.currentState().screenWidth > 1510
              ? topAnimeElement.scrollTop -
                  (topAnimeElement.scrollHeight - 5000) >
                0
              : document.body.scrollHeight - (window.scrollY + 2000) < 0
          ),
          tap(() => {
            if (
              8 +
                (topAnimeListStream.currentState().pageSplitTopMovie - 1) * 5 <=
              topAnimeListStream.currentState().dataTopMovie.length
            )
              topAnimeListStream.updateData({
                pageSplitTopMovie:
                  topAnimeListStream.currentState().pageSplitTopMovie + 1,
              });
          })
        ),
        fromEvent(
          topAnimeListStream.currentState().screenWidth > 1510
            ? topAnimeElement
            : window,
          "scroll"
        ).pipe(
          debounceTime(500),
          filter(() =>
            topAnimeListStream.currentState().screenWidth > 1510
              ? topAnimeElement.scrollTop -
                  (topAnimeElement.scrollHeight - 5000) >
                0
              : document.body.scrollHeight - (window.scrollY + 2000) < 0
          ),
          tap(() => {
            if (
              8 +
                (topAnimeListStream.currentState().pageSplitTopMovie - 1) * 5 <=
              topAnimeListStream.currentState().dataTopMovie.length
            )
              topAnimeListStream.updateData({
                pageSplitTopMovie:
                  topAnimeListStream.currentState().pageSplitTopMovie + 1,
              });
          })
        )
      )
    )
  );
};

export const fetchTopMovie$ = () => {
  return timer(0).pipe(
    tap(() =>
      topAnimeListStream.updateData({ allowFetchIncreasePageTopMovie: false })
    ),
    exhaustMap(() =>
      ajax({
        url: `https://api.jikan.moe/v3/top/anime/${
          topAnimeListStream.currentState().pageTopMovie
        }`,
      }).pipe(
        pluck("response", "top"),
        tap(() => {
          topAnimeListStream.updateData({
            allowFetchIncreasePageTopMovie: true,
          });
          topAnimeListStream.updateDataQuick({
            pageTopMovieOnDestroy: topAnimeListStream.currentState()
              .pageTopMovie,
          });
        }),
        retry(5),
        catchError((err) => {
          topAnimeListStream.updateData({
            isStopFetchTopMovie: true,
          });
          topAnimeListStream.updateData({
            allowFetchIncreasePageTopMovie: false,
          });
          return of(topAnimeListStream.currentState().dataTopMovie);
        })
      )
    )
  );
};
