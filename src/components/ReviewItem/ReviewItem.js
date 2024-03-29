import "./ReviewItem.css";
import React from "react";
import { timeSince } from "../../epics/comment";

function ReviewItem({ review, type }) {
  // console.log(review.score);
  return (
    <div className="review-item">
      <div className="user-info-review-container">
        <div className="user-info-review">
          <img src={review.user.images.webp.image_url} alt="Image_reviewer" />
          <div>
            <div className="username">{review.user.username}</div>
          </div>
        </div>
        {(review.episodes_watched || review.chapters_read) && (
          <div>
            {type === "anime"
              ? `${review.episodes_watched} episode${
                  review.episodes_watched > 1 ? "s" : ""
                } watched`
              : `${review.chapters_read} chapter${
                  review.chapters_read > 1 ? "s" : ""
                } read`}
          </div>
        )}
      </div>
      <div className="time-since-review">
        {timeSince(new Date(review.date).getTime()) === "Recently"
          ? `Recently`
          : `${timeSince(new Date(review.date).getTime())} ago`}
      </div>
      <div className="container-board-evaluate">
        <div>
          {Object.keys(review.reactions).map((key, index) => (
            <div className="section-evaluate" key={index}>
              <span>{key.replace("_", " ")}</span>
            </div>
          ))}
          <div className="section-evaluate">
            <span>Score</span>
          </div>
        </div>
        <div>
          {Object.keys(review.reactions).map((key, index) => (
            <div key={index}>
              <span className="score-section">{review.reactions[key]}</span>
            </div>
          ))}
          <div>
              <span className="score-section">{review.score}</span>
            </div>
        </div>
      </div>
      <pre>
        {review.review.replace(/\\n/g, "").split(" ").slice(0, 100).join(" ")}
        {review.review.replace(/\\n/g, "").split(" ").length > 100 ? (
          <span
            className="show-more-text"
            onClick={(e) => {
              e.target.parentElement.innerHTML = review.review.replace(
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
