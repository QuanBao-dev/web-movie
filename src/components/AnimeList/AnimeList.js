import "./AnimeList.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useRef } from "react";
import { useState } from "react";

import { lazyLoadAnimeListStream } from "../../epics/lazyLoadAnimeList";
import { virtualAnimeListStream } from "../../epics/virtualAnimeList";
import {
  useInitVirtualAnimeList,
  useUpdateVirtualAnimeList,
  useVirtualizeListAnime,
} from "../../Hook/virtualAnimeList";

const AnimeItem = loadable(() => import("../AnimeItem/AnimeItem"));
const AnimeList = ({
  data,
  error,
  isWrap = true,
  lazy = false,
  empty = false,
  virtual = false,
}) => {
  const listAnimeRef = useRef();
  const [virtualAnimeListState, setVirtualAnimeListState] = useState(
    virtualAnimeListStream.currentState()
  );
  useInitVirtualAnimeList(setVirtualAnimeListState);
  useUpdateVirtualAnimeList(virtual, data, virtualAnimeListState);
  useVirtualizeListAnime(virtual, listAnimeRef);
  const { numberAnimeShowMore } = lazyLoadAnimeListStream.currentState();
  const {
    numberShowMorePreviousAnime,
    numberShowMoreLaterAnime,
    quantityAnimePerRow,
  } = virtualAnimeListStream.currentState();
  const newIndexStartValue =
    data.length -
    numberAnimeShowMore * (numberShowMorePreviousAnime + 2) -
    quantityAnimePerRow;
  let indexStart =
    parseInt(
      newIndexStartValue <= quantityAnimePerRow
        ? 0
        : newIndexStartValue / quantityAnimePerRow
    ) * quantityAnimePerRow;
  const newIndexEndValue =
    indexStart +
    (numberAnimeShowMore - 1) +
  numberAnimeShowMore * (numberShowMoreLaterAnime + 1) +
    quantityAnimePerRow * 2;
  const indexEnd =
    newIndexEndValue < data.length ? newIndexEndValue : data.length - 1;
  indexStart = indexStart <= quantityAnimePerRow ? 0 : indexStart;
  return (
    <div
      ref={listAnimeRef}
      className={isWrap ? "list-anime" : "list-anime-nowrap"}
      style={{ position: virtual ? "relative" : "static" }}
    >
      {data &&
        !virtual &&
        !error &&
        data.map((anime, index) => {
          return (
            <AnimeItem
              key={index}
              anime={anime}
              lazy={lazy}
              virtual={virtual}
              index={index}
            />
          );
        })}
      {data &&
        virtual &&
        !error &&
        data.slice(indexStart, indexEnd + 1).map((anime, index) => {
          // console.log(indexStart, indexEnd);
          return (
            <AnimeItem
              key={index + indexStart}
              anime={anime}
              lazy={lazy}
              virtual={virtual}
              index={index + indexStart}
            />
          );
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
