import Axios from 'axios';
import React from 'react';

import { animeDetailStream } from '../../epics/animeDetail';
import Input from '../Input/Input';

function FormSubmit({
  inputEpisodeRef,
  inputVideoUrlRef,
  cookies,
  malId,
  episodeData,
  typeVideoSelectRef,
}) {
  return (
    <div className="form-submit">
      <select ref={typeVideoSelectRef} defaultValue="video">
        <option value="video">video</option>
        <option value="iframe">iframe</option>
      </select>
      <select
        defaultValue="vi"
        className="select-language-anime"
        onChange={(e) => {
          const languageSelect = e.target;
          const value = languageSelect.value;
          const modeAnime = document.querySelector(".select-mode-anime");
          // console.log(value);
          if (value === "eng") {
            modeAnime.style.display = "block";
          } else {
            modeAnime.style.display = "none";
          }
        }}
      >
        <option value="eng">Eng</option>
        <option value="vi">Vi</option>
      </select>
      <select
        defaultValue="sub"
        className="select-mode-anime"
        style={{ display: "none" }}
      >
        <option value="sub">Sub</option>
        <option value="dub">Dub</option>
      </select>
      <Input label="Number" type="number" input={inputEpisodeRef} />
      <Input label={"Video url"} input={inputVideoUrlRef} />
      <button
        className="btn btn-success"
        type="submit"
        onClick={async () => {
          const episode = parseInt(inputEpisodeRef.current.value);
          const embedUrl = inputVideoUrlRef.current.value;
          const typeVideo = typeVideoSelectRef.current.value === "video";
          const language = document.querySelector(".select-language-anime")
            .value;
          const isDub =
            document.querySelector(".select-mode-anime").value === "dub";
          const { idCartoonUser } = cookies;
          if (!episode || !embedUrl || embedUrl.trim() === "") {
            alert("Episode and Url are required");
            return;
          }
          try {
            const res = await Axios.put(
              `/api/movies/${malId}/episode/${episode}/${language}/${isDub}`,
              {
                embedUrl,
                typeVideo,
              },
              {
                headers: {
                  authorization: `Bearer ${idCartoonUser}`,
                },
              }
            );
            const data = episodeData;
            if (language === "vi") {
              animeDetailStream.updateData({
                dataEpisodesAnime: {
                  ...data,
                  episodes: res.data,
                },
              });
            }
            if (language === "eng") {
              if (isDub) {
                animeDetailStream.updateData({
                  dataEpisodesAnime: {
                    ...data,
                    episodesEngDub: res.data,
                  },
                });
              } else {
                animeDetailStream.updateData({
                  dataEpisodesAnime: {
                    ...data,
                    episodesEng: res.data,
                  },
                });
              }
            }
            inputEpisodeRef.current.value = "";
            inputVideoUrlRef.current.value = "";
          } catch (error) {
            alert("Something went wrong");
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default FormSubmit