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
  takeWhile,
  timeout,
  map,
} from "rxjs/operators";
import cachesStore from "../store/caches";
import reviewsStore from "../store/reviews";

export const reviewsStream = reviewsStore;

export function fetchReviewsData$(malId, page, type) {
  return timer(0).pipe(
    filter(() => type),
    tap(() => reviewsStream.updateData({ isStopFetchingReviews: false })),
    switchMapTo(
      iif(
        () =>
          cachesStore.currentState()[malId] &&
          cachesStore.currentState()[malId].dataReviews,
        timer(0).pipe(map(() => cachesStore.currentState()[malId].dataReviews)),
        ajax(
          `https://api.jikan.moe/v4/${type}/${malId}/reviews?page=${page}`
        ).pipe(
          pluck("response", "data"),
          retry(3),
          timeout(5000),
          retry(
            reviewsStream.currentState().reviewsData.length === 0 ? null : 3
          ),
          tap(() => reviewsStream.updateData({ pageReviewsOnDestroy: page })),
          catchError((error) => {
            return of({ error });
          })
        )
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
          takeWhile(() => !reviewsStream.currentState().isStopFetchingReviews),
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
          takeWhile(() => !reviewsStream.currentState().isStopFetchingReviews),
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
