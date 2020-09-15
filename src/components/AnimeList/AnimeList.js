import "./AnimeList.css";

import React from "react";

import AnimeItem from "../AnimeItem/AnimeItem";

const AnimeList = ({ data, error, isWrap = true }) => {
  return (
    <div className={isWrap ? "list-anime" : "list-anime-nowrap"}>
      {data &&
        !error &&
        data.map((anime, index) => {
          return <AnimeItem key={index} anime={anime} />;
        })}
      {error && (
        <div
          style={{
            margin: "100px auto 0 auto",
            color: "white",
            fontSize: "150%",
          }}
        >
          Anime is being updated...
        </div>
      )}
    </div>
  );
};

export default AnimeList;
