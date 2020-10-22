import './VideoPlayerSection.css';

import React from 'react';

function VideoPlayerSection({ currentEpisode, user }) {
  return (
    <div className="video-player-container">
      <div
        className={`section-play-movie${
          currentEpisode && !currentEpisode.typeVideo
            ? " padding-control"
            : " padding-none"
        }`}
      >
        {currentEpisode && !currentEpisode.typeVideo && (
          <iframe
            className="embed-video-player"
            width="100%"
            height="100%"
            src={currentEpisode.embedUrl}
            title={currentEpisode.episode}
            allowFullScreen
          />
        )}
        {currentEpisode && currentEpisode.typeVideo && (
          <div className="video-container__episode">
            {user && (
              <div className="container-copy">
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "black" }}
                  onClick={() => {
                    document.querySelector(".result-success").style.display =
                      "inline-block";
                    document.addEventListener("copy", (e) => {
                      copyToClipboard(e, currentEpisode);
                    });
                    document.execCommand("copy");
                  }}
                >
                  Copy Video Url for theater
                </button>
                <div className="result-success">
                  <img
                    src="https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-size_restricted.gif"
                    alt="check_success"
                  />
                  <span>Ok</span>
                </div>
              </div>
            )}
            <video
              className="video-player"
              width="100%"
              height="100%"
              src={currentEpisode.embedUrl}
              controls={true}
              playsInline
            ></video>
          </div>
        )}
      </div>
    </div>
  );
}
const copyToClipboard = (event, currentEpisode) => {
  event.clipboardData.setData("text", currentEpisode.embedUrl);
  event.preventDefault();
};

export default VideoPlayerSection;
