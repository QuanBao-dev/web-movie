import React from "react";
import AnimeItem from "../AnimeItem/AnimeItem";
import "./AnimeList.css";
const AnimeList = ({data}) => {
  return (
    <div className="list-anime">
      {data&&data.map((anime, index) => {
        return (
          <AnimeItem key={index} anime={anime} />
        );
      })}
    </div>
  )
}

export default AnimeList;