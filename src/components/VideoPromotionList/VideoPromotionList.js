import "./VideoPromotionList.css";

import React from "react";

import loadable from "@loadable/component";

const VideoPromotionItem = loadable(
  () => import("../VideoPromotionItem/VideoPromotionItem"),
  {
    fallback: <i className="fas fa-spinner fa-9x fa-spin"></i>,
  }
);
function VideoPromotionList({ data, lazy=false }) {
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
