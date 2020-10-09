import "./Reviews.css";

import React, { Suspense, useEffect, useState } from "react";

import {
  fetchReviewsData$,
  pageWatchStream,
  updatePageScrolling$,
} from "../../epics/pageWatch";
const ReviewItem = React.lazy(() => import("../ReviewItem/ReviewItem"));

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
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      pageWatchStream.allowUpdatePageReviewsData(true);
      pageWatchStream.resetReviewsData();
      pageWatchStream.updatePageReviewsOnDestroy(null);
    }
  }, [malId, reviewState.previousMalId]);
  useEffect(() => {
    let subscription;
    if (reviewState.shouldUpdatePageReviewData)
      subscription = updatePageScrolling$().subscribe(() => {
        pageWatchStream.updatePageReview(
          pageWatchStream.currentState().reviewsData.length / 20 + 1
        );
      });
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
          const updatedAnime = [...reviewState.reviewsData, ...v];
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
              reviewState.reviewsData.map((review, index) => (
                <Suspense key={index} fallback={<div>Loading...</div>}>
                  <ReviewItem review={review} />
                </Suspense>
              ))}
            {reviewState && !reviewState.isStopFetchingReviews && (
              <div className="loading-symbol-review">
                <i className="fas fa-spinner fa-3x fa-spin"></i>
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
