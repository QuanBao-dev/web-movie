import React, { useEffect, useState } from "react";
import { fetchTopMovie$, stream } from "../epics/todo";
import "./Name.css";

const fetchData = async (name) => {
  let data = await fetch("http://api.jikan.moe/v3/search/anime?q=" + name);
  data = await data.json();
  return data;
};

const fetchDataVideo = async (malId) => {
  let data = await fetch(`https://api.jikan.moe/v3/anime/${malId}/videos`);
  data = await data.json();
  return data;
};
let findingAnime;

const Name = (props) => {
  const { name } = props.match.params;
  const [data, setData] = useState({});
  useEffect(() => {
    findingAnime = null;
    const subscription = stream.subscribe(setData);
    stream.init();
    const subscription2 = fetchTopMovie$().subscribe();
    fetchData(name)
      .then((v) => {
        if (v.status !== 403) {
          setData(v);
          return v;
        }
      })
      .then(async (v) => {
        const anime = v.results.find((mv) => mv.title === name);
        const api = await fetchDataVideo(anime.mal_id);
        setData({
          ...v,
          dataPromo: api,
        });
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
    };
  }, [name]);
  if (data.dataDetailOriginal && (!findingAnime || !findingAnime.synopsis)) {
    findingAnime = data.dataDetailOriginal.find((v) => {
      return v.title === name;
    });
  }
  if (data.dataTopMovie && (!findingAnime || !findingAnime.synopsis)) {
    findingAnime = data.dataTopMovie.find((v) => {
      return v.title === name;
    });
  }
  if (data.dataFilter && (!findingAnime || !findingAnime.synopsis)) {
    findingAnime = data.dataFilter.find((v) => {
      return v.title === name;
    });
  }

  if (data.results && (!findingAnime || !findingAnime.synopsis)) {
    findingAnime = data.results.find((v) => {
      return v.title === name;
    });
  }

  let arrKeys;
  if (findingAnime) {
    arrKeys = Object.keys(findingAnime).filter((v) => {
      return ["title", "image_url", "url", "synopsis"].indexOf(v) === -1
        ? true
        : false;
    });
  }
  console.log(data);
  return (
    <div className="layout">
      {findingAnime && (
        <div className="anime-name-info">
          <div className="title">{findingAnime.title}</div>
          <div className="image">
            <img src={findingAnime.image_url} alt="" />
          </div>
          <div className="box">
            <div className="box-info">
              <div>Thong tin</div>
              <ul>
                {arrKeys &&
                  arrKeys.map((v, index) => {
                    if (typeof findingAnime[v] !== "object") {
                      return (
                        <li key={index}>
                          {v}: {`${findingAnime[v]}`}
                        </li>
                      );
                    } else {
                      const genres =
                        findingAnime[v] &&
                        findingAnime[v].map((v) => v.name).join(" | ");
                      return (
                        <li key={index}>
                          {v}: {`${genres}`}
                        </li>
                      );
                    }
                  })}
              </ul>
            </div>
            <div className="box-content">
              <div className="title">Noi dung</div>
              <div className="content">{findingAnime.synopsis}</div>
              <a
                className="link"
                href={findingAnime.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                More information
              </a>
            </div>
          </div>
          {data.dataPromo && (
            <div className="video-promotion-list">
              {data.dataPromo.promo &&
                data.dataPromo.promo.map((video, index) => {
                  return (
                    <div className="video-promotion-item" key={index}>
                      <div className="title">{video.title}</div>
                      <iframe
                        style={{ margin: "1rem 0" }}
                        width="100%"
                        height="500px"
                        src={video.video_url.replace(
                          /autoplay=1/g,
                          "autoplay=0"
                        )}
                        title={video.title}
                      ></iframe>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Name;
