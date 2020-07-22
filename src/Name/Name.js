import React, { useEffect, useState } from "react";
import { stream } from "../epics/todo";
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
    fetchData(name).then((v) => {
      setData(v);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [name]);
  let findingAnime;
  if (data.dataDetail) {
    findingAnime = data.dataDetail.find((v) => {
      return v.title === name;
    });
  }
  if (data.results) {
    findingAnime = data.results.find((v) => {
      return v.title === name;
    });
  }
  // console.log(data);
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
                <li>airing: {`${findingAnime.airing}`}</li>
                <li>start_date: {findingAnime.start_date}</li>
                <li>Type: {findingAnime.type}</li>
                <li>rated:{findingAnime.rated}</li>
                <li>score: {findingAnime.score}</li>
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
