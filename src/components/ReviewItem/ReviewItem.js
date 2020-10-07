import "./ReviewItem.css";
import React from "react";
import { timeSince } from "../../epics/comment";
function ReviewItem({ review }) {
  return (
    <div className="review-item">
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
          {review.reviewer.episodes_seen} episode
          {review.reviewer.episodes_seen > 1 ? "s" : ""} seen
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
          {Object.values(review.reviewer.scores).map((value, index) => (
            <div key={index}>
              <span className="score-section">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <pre>
        {review.content.replace(/\\n/g, "").split(" ").slice(0, 100).join(" ")}
        {review.content.replace(/\\n/g, "").split(" ").length >= 100 ? (
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
  );
}

export default ReviewItem;
