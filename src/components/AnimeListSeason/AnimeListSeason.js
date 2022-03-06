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
import CircularProgress from "@material-ui/core/CircularProgress";

const genresData = [
  { genreId: "1", genre: "Action" },
  { genreId: "2", genre: "Adventure" },
  { genreId: "3", genre: "Cars" },
  { genreId: "4", genre: "Comedy" },
  { genreId: "5", genre: "Dementia" },
  { genreId: "6", genre: "Demons" },
  { genreId: "7", genre: "Mystery" },
  { genreId: "8", genre: "Drama" },
  { genreId: "9", genre: "Ecchi" },
  { genreId: "10", genre: "Fantasy" },
  { genreId: "11", genre: "Game" },
  { genreId: "12", genre: "Hentai" },
  { genreId: "13", genre: "Historical" },
  { genreId: "14", genre: "Horror" },
  { genreId: "15", genre: "Kids" },
  { genreId: "16", genre: "Magic" },
  { genreId: "17", genre: "Martial Arts" },
  { genreId: "18", genre: "Mecha" },
  { genreId: "19", genre: "Music" },
  { genreId: "20", genre: "Parody" },
  { genreId: "21", genre: "Samurai" },
  { genreId: "22", genre: "Romance" },
  { genreId: "23", genre: "School" },
  { genreId: "24", genre: "Sci Fi" },
  { genreId: "25", genre: "Shoujo" },
  { genreId: "26", genre: "Shoujo Ai" },
  { genreId: "27", genre: "Shounen" },
  { genreId: "28", genre: "Shounen Ai" },
  { genreId: "29", genre: "Space" },
  { genreId: "30", genre: "Sports" },
  { genreId: "31", genre: "Super Power" },
  { genreId: "32", genre: "Vampire" },
  { genreId: "35", genre: "Harem" },
  { genreId: "36", genre: "Slice Of Life" },
  { genreId: "37", genre: "Supernatural" },
  { genreId: "38", genre: "Military" },
  { genreId: "39", genre: "Police" },
  { genreId: "40", genre: "Psychological" },
  { genreId: "41", genre: "Thriller" },
  { genreId: "42", genre: "Seinen" },
  { genreId: "43", genre: "Josei" },
];

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
        behavior: animeListSeasonStream.currentState().isSmoothScroll
          ? "smooth"
          : "auto",
      });
      animeListSeasonStream.updateDataQuick({
        isSmoothScroll: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeListSeasonState.triggerScroll]);
  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ textAlign: "center" }}>
        {animeListSeasonState.genreId !== "0"
          ? genresData[parseInt(animeListSeasonState.genreId) - 1].genre + " "
          : ""}
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
        data={animeListSeasonState.dataDetail}
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
  const selectGenre = useRef(null);
  const elementOptions = Array.from(Array(numberOfYears).keys()).map(
    (v) => new Date(Date.now()).getFullYear() + 1 - v
  );
  const scoreOptions = Array.from(Array(10).keys());
  useListenWhenOptionChange(
    animeListSeasonState,
    selectSeason,
    selectYear,
    selectScore,
    selectGenre
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
        <select
          className="select-filter"
          ref={selectGenre}
          defaultValue={animeListSeasonStream.currentState().genreId}
          // disabled={animeListSeasonState.isFetching}
        >
          <option value={0}>Genre</option>
          {genresData.map((data) => {
            if (data.genreId !== "12") {
              return (
                <option key={data.genreId} value={data.genreId}>
                  {data.genre}
                </option>
              );
            }
            if (animeListSeasonStream.currentState().modeFilter === "all") {
              return (
                <option key={data.genreId} value={data.genreId}>
                  {data.genre}
                </option>
              );
            }
            return undefined;
          })}
        </select>
      </div>
    </div>
  );
}

export default AnimeListSeason;
