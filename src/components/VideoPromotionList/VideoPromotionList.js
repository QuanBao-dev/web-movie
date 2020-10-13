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
function VideoPromotionList({ data, lazy = false }) {
  return (
    <div className="video-promotion-list">
      {data &&
        data.map((video, index) => {
          return <VideoPromotionItem video={video} key={index} lazy={lazy} />;
        })}
    </div>
  );
}
export default VideoPromotionList;
