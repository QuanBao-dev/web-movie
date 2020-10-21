import orderBy from "lodash/orderBy";
import React, { useEffect, useRef, useState } from "react";

import {
  changeCurrentPage$,
  changeSeasonYear$,
  fetchAnimeSeason$,
  stream,
  limitAdultGenre,
  checkAnimeIncludeGenre,
} from "../../epics/home";
import { updateDataOnDestroy, updateMaxPage } from "../../store/home";
import AnimeList from "../AnimeList/AnimeList";
import PageNavList from "../PageNavList/PageNavList";
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
  { genreId: "33", genre: "Yaoi" },
  { genreId: "34", genre: "Yuri" },
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
  const [homeState, setHomeState] = useState(
    stream.currentState() || stream.initialState
  );
  const selectYear = useRef(null);
  const selectSeason = useRef(null);
  const selectScore = useRef(null);
  const selectFilterMode = useRef(null);
  const selectGenre = useRef(null);
  const targetScroll = useRef(null);

  const startYear = 1963;
  const endYear = new Date(Date.now()).getFullYear() + 1;
  const numberOfYears = endYear - startYear + 1;
  let numberOfPagesDisplay;
  if (stream.currentState().screenWidth > 354) {
    numberOfPagesDisplay = homeState.maxPage < 4 ? homeState.maxPage : 4;
  } else if (stream.currentState().screenWidth > 305) {
    numberOfPagesDisplay = homeState.maxPage < 3 ? homeState.maxPage : 3;
  } else {
    numberOfPagesDisplay = homeState.maxPage < 2 ? homeState.maxPage : 2;
  }
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    window.scroll({ top: 0 });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const filterAnime = homeState.dataDetailOriginal.filter((movie) => {
      if (homeState.modeFilter === "all") {
        return (
          movie.airing_start &&
          checkAnimeIncludeGenre(movie.genres, stream.currentState().genreId) &&
          (movie.score > homeState.score || homeState.score === 0)
        );
      }
      return (
        movie.airing_start &&
        limitAdultGenre(movie.genres) &&
        checkAnimeIncludeGenre(movie.genres, stream.currentState().genreId) &&
        (movie.score > homeState.score || homeState.score === 0)
      );
    });
    updateMaxPage(
      Math.ceil(filterAnime.length / stream.initialState.numberOfProduct)
    );
    if (
      Math.ceil(filterAnime.length / stream.initialState.numberOfProduct) <
      homeState.currentPage
    )
      stream.updateCurrentPage(1);
    const sortedArray = orderBy(filterAnime, ["airing_start"], ["desc"]).slice(
      (homeState.currentPage - 1) * homeState.numberOfProduct,
      homeState.currentPage * homeState.numberOfProduct
    );
    stream.updateAnimeData(sortedArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    homeState.currentPage,
    homeState.score,
    homeState.modeFilter,
    homeState.genreId,
  ]);

  useEffect(() => {
    if (homeState.shouldScrollToSeeMore) {
      stream.allowScrollToSeeMore(false);
      window.scroll({
        top: targetScroll.current.offsetTop - 170,
        behavior: "smooth",
      });
    }

    if (selectSeason.current && selectYear.current) {
      selectSeason.current.value = homeState.season;
      selectYear.current.value = homeState.year;
    }
    const input = document.querySelector(".wrapper-search-anime-list input");
    if (input && input.value.trim() === "") input.value = homeState.textSearch;

    const subscription3 = changeCurrentPage$().subscribe();
    let subscription4;
    if (
      selectYear.current &&
      selectSeason.current &&
      selectScore.current &&
      selectFilterMode.current &&
      selectGenre.current
    )
      subscription4 = changeSeasonYear$(
        selectYear.current,
        selectSeason.current,
        selectScore.current,
        selectFilterMode.current,
        selectGenre.current
      ).subscribe(([year, season, score, modeFilter, genreId]) => {
        stream.updateSeasonYear(season, year, score, modeFilter, genreId);
      });

    return () => {
      subscription4 && subscription4.unsubscribe();
      unsubscribeSubscription(subscription3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeState.shouldScrollToSeeMore, homeState.screenWidth]);
  // console.log(homeState);

  useEffect(() => {
    let subscription2;
    if (
      homeState.currentPage !== homeState.currentPageOnDestroy ||
      homeState.season !== homeState.currentSeasonOnDestroy ||
      homeState.year !== homeState.currentYearOnDestroy
    )
      subscription2 = fetchAnimeSeason$(
        homeState.year,
        homeState.season,
        1,
        homeState.numberOfProduct,
        homeState.score
      ).subscribe((v) => {
        stream.updateAnimeData(v);
      });
    return () => {
      subscription2 && subscription2.unsubscribe();
      updateDataOnDestroy(
        stream.currentState().currentPage,
        homeState.season,
        homeState.year
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeState.year, homeState.season, homeState.numberOfProduct]);
  return (
    <div>
      <SelectFilterAnime
        targetScroll={targetScroll}
        homeState={homeState}
        selectSeason={selectSeason}
        selectYear={selectYear}
        selectScore={selectScore}
        selectFilterMode={selectFilterMode}
        selectGenre={selectGenre}
        numberOfYears={numberOfYears}
      />

      <PageNavList
        numberOfPagesDisplay={numberOfPagesDisplay}
        stream={stream}
        homeState={homeState}
      />
      {homeState.dataDetail.length === 0 && (
        <h1 style={{ textAlign: "center" }}>Not updated yet...</h1>
      )}
      <AnimeList
        lazy={
          homeState.currentPage !== homeState.currentPageOnDestroy ||
          homeState.season !== homeState.currentSeasonOnDestroy ||
          homeState.year !== homeState.currentYearOnDestroy
        }
        data={homeState.dataDetail}
        error={homeState.error || null}
        empty={false}
      />
      <PageNavList
        numberOfPagesDisplay={numberOfPagesDisplay}
        stream={stream}
        homeState={homeState}
      />
    </div>
  );
};

function SelectFilterAnime({
  targetScroll,
  homeState,
  selectSeason,
  selectYear,
  selectScore,
  selectFilterMode,
  selectGenre,
  numberOfYears,
}) {
  const elementOptions = Array.from(Array(numberOfYears).keys()).map(
    (v) => new Date(Date.now()).getFullYear() + 1 - v
  );
  const scoreOptions = Array.from(Array(10).keys());
  return (
    <div
      style={{
        marginTop: "10px",
        textAlign: "center",
      }}
      ref={targetScroll}
    >
      <select
        className="select-filter"
        defaultValue={`${homeState.season}`}
        ref={selectSeason}
      >
        <option value="winter">winter</option>
        <option value="spring">spring</option>
        <option value="summer">summer</option>
        <option value="fall">fall</option>
      </select>
      <select
        className="select-filter"
        defaultValue={`${homeState.year}`}
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
        defaultValue={`${stream.currentState().score}`}
        ref={selectScore}
      >
        {scoreOptions.map((score, key) => (
          <option key={key} value={`${score}`}>
            {score !== 0 ? score : "All"}
          </option>
        ))}
      </select>
      <select
        className="select-filter"
        defaultValue={stream.currentState().modeFilter}
        ref={selectFilterMode}
      >
        <option value={`all`}>All</option>
        <option value={`filter`}>Filter</option>
      </select>
      <select
        className="select-filter"
        ref={selectGenre}
        defaultValue={stream.currentState().genreId}
      >
        <option value={0}>All</option>
        {genresData.map((data) => (
          <option key={data.genreId} value={data.genreId}>
            {data.genre}
          </option>
        ))}
      </select>
    </div>
  );
}

function unsubscribeSubscription(...subscriptions) {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe();
  });
}

export default AnimeListSeason;
