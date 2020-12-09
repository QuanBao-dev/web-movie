import { reviewsStream, updatePageScrolling$, fetchReviewsData$ } from "../epics/reviews";

export const initReviewState = (setReviewState) => {
  return () => {
    const subscription = reviewsStream.subscribe(setReviewState);
    reviewsStream.init();
    return () => {
      subscription.unsubscribe();
    };
  }
}

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
        isStopFetchingReviews: false,
        pageReviewsOnDestroy: null,
      });
    }
  }
}

export const updatePageScrolling = (shouldUpdatePageReviewData) => {
  return () => {
    const subscription = updatePageScrolling$().subscribe(() => {
      if (
        shouldUpdatePageReviewData &&
        reviewsStream.currentState().pageSplit >
          reviewsStream.currentState().reviewsData.length
      )
        reviewsStream.updateData({
          pageReviewsData:
            reviewsStream.currentState().reviewsData.length / 20 + 1,
        });
    });
    if (reviewsStream.currentState().isStopFetchingReviews) {
      subscription && subscription.unsubscribe();
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
  }
}

export const fetchReviewsData = (pageReviewsData, reviewsData, malId) => {
  return () => {
    let subscription;
    if (
      reviewsStream.currentState().pageReviewsOnDestroy !==
        pageReviewsData &&
      reviewsStream.currentState().isStopFetchingReviews === false
    )
      subscription = fetchReviewsData$(
        malId,
        reviewsStream.currentState().pageReviewsData
      ).subscribe((v) => {
        if (!v.error) {
          let updatedAnime;
          if (
            reviewsStream.currentState().reviewsData.length === 0 ||
            reviewsStream.currentState().previousMalId !== malId
          ) {
            updatedAnime = [...v];
          } else {
            updatedAnime = [...reviewsData, ...v];
          }
          if (
            reviewsStream.currentState().reviewsData.length / 20 + 1 !==
            parseInt(reviewsStream.currentState().reviewsData.length / 20 + 1)
          ) {
            reviewsStream.updateData({ isStopFetchingReviews: true });
          }
          if (updatedAnime.length === 0) {
            reviewsStream.updateData({ isStopFetchingReviews: true });
            return;
          }
          reviewsStream.updateData({
            reviewsData: updatedAnime,
            previousMalId: malId,
            pageReviewsOnDestroy: reviewsStream.currentState().pageReviewsData,
            shouldUpdatePageReviewData: true,
          });
        } else {
          reviewsStream.updateData({
            isStopFetchingReviews: true,
            shouldUpdatePageReviewData: false,
          });
        }
      });
    return () => {
      subscription && subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }
}