import React, { useEffect, useState } from "react";
import { animeDetailStream } from "../../epics/animeDetail";
import { updatedAnimeStream } from "../../epics/updatedAnime";
import Input from "../Input/Input";

function FormSubmitCrawl({
  startEpisodeInputRef,
  endEpisodeInputRef,
  linkWatchingInputRef,
  buttonSubmitCrawlInputRef,
  selectCrawlInputRef,
  malId,
  cookies,
  selectModeEngVideoRef,
}) {
  const [error, setError] = useState(null);
  useEffect(() => {
    buttonSubmitCrawlInputRef.current.disabled = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [malId]);
  return (
    <div className="form-submit">
      <select defaultValue="gogostream" ref={selectCrawlInputRef}>
        <option value="gogostream">gogostream</option>
      </select>
      <select defaultValue="sub" ref={selectModeEngVideoRef}>
        <option value="sub">Sub</option>
        <option value="dub">Dub</option>
      </select>
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
          const isDub = selectModeEngVideoRef.current
            ? selectModeEngVideoRef.current.value === "dub"
            : false;
          // console.log(isDub);
          switch (serverWeb) {
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
            let updateMovie = await fetch(
              `/api/movies/${malId}/episodes/crawl`,
              {
                method: "PUT",
                body: JSON.stringify({
                  start,
                  end,
                  url,
                  serverWeb,
                  isDub,
                }),
                headers: {
                  authorization: `Bearer ${cookies.idCartoonUser}`,
                  "Content-Type": "application/json",
                },
              }
            );
            updateMovie = await updateMovie.json();
            if (updateMovie.error) throw Error(updateMovie.error);

            if (
              startEpisodeInputRef.current &&
              endEpisodeInputRef.current &&
              buttonSubmitCrawlInputRef.current &&
              linkWatchingInputRef.current
            ) {
              animeDetailStream.updateData({
                dataEpisodesAnime: updateMovie.message,
              });
              setError(null);
              startEpisodeInputRef.current.value = "";
              endEpisodeInputRef.current.value = "";
              buttonSubmitCrawlInputRef.current.disabled = false;
              linkWatchingInputRef.current &&
                (linkWatchingInputRef.current.value =
                  updateMovie.message.source || "");
            }
          } catch (error) {
            if (error.message) setError(error.message);

            if (
              startEpisodeInputRef.current &&
              endEpisodeInputRef.current &&
              linkWatchingInputRef.current
            ) {
              startEpisodeInputRef.current.value = "";
              endEpisodeInputRef.current.value = "";
              linkWatchingInputRef.current &&
                (buttonSubmitCrawlInputRef.current.disabled = false);
            }
          }
          updatedAnimeStream.updateData({
            triggerFetch: !updatedAnimeStream.currentState().triggerFetch,
          });
        }}
      >
        Submit
      </button>
    </div>
  );
}
export default FormSubmitCrawl;
