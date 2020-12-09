import { fromEvent, iif, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  tap,
  catchError,
  debounceTime,
  mergeMapTo,
  pluck,
  retry,
  switchMapTo,
  filter,
} from "rxjs/operators";
import reviewsStore from "../store/reviews";

export const reviewsStream = reviewsStore;

export function fetchReviewsData$(malId, page) {
  return timer(0).pipe(
    tap(() => reviewsStream.updateData({ shouldUpdatePageReviewData: false })),
    switchMapTo(
      ajax(`https://api.jikan.moe/v3/anime/${malId}/reviews/${page}`).pipe(
        pluck("response", "reviews"),
        retry(5),
        tap(() => reviewsStream.updateData({ pageReviewsOnDestroy: page })),
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
              reviewsStream.currentState().pageSplit <=
              reviewsStream.currentState().reviewsData.length
            )
              reviewsStream.updateData({
                pageSplit: reviewsStream.currentState().pageSplit + 1,
              });
          })
        ),
        fromEvent(window, "scroll").pipe(
          filter(
            () => document.body.scrollHeight - (window.scrollY + 1500) < 0
          ),
          tap(() => {
            if (
              reviewsStream.currentState().pageSplit <=
              reviewsStream.currentState().reviewsData.length
            )
              reviewsStream.updateData({
                pageSplit: reviewsStream.currentState().pageSplit + 1,
              });
          })
        )
      )
    )
  );
}
