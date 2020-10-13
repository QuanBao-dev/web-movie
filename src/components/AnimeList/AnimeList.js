import "./AnimeList.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import loadable from "@loadable/component";

const AnimeItem = loadable(() => import("../AnimeItem/AnimeItem"));

const AnimeList = ({
  data,
  error,
  isWrap = true,
  lazy = false,
  empty = false,
}) => {
  return (
    <div className={isWrap ? "list-anime" : "list-anime-nowrap"}>
      {data &&
        !error &&
        data.map((anime, index) => {
          return <AnimeItem key={index} anime={anime} lazy={lazy} />;
        })}
      {data.length === 0 && empty && (
        <div className="empty">
          <CircularProgress color="secondary" size="4rem" />
        </div>
      )}
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
