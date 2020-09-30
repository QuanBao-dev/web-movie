import "./Reviews.css";

import React, { useEffect, useState } from "react";

import {
  fetchReviewsData$,
  pageWatchStream,
  updatePageScrolling$,
} from "../../epics/pageWatch";
import { timeSince } from "../../epics/comment";

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
    const subscription = updatePageScrolling$().subscribe(() => {
      pageWatchStream.updatePageReview(
        pageWatchStream.currentState().reviewsData.length / 20 + 1
      );
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [reviewState.pageReviewsData]);
  useEffect(() => {
    let subscription;
    if (
      pageWatchStream.currentState().pageReviewsOnDestroy !==
        reviewState.pageReviewsData &&
      pageWatchStream.currentState().shouldUpdatePageReviewData
    )
      subscription = fetchReviewsData$(
        malId,
        pageWatchStream.currentState().pageReviewsData
      ).subscribe((v) => {
        if (!v.error) {
          console.log(v);
          pageWatchStream.updateReviewsData(v);
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
  }, [malId, reviewState.pageReviewsData]);
  return (
    <div className="container-reviews">
      <h1 className="title">Reviews</h1>
      {reviewState && reviewState.reviewsData.length === 0 && (
        <div>Don't have any reviews</div>
      )}
      {reviewState && reviewState.reviewsData.length > 0 && (
        <div className="reviews-list-container">
          {reviewState &&
            reviewState.reviewsData.map((review, index) => (
              <div className="review-item" key={index}>
                <div className="user-info-review-container">
                  <div className="user-info-review">
                    <img src={review.reviewer.image_url} alt="Image_reviewer" />
                    <div>
                      <div className="username">{review.reviewer.username}</div>
                      <div className="helpful-count">
                        {review.helpful_count} people found this review helpful
                      </div>
                    </div>
                  </div>
                  <div>
                    {review.reviewer.episodes_seen} episodes seen
                  </div>
                </div>
                <div className="time-since-review">
                  {timeSince(new Date(review.date).getTime()) === "Recently"
                    ? `Recently`
                    : `${timeSince(new Date(review.date).getTime())} ago`}
                </div>
                <div className="container-board-evaluate">
                  <div>
                    {Object.keys(review.reviewer.scores).map((key, index) => (
                      <div className="section-evaluate" key={index}>
                        <span>{key}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {Object.values(review.reviewer.scores).map(
                      (value, index) => (
                        <div key={index}>
                          <span className="score-section">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <pre>
                  {review.content.replace(/\\n/g, "").slice(0, 893)}
                  {review.content.replace(/\\n/g, "").length > 893 ? (
                    <span
                      className="show-more-text"
                      onClick={(e) => {
                        e.target.parentElement.innerHTML = review.content.replace(
                          /\\n/g,
                          ""
                        );
                      }}
                    >
                      ...Show more
                    </span>
                  ) : (
                    ""
                  )}
                </pre>
              </div>
            ))}
          {reviewState && !reviewState.isStopFetchingReviews && (
            <i className="fas fa-spinner fa-3x fa-spin loading-symbol"></i>
          )}
          {reviewState && reviewState.isStopFetchingReviews && <h1>End</h1>}
        </div>
      )}
    </div>
  );
};

export default Reviews;
