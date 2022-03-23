import { timer } from 'rxjs';
import { filter, switchMapTo, takeWhile } from 'rxjs/operators';

import { animeDetailStream } from '../epics/animeDetail';
import { fetchReviewsData$, reviewsStream, updatePageScrolling$ } from '../epics/reviews';

export const initReviewState = (setReviewState) => {
  return () => {
    const subscription = reviewsStream.subscribe(setReviewState);
    reviewsStream.init();
    return () => {
      subscription.unsubscribe();
    };
  };
};

export const resetReviewsState = (malId) => {
  return () => {
    if (
      reviewsStream.currentState().reviewsData.length === 0 ||
      reviewsStream.currentState().previousMalId !== malId
    ) {
      reviewsStream.updateData({
        shouldUpdatePageReviewData: true,
        reviewsData: [],
        pageReviewsData: 1,
        pageSplit: 1,
        isStopFetchingReviews: null,
        pageReviewsOnDestroy: null,
      });
    }
  };
};

export const updatePageScrolling = (shouldUpdatePageReviewData) => {
  return () => {
    const subscription = updatePageScrolling$().subscribe(() => {
      if (
        shouldUpdatePageReviewData &&
        reviewsStream.currentState().pageSplit >
          reviewsStream.currentState().reviewsData.length
      ) {
        if (
          parseInt(reviewsStream.currentState().reviewsData.length / 20 + 1) !==
          reviewsStream.currentState().reviewsData.length / 20 + 1
        ) {
          reviewsStream.updateData({
            isStopFetchingReviews: true,
          });
        } else {
          reviewsStream.updateData({
            pageReviewsData:
              reviewsStream.currentState().reviewsData.length / 20 + 1,
          });
        }
      }
    });
    return () => {
      subscription && subscription.unsubscribe();
    };
  };
};

export const fetchReviewsData = (pageReviewsData, reviewsData, malId) => {
  return () => {
    const subscription = timer(0)
      .pipe(
        takeWhile(
          () =>
            reviewsStream.currentState().pageReviewsOnDestroy !==
              pageReviewsData &&
            reviewsStream.currentState().isStopFetchingReviews === false
        ),
        filter(() => reviewsStream.currentState().pageReviewsData > 1),
        switchMapTo(
          fetchReviewsData$(malId, reviewsStream.currentState().pageReviewsData)
        )
      )
      .subscribe((v) => {
        if (v && !v.error) {
          let updatedAnime;
          if (
            reviewsStream.currentState().reviewsData.length === 0 ||
            reviewsStream.currentState().previousMalId !== malId
          ) {
            updatedAnime = v;
          } else {
            updatedAnime = reviewsData.concat(v);
          }
          if (v.length === 0) {
            reviewsStream.updateData({ isStopFetchingReviews: true });
            return;
          }
          reviewsStream.updateData({
            reviewsData: updatedAnime,
            previousMalId: malId,
            pageReviewsOnDestroy: reviewsStream.currentState().pageReviewsData,
            shouldUpdatePageReviewData: true,
          });
          if (updatedAnime.length > 0)
            animeDetailStream.updateData({
              malId: animeDetailStream.currentState().malId,
            });
        } else {
          reviewsStream.updateData({
            isStopFetchingReviews: true,
            shouldUpdatePageReviewData: false,
          });
        }
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
};
