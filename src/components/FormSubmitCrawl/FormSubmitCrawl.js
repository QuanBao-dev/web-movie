import { Input } from "@material-ui/core";
import Axios from "axios";
import React, { useState } from "react";
import { animeDetailStream } from "../../epics/animeDetail";

function FormSubmitCrawl({
  startEpisodeInputRef,
  endEpisodeInputRef,
  linkWatchingInputRef,
  buttonSubmitCrawlInputRef,
  selectCrawlInputRef,
  malId,
  cookies,
  selectCrawlServerVideo,
  crawlAnimeMode,
  setCrawlAnimeMode,
  selectModeEngVideoRef,
}) {
  const [error, setError] = useState(null);
  return (
    <div className="form-submit">
      <select
        defaultValue="animehay"
        ref={selectCrawlInputRef}
        onChange={(e) => {
          if (e.target.value === "animehay") {
            selectCrawlServerVideo.current.style.display = "block";
          } else {
            selectCrawlServerVideo.current.style.display = "none";
          }
          setCrawlAnimeMode(e.target.value);
        }}
      >
        <option value="animehay">animehay</option>
        <option value="animevsub">animevsub</option>
        <option value="gogostream">gogostream</option>
      </select>
      <select defaultValue="serverMoe" ref={selectCrawlServerVideo}>
        <option value="serverMoe">Moe</option>
        <option value="serverICQ">Kol</option>
      </select>
      {crawlAnimeMode === "gogostream" && (
        <select defaultValue="sub" ref={selectModeEngVideoRef}>
          <option value="sub">Sub</option>
          <option value="dub">Dub</option>
        </select>
      )}
      <div className="form-limit-episode">
        <Input
          label="start"
          type="number"
          input={startEpisodeInputRef}
          error={error}
        />
        <Input label="end" type="number" input={endEpisodeInputRef} />
      </div>
      <Input label="Watch Url" input={linkWatchingInputRef} />
      <button
        className="btn btn-success"
        ref={buttonSubmitCrawlInputRef}
        onClick={async () => {
          const start = startEpisodeInputRef.current.value;
          const end = endEpisodeInputRef.current.value;
          const url = linkWatchingInputRef.current.value;
          const serverWeb = selectCrawlInputRef.current.value;
          const serverVideo = selectCrawlServerVideo.current.value;
          const isDub = selectModeEngVideoRef.current
            ? selectModeEngVideoRef.current.value === "dub"
            : false;
          // console.log(isDub);
          switch (serverWeb) {
            case "animehay":
              if (!url.includes("animehay.tv/phim/")) {
                return alert("Invalid url");
              }
              break;
            case "animevsub":
              if (!url.includes("animevsub.tv/phim/")) {
                return alert("Invalid url");
              }
              break;
            case "gogostream":
              if (
                !url.includes("gogo-stream.com/videos/") ||
                (!/-dub-episode-[0-9]+/.test(url) && isDub === true) ||
                (/-dub-episode-[0-9]+/.test(url) && isDub === false)
              ) {
                return alert("Invalid url");
              }
              break;
            default:
              break;
          }
          if (
            startEpisodeInputRef.current.value.trim() === "" ||
            !startEpisodeInputRef.current.value ||
            endEpisodeInputRef.current.value.trim() === "" ||
            !endEpisodeInputRef.current.value ||
            linkWatchingInputRef.current.value.trim() === "" ||
            !linkWatchingInputRef.current.value
          ) {
            alert("start, end and watch url are required");
            return;
          }
          try {
            buttonSubmitCrawlInputRef.current.disabled = true;
            const updateMovie = await Axios.put(
              `/api/movies/${malId}/episodes/crawl`,
              {
                start,
                end,
                url,
                serverWeb,
                serverVideo,
                isDub,
              },
              {
                headers: {
                  authorization: `Bearer ${cookies.idCartoonUser}`,
                },
              }
            );
            animeDetailStream.updateData({
              dataEpisodesAnime: updateMovie.data.message,
            });
            setError(null);
            startEpisodeInputRef.current.value = "";
            endEpisodeInputRef.current.value = "";
            buttonSubmitCrawlInputRef.current.disabled = false;
            linkWatchingInputRef.current &&
              (linkWatchingInputRef.current.value =
                updateMovie.data.message.source || "");
          } catch (error) {
            if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.error
            ) {
              setError(error.response.data.error);
            }
            startEpisodeInputRef.current.value = "";
            endEpisodeInputRef.current.value = "";
            linkWatchingInputRef.current &&
              (buttonSubmitCrawlInputRef.current.disabled = false);
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}
export default FormSubmitCrawl;
