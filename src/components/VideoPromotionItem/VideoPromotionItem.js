import React from "react";
function VideoPromotionItem({video}) {
  return (
    <div className="video-promotion-item">
      <h1 className="title">{video.title}</h1>
      <iframe
        style={{ margin: "auto" }}
        width="100%"
        height="500px"
        src={video.video_url.replace(/autoplay=1/g, "autoplay=0")}
        title={video.title}
      ></iframe>
    </div>
  );
}
export default VideoPromotionItem