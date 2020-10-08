import React, { Suspense } from "react";
const VideoPromotionItem = React.lazy(() =>
  import("../VideoPromotionItem/VideoPromotionItem")
);
function VideoPromotionList({ data }) {
  return (
    <div className="video-promotion-list">
      {data.dataPromo.promo &&
        data.dataPromo.promo.map((video, index) => {
          return (
            <Suspense
              key={index}
              fallback={<i className="fas fa-spinner fa-5x fa-spin"></i>}
            >
              <VideoPromotionItem video={video} />;
            </Suspense>
          );
        })}
    </div>
  );
}
export default VideoPromotionList;
