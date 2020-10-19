import "./VideoPromotionList.css";

import React from "react";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
const VideoPromotionItem = loadable(
  () => import("../VideoPromotionItem/VideoPromotionItem"),
  {
    fallback: <CircularProgress color="inherit" size="7rem" />,
  }
);
function VideoPromotionList({ data, lazy = false, isLoading }) {
  return (
    <div className="video-promotion-list">
      {isLoading !== null && isLoading === true && (
        <div>
          <h1 className="title">Video</h1>
          <CircularProgress color="secondary" size="4rem" />
        </div>
      )}
      {isLoading === false &&
        data &&
        data.map((video, index) => {
          return <VideoPromotionItem video={video} key={index} lazy={lazy} />;
        })}
    </div>
  );
}
export default VideoPromotionList;
