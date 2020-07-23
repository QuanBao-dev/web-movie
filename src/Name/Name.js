import React, { useEffect, useState } from "react";
import { fetchTopMovie$, stream } from "../epics/todo";
import "./Name.css";

const fetchData = async (name) => {
  let data = await fetch("http://api.jikan.moe/v3/search/anime?q=" + name);
  data = await data.json();
  return data;
};

const Name = (props) => {
  const { name } = props.match.params;
  const [data, setData] = useState({});
  useEffect(() => {
    const subscription = stream.subscribe(setData);
    stream.init();
    const subscription2 = fetchTopMovie$().subscribe();
    fetchData(name)
      .then((v) => {
        if (v.status !== 403) {
          setData(v);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
    };
  }, [name]);
  let findingAnime;
  if (data.dataTopMovie && !findingAnime) {
    findingAnime = data.dataTopMovie.find((v) => {
      return v.title === name;
    });
  }
  if (data.dataDetail && !findingAnime) {
    findingAnime = data.dataDetail.find((v) => {
      return v.title === name;
    });
  }
  if(data.dataFilter && !findingAnime){
    findingAnime = data.dataFilter.find((v) => {
      return v.title === name;
    });
  }
  if (data.results) {
    findingAnime = data.results.find((v) => {
      return v.title === name;
    });
  }
  console.log(data);
  let arrKeys;
  if(findingAnime){
    arrKeys = Object.keys(findingAnime).filter(v => {
      return ["title","image_url","url","synopsis"].indexOf(v) === -1 ? true : false
    });
  }
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
                {arrKeys && arrKeys.map((v, index) => {
                  if(typeof findingAnime[v] !== "object"){
                    return (
                      <li key={index}>
                        {v}: {`${findingAnime[v]}`}
                      </li>
                    );

                  } else {
                    const genres = findingAnime[v] && findingAnime[v].map(v => v.name).join(" | ");
                    return (
                      <li key={index}>
                        {v}: {`${genres}`}
                      </li>
                    )
                  }
                })}
              </ul>
            </div>
            <div className="box-content">
              <div className="title">Noi dung</div>
              <div className="content">{findingAnime.synopsis}</div>
              <a className="link" href={findingAnime.url}>
                More information
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Name;
