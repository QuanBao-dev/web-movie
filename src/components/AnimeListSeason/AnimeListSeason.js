import orderBy from "lodash/orderBy";
import React, { useEffect, useRef, useState } from "react";

import {
  changeCurrentPage$,
  changeSeasonYear$,
  fetchAnimeSeason$,
  stream,
} from "../../epics/home";
import { updateDataOnDestroy, updateMaxPage } from "../../store/home";
import AnimeList from "../AnimeList/AnimeList";
import PageNavList from "../PageNavList/PageNavList";

const AnimeListSeason = () => {
  const [homeState, setHomeState] = useState(
    stream.currentState() || stream.initialState
  );
  const selectYear = useRef(null);
  const selectSeason = useRef(null);
  const selectScore = useRef(null);
  const selectFilterMode = useRef(null);
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
          (movie.score > homeState.score || homeState.score === 0)
        );
      }
      return (
        movie.airing_start &&
        limitAdultGenre(movie.genres) &&
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
  }, [homeState.currentPage, homeState.score, homeState.modeFilter]);

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
    if (selectYear.current && selectSeason.current && selectScore.current)
      subscription4 = changeSeasonYear$(
        selectYear.current,
        selectSeason.current,
        selectScore.current
      ).subscribe(([year, season, score]) => {
        stream.updateSeasonYear(season, year, score);
      });

    return () => {
      subscription4 && subscription4.unsubscribe();
      unsubscribeSubscription(subscription3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeState.shouldScrollToSeeMore, homeState.screenWidth]);

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
        style={{}}
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
        ref={selectFilterMode}
        defaultValue={stream.currentState().modeFilter}
        onChange={(e) => {
          stream.updateModeFilter(e.target.value);
        }}
      >
        <option value={`all`}>All</option>
        <option value={`filter`}>Filter</option>
      </select>
    </div>
  );
}

function unsubscribeSubscription(...subscriptions) {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe();
  });
}

function limitAdultGenre(genres) {
  let check = true;
  genres.forEach((genre) => {
    if (genre.name === "Hentai") {
      check = false;
    }
  });
  return check;
}

export default AnimeListSeason;
