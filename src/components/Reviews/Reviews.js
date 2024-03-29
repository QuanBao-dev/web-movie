import "./Reviews.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useState } from "react";

import { reviewsStream } from "../../epics/reviews";
import {
  useInitReviewsState,
  useResetReviewsState,
  useUpdatePageScrolling,
  useFetchReviewsData,
} from "../../Hook/reviews";

const ReviewItem = loadable(() => import("../ReviewItem/ReviewItem"));

const Reviews = ({ malId, type }) => {
  const [reviewState, setReviewState] = useState(reviewsStream.currentState());
  useInitReviewsState(setReviewState);
  useResetReviewsState(malId, reviewState);
  useUpdatePageScrolling(reviewState);
  useFetchReviewsData(reviewState, malId, type);
  return (
    <div
      className="container-reviews"
      style={{
        boxShadow: reviewState.reviewsData.length === 0 && "none",
      }}
    >
      {(reviewState.isStopFetchingReviews === false ||
        (reviewState && reviewState.reviewsData.length > 0)) && (
        <h1 className="title">Reviews</h1>
      )}
      {reviewState &&
        reviewState.reviewsData.length === 0 &&
        reviewState.isStopFetchingReviews === false && (
          <div className="loading-symbol-review">
            <CircularProgress color="secondary" size="3rem" />
          </div>
        )}
      {reviewState && reviewState.reviewsData.length > 0 && (
        <div className="reviews-list-container">
          {reviewState &&
            reviewState.reviewsData
              .slice(0, reviewState.pageSplit)
              .map((review, index) => (
                <ReviewItem type={type} key={index} review={review} />
              ))}
          {reviewState && !reviewState.isStopFetchingReviews && (
            <div className="loading-symbol-review">
              <CircularProgress color="secondary" size="3rem" />
            </div>
          )}
          {/* {reviewState && reviewState.isStopFetchingReviews && <h1>End</h1>} */}
        </div>
      )}
    </div>
  );
};

export default Reviews;
