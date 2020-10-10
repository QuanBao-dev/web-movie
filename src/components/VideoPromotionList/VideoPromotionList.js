import "./VideoPromotionList.css";

import React, { Suspense } from "react";

import { nameStream } from "../../epics/name";

const VideoPromotionItem = React.lazy(() =>
  import("../VideoPromotionItem/VideoPromotionItem")
);
function VideoPromotionList({ data }) {
  const nameState = nameStream.currentState();
  return (
    <div className="video-promotion-list">
      {data &&
        data.slice(0, nameState.pageVideo).map((video, index) => {
          return (
            <Suspense
              key={index}
              fallback={<i className="fas fa-spinner fa-5x fa-spin"></i>}
            >
              <VideoPromotionItem video={video} />
            </Suspense>
          );
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
