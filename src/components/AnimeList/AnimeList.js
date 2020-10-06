import "./AnimeList.css";

import React, { Suspense } from "react";

const AnimeItem = React.lazy(() => import("../AnimeItem/AnimeItem"));

const AnimeList = ({ data, error, isWrap = true }) => {
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
                  <i>
                    <i className="fas fa-spinner fa-2x fa-spin"></i>
                  </i>
                </div>
              }
            >
              <AnimeItem key={index} anime={anime} />
            </Suspense>
          );
        })}
      {data.length === 0 && <h1 className="empty"> </h1>}
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
