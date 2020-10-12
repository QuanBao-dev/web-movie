import "./VideoPromotionList.css";

import React from "react";

import { nameStream } from "../../epics/name";
import loadable from "@loadable/component";

const VideoPromotionItem = loadable(
  () => import("../VideoPromotionItem/VideoPromotionItem"),
  {
    fallback: <i className="fas fa-spinner fa-9x fa-spin"></i>,
  }
);
function VideoPromotionList({ data }) {
  const nameState = nameStream.currentState();
  return (
    <div className="video-promotion-list">
      {data &&
        data.slice(0, nameState.pageVideo).map((video, index) => {
          return <VideoPromotionItem video={video} key={index} />;
        })}
      {nameState.pageVideo < data.length && (
        <div
          className="see-more-video"
          onClick={() => {
            nameStream.updatePageVideo(nameStream.currentState().pageVideo + 1);
          }}
        >
          See more
        </div>
      )}
    </div>
  );
}
export default VideoPromotionList;
