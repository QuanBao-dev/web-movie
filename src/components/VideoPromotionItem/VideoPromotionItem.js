import "./VideoPromotionItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React from "react";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

function VideoPromotionItem({ video, lazy }) {
  const [toggle, setToggle] = useState(0);
  return (
    <div className="video-promotion-item">
      <h1 className="title">{video.title}</h1>
      {!toggle && (
        <div className="image-video-promotion">
          {lazy && (
            <LazyLoadImage
              src={video.trailer.embed_url
                .replace(
                  "https://www.youtube.com/embed",
                  "https://img.youtube.com/vi"
                )
                .replace(/\?.+/g, "/hqdefault.jpg")}
              alt={video.title}
              width="100%"
              effect="opacity"
            />
          )}
          {!lazy && (
            <img
              src={video.trailer.embed_url
                .replace(
                  "https://www.youtube.com/embed",
                  "https://img.youtube.com/vi"
                )
                .replace(/\?.+/g, "/hqdefault.jpg")}
              alt={video.title}
              width="100%"
            />
          )}
          <div className="container-button-play" onClick={() => setToggle(1)}>
            <span>▶</span>
          </div>
        </div>
      )}
      {toggle && (
        <iframe
          allow="autoplay"
          style={{ margin: "auto",outline:"none",border:"none" }}
          width="100%"
          height="600px"
          src={video.trailer.embed_url.replace(/autoplay=0/g, "autoplay=1")}
          title={video.title}
        />
      )}
    </div>
  );
}
export default VideoPromotionItem;
