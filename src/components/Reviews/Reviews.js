import "./Reviews.css";

import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  fetchReviewsData$,
  pageWatchStream,
  updatePageScrolling$,
} from "../../epics/pageWatch";

const ReviewItem = loadable(() => import("../ReviewItem/ReviewItem"));

const Reviews = ({ malId }) => {
  const [reviewState, setReviewState] = useState(pageWatchStream.initialState);
  useEffect(() => {
    const subscription = pageWatchStream.subscribe(setReviewState);
    pageWatchStream.init();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (
      pageWatchStream.currentState().reviewsData.length === 0 ||
      pageWatchStream.currentState().previousMalId !== malId
    ) {
      pageWatchStream.allowUpdatePageReviewsData(true);
      pageWatchStream.resetReviewsData();
      pageWatchStream.updatePageReviewsOnDestroy(null);
    }
  }, [malId, reviewState.previousMalId]);
  useEffect(() => {
    const subscription = updatePageScrolling$().subscribe(() => {
      if (
        reviewState.shouldUpdatePageReviewData &&
        pageWatchStream.currentState().pageSplit >
          pageWatchStream.currentState().reviewsData.length
      )
        pageWatchStream.updatePageReview(
          pageWatchStream.currentState().reviewsData.length / 20 + 1
        );
    });
    if (pageWatchStream.currentState().isStopFetchingReviews) {
      subscription && subscription.unsubscribe();
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [reviewState.pageReviewsData, reviewState.shouldUpdatePageReviewData]);
  useEffect(() => {
    let subscription;
    if (
      pageWatchStream.currentState().pageReviewsOnDestroy !==
        reviewState.pageReviewsData &&
      pageWatchStream.currentState().isStopFetchingReviews === false
    )
      subscription = fetchReviewsData$(
        malId,
        pageWatchStream.currentState().pageReviewsData
      ).subscribe((v) => {
        if (!v.error) {
          let updatedAnime;
          if (
            pageWatchStream.currentState().reviewsData.length === 0 ||
            pageWatchStream.currentState().previousMalId !== malId
          ) {
            updatedAnime = [...v];
          } else {
            updatedAnime = [...reviewState.reviewsData, ...v];
          }
          pageWatchStream.updateReviewsData(updatedAnime);
          if (
            pageWatchStream.currentState().reviewsData.length / 20 + 1 !==
            parseInt(pageWatchStream.currentState().reviewsData.length / 20 + 1)
          ) {
            pageWatchStream.updateIsStopFetching(true);
          }
          pageWatchStream.updatePreviousMalId(malId);
          pageWatchStream.allowUpdatePageReviewsData(true);
        } else {
          pageWatchStream.updateIsStopFetching(true);
          pageWatchStream.allowUpdatePageReviewsData(false);
        }
      });
    return () => {
      subscription && subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [malId, reviewState.pageReviewsData]);
  return (
    reviewState &&
    reviewState.reviewsData.length > 0 && (
      <div className="container-reviews">
        {reviewState && reviewState.reviewsData.length > 0 && (
          <h1 className="title">Reviews</h1>
        )}
        {reviewState && reviewState.reviewsData.length > 0 && (
          <div className="reviews-list-container">
            {reviewState &&
              reviewState.reviewsData
                .slice(0, reviewState.pageSplit)
                .map((review, index) => (
                  <ReviewItem key={index} review={review} />
                ))}
            {reviewState && !reviewState.isStopFetchingReviews && (
              <div className="loading-symbol-review">
                <CircularProgress color="secondary" size="3rem" />
              </div>
            )}
            {reviewState && reviewState.isStopFetchingReviews && <h1>End</h1>}
          </div>
        )}
      </div>
    )
  );
};

export default Reviews;
