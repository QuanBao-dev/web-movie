import "./AnimeListSeason.css";

import CircularProgress from "@material-ui/core/CircularProgress";
import capitalize from "lodash/capitalize";
import React, { useEffect, useRef, useState } from "react";

import { animeListSeasonStream } from "../../epics/animeListSeason";
import {
  useFetchAnimeListSeason,
  useFilterAnimeList,
  useInitAnimeListSeason,
  useListenWhenOptionChange,
} from "../../Hook/animeListSeason";
import AnimeList from "../AnimeList/AnimeList";
import PageNavList from "../PageNavList/PageNavList";

const AnimeListSeason = () => {
  const [animeListSeasonState, setAnimeListSeasonState] = useState(
    animeListSeasonStream.currentState()
  );
  const targetScroll = useRef(null);

  const startYear = 1963;
  const endYear = new Date(Date.now()).getFullYear() + 1;
  const numberOfYears = endYear - startYear + 1;
  let numberOfPagesDisplay;
  if (animeListSeasonStream.currentState().screenWidth > 354) {
    numberOfPagesDisplay =
      animeListSeasonState.maxPage < 4 ? animeListSeasonState.maxPage : 4;
  } else if (animeListSeasonStream.currentState().screenWidth > 305) {
    numberOfPagesDisplay =
      animeListSeasonState.maxPage < 3 ? animeListSeasonState.maxPage : 3;
  } else {
    numberOfPagesDisplay =
      animeListSeasonState.maxPage < 2 ? animeListSeasonState.maxPage : 2;
  }
  useInitAnimeListSeason(setAnimeListSeasonState);
  useFilterAnimeList(animeListSeasonState);
  useFetchAnimeListSeason(animeListSeasonState);
  useEffect(() => {
    if (!animeListSeasonState.isInit) {
      window.scroll({
        top: targetScroll.current.offsetTop - 170,
      });
      animeListSeasonStream.updateDataQuick({
        isSmoothScroll: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeListSeasonState.triggerScroll]);
  return (
    <div style={{ width: "100%" }} className="anime-list-season-container">
      <h1 style={{ textAlign: "center" }}>
        Anime
        {animeListSeasonState.score !== 0
          ? " with score greater than " + animeListSeasonState.score
          : ""}{" "}
        in {capitalize(animeListSeasonState.season)},{" "}
        {animeListSeasonState.year}
      </h1>
      <SelectFilterAnime
        targetScroll={targetScroll}
        animeListSeasonState={animeListSeasonState}
        numberOfYears={numberOfYears}
      />

      <PageNavList
        numberOfPagesDisplay={numberOfPagesDisplay}
        animeListSeasonState={animeListSeasonState}
      />
      {animeListSeasonState.dataDetail.length === 0 && (
        <h1 style={{ textAlign: "center" }}>...</h1>
      )}
      <AnimeList
        lazy={
          animeListSeasonState.currentPage !==
            animeListSeasonState.currentPageOnDestroy ||
          animeListSeasonState.season !==
            animeListSeasonState.currentSeasonOnDestroy ||
          animeListSeasonState.year !==
            animeListSeasonState.currentYearOnDestroy
        }
        data={animeListSeasonState.dataDetail.sort(
          (a, b) =>
            -(a.aired.prop.from.month * 30 + a.aired.prop.from.day) +
            (b.aired.prop.from.month * 30 + b.aired.prop.from.day)
        )}
        error={animeListSeasonState.error || null}
        empty={false}
      />
      <PageNavList
        numberOfPagesDisplay={numberOfPagesDisplay}
        animeListSeasonState={animeListSeasonState}
      />
    </div>
  );
};

function SelectFilterAnime({
  targetScroll,
  animeListSeasonState = animeListSeasonStream.currentState(),
  numberOfYears,
}) {
  const selectYear = useRef(null);
  const selectSeason = useRef(null);
  const selectScore = useRef(null);
  const elementOptions = Array.from(Array(numberOfYears).keys()).map(
    (v) => new Date(Date.now()).getFullYear() + 1 - v
  );
  const scoreOptions = Array.from(Array(10).keys());
  useListenWhenOptionChange(
    animeListSeasonState,
    selectSeason,
    selectYear,
    selectScore
  );
  return (
    <div ref={targetScroll}>
      {animeListSeasonState.isFetching && (
        <CircularProgress
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 10,
          }}
          color="secondary"
          size="5rem"
        />
      )}
      <div
        style={{
          marginTop: "10px",
          textAlign: "center",
        }}
      >
        <select
          className="select-filter"
          defaultValue={`${animeListSeasonState.season}`}
          ref={selectSeason}
          // disabled={animeListSeasonState.isFetching}
        >
          <option value="winter">winter</option>
          <option value="spring">spring</option>
          <option value="summer">summer</option>
          <option value="fall">fall</option>
        </select>
        <select
          // disabled={animeListSeasonState.isFetching}
          className="select-filter"
          defaultValue={`${animeListSeasonState.year}`}
          ref={selectYear}
        >
          {elementOptions.map((v, index) => {
            return (
              <option key={index} value={`${v}`}>
                {v}
              </option>
            );
          })}
        </select>
        <select
          className="select-filter"
          defaultValue={`${animeListSeasonStream.currentState().score}`}
          ref={selectScore}
          // disabled={animeListSeasonState.isFetching}
        >
          {scoreOptions.map((score, key) => (
            <option key={key} value={`${score}`}>
              {score !== 0 ? score : "Score"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default AnimeListSeason;
