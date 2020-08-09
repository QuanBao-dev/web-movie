import './AnimeList.css';

import React, { createRef } from 'react';

import AnimeItem from '../AnimeItem/AnimeItem';

const AnimeList = ({ data, error }) => {
  const imageRefs = Array.from(Array(data.length)).map(() => createRef());
  return (
    <div className="list-anime">
      {data &&
        !error &&
        data.map((anime, index) => {
          return (
            <AnimeItem key={index} anime={anime} imageRef={imageRefs[index]} />
          );
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
