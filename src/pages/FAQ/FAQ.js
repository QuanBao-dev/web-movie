import "./FAQ.css";
import React from "react";
const FAQ = () => {
  return (
    <div className="container-faq">
      <h1>FAQ</h1>
      <h2>Table of contents</h2>
      <ul>
        <li>How to use theater</li>
        <li>How to get video url for theater easily</li>
      </ul>
      <h2>How to use theater</h2>
      <p>
        Firstly, This feature require you log in so you need to sign in, after
        that all you need to do is just create room, join the room you want by
        typing correct password into input field of that room
      </p>
      <p>
        Secondly, uploading video. There are two ways to upload video by using
        video url or choosing file mp4.
      </p>
      <ul>
        <li>
          Uploading by video url: When uploading process has been completed, the
          video will automatically upload video to all members in room
          instantly. Make sure all the members has already joined room
        </li>
        <li>
          Uploading by choosing file mp4: This method require all members in
          room have gotten the video mp4 because it will not automatically
          upload video to all members for you
        </li>
      </ul>
      <h2>How to get video url for theater easily</h2>
      <p>There are two ways to get video url on this website</p>
      <ul>
        <li>
          You need to go to the page watching anime and click in the button with
          the name "Copy url for theater" to get url. But there's some cases the
          video wouldn't have that button. So you need to use another solution
        </li>
        <li>
          Extracting the link video from console (only work for desktop).
          <ul>
            <li>
              Press f12 to open the console, go to network, reload the page and
              search for mp4 by typing "mp4" in filter input in the console,
              play the video to load video stream, and then you just choose the
              one will lead you to the video which is video we need. Maybe, video will has multiple server. So make sure you check out all of them 
            </li>
          </ul>
        </li>
        <li>
          Extracting the link by downloading video (only work for phone)
          <ul>
            <li>
              Click the symbol download video when you hover on the playing
              video.
            </li>
            <li>
              Choose one server to download. After that, website will redirect
              to the link to download. Copy that link which is what you need
            </li>
          </ul>
        </li>
      </ul>
      <div>
        Note: Method 2 and 3 currently just work on the Engsub or Engdub episodes.
        Maybe it will not work at some point in the future. I have no guarantee
        that It will work eternally.
      </div>
    </div>
  );
};

export default FAQ;
