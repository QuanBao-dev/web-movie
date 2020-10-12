import "./AnimeList.css";

import React, { Suspense } from "react";

const AnimeItem = React.lazy(() => import("../AnimeItem/AnimeItem"));

const AnimeList = ({ data, error, isWrap = true, lazy = false }) => {
  return (
    <div className={isWrap ? "list-anime" : "list-anime-nowrap"}>
      {data &&
        !error &&
        data.map((anime, index) => {
          return (
            <Suspense
              key={index}
              fallback={
                <div>
                  <i className="fas fa-spinner fa-2x fa-spin"></i>
                </div>
              }
            >
              <AnimeItem key={index} anime={anime} lazy={lazy} />
            </Suspense>
          );
        })}
      {data.length === 0 && (
        <div className="empty">
          <i className="fas fa-spinner fa-2x fa-spin"></i>
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
