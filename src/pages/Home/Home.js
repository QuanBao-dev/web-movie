import "./Home.css";

import { capitalize, orderBy } from "lodash";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

import Input from "../../components/Input/Input";
import PageNavList from "../../components/PageNavList/PageNavList";
import {
  changeCurrentPage$,
  changeSearchInput$,
  changeSeasonYear$,
  fetchAnimeSeason$,
  listenSearchInputPressEnter$,
  stream,
} from "../../epics/home";
import {
  allowScrollToSeeMore,
  updateDataOnDestroy,
  updateMaxPage,
} from "../../store/home";
const UpdatedAnime = React.lazy(() =>
  import("../../components/UpdatedAnime/UpdatedAnime")
);

const AnimeSchedule = React.lazy(() =>
  import("../../components/AnimeSchedule/AnimeSchedule")
);

const Genres = React.lazy(() => import("../../components/Genres/Genres"));

const SearchedAnimeList = React.lazy(() =>
  import("../../components/SearchedAnimeList/SearchedAnimeList")
);
const AnimeList = React.lazy(() =>
  import("../../components/AnimeList/AnimeList")
);
const UpcomingAnimeList = React.lazy(() =>
  import("../../components/UpcomingAnimeList/UpcomingAnimeList")
);

const TopAnimeList = React.lazy(() =>
  import("../../components/TopAnimeList/TopAnimeList")
);

const Carousel = React.lazy(() => import("../../components/Carousel/Carousel"));

window.addEventListener("resize", () => {
  stream.init();
});
function Home() {
  const [homeState, setHomeState] = useState(
    stream.currentState() ? stream.currentState() : stream.initialState
  );
  const history = useHistory();
  const [cookies] = useCookies(["idCartoonUser"]);
  const searchInput = useRef(null);
  const selectYear = useRef(null);
  const selectSeason = useRef(null);
  const selectScore = useRef(null);
  const targetScroll = useRef(null);
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
  useEffect(() => {
    const filterAnime = homeState.dataDetailOriginal.filter((movie) => {
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
  }, [homeState.currentPage, homeState.score]);
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    stream.init();

    if (homeState.shouldScrollToSeeMore) {
      allowScrollToSeeMore(false);
      window.scroll({
        top: targetScroll.current.offsetTop - 170,
        behavior: "smooth",
      });
    }

    if (selectSeason.current && selectYear.current) {
      selectSeason.current.value = homeState.season;
      selectYear.current.value = homeState.year;
    }
    if (
      document
        .querySelector(".wrapper-search-anime-list input")
        .value.trim() === ""
    )
      document.querySelector(".wrapper-search-anime-list input").value =
        homeState.textSearch;

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

    const subscription6 = changeSearchInput$(searchInput.current).subscribe();

    const subscription10 = listenSearchInputPressEnter$(
      searchInput.current
    ).subscribe((v) => {
      history.push("/anime/search?key=" + v);
    });
    return () => {
      subscription4 && subscription4.unsubscribe();
      unsubscribeSubscription(
        subscription,
        subscription3,
        subscription6,
        subscription10
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cookies.idCartoonUser,
    homeState.shouldScrollToSeeMore,
    homeState.textSearch,
    homeState.screenWidth,
  ]);
  middleWare(homeState);
  const startYear = 1963;
  const endYear = new Date(Date.now()).getFullYear();
  const numberOfYears = endYear - startYear + 1;
  let numberOfPagesDisplay;
  if (stream.currentState().screenWidth > 354) {
    numberOfPagesDisplay = homeState.maxPage < 4 ? homeState.maxPage : 4;
  } else if (stream.currentState().screenWidth > 305) {
    numberOfPagesDisplay = homeState.maxPage < 3 ? homeState.maxPage : 3;
  } else {
    numberOfPagesDisplay = homeState.maxPage < 2 ? homeState.maxPage : 2;
  }
  // console.log(homeState);
  return (
    <div className="home-page">
      {stream.currentState().screenWidth &&
        stream.currentState().screenWidth >= 450 && (
          <Suspense fallback={<div>Loading...</div>}>
            <Carousel />
          </Suspense>
        )}
      <div className="recently-updated-movie">
        <div className="wrapper-search-anime-list">
          <div style={{ width: "90%" }}>
            <Input label="Search Anime" input={searchInput} />
          </div>
          <Suspense
            fallback={
              <div>
                <i className="fas fa-spinner fa-9x fa-spin"></i>
              </div>
            }
          >
            <SearchedAnimeList homeState={homeState} />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading....</div>}>
          <UpcomingAnimeList />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <UpdatedAnime />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Genres />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <AnimeSchedule />
      </Suspense>
      <div className="container-anime-list">
        <div className="container-display-anime__home">
          <div className="anime-pagination">
            <h1 style={{ textAlign: "center" }}>
              All Anime
              {homeState.score !== 0
                ? " with score greater than " + homeState.score
                : ""}{" "}
              in {capitalize(homeState.season)}, {homeState.year}
            </h1>
            <SelectFilterAnime
              targetScroll={targetScroll}
              homeState={homeState}
              selectSeason={selectSeason}
              selectYear={selectYear}
              selectScore={selectScore}
              numberOfYears={numberOfYears}
            />
            <div style={{ width: "50%", textAlign: "center" }}>
              <PageNavList
                numberOfPagesDisplay={numberOfPagesDisplay}
                stream={stream}
                homeState={homeState}
              />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <AnimeList
                lazy={true}
                data={homeState.dataDetail}
                error={homeState.error || null}
              />
            </Suspense>
            <div style={{ width: "50%", textAlign: "center" }}>
              <PageNavList
                numberOfPagesDisplay={numberOfPagesDisplay}
                stream={stream}
                homeState={homeState}
              />
            </div>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <TopAnimeList homeState={homeState} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const middleWare = (homeState) => {
  if (homeState.currentPage > homeState.maxPage) {
    homeState.currentPage = homeState.maxPage;
  }
};

function limitAdultGenre(genres) {
  let check = true;
  genres.forEach((genre) => {
    if (genre.name === "Hentai") {
      check = false;
    }
  });
  return check;
}

function unsubscribeSubscription(...subscriptions) {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe();
  });
}

function SelectFilterAnime({
  targetScroll,
  homeState,
  selectSeason,
  selectYear,
  selectScore,
  numberOfYears,
}) {
  const elementOptions = Array.from(Array(numberOfYears).keys()).map(
    (v) => new Date(Date.now()).getFullYear() - v
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
    </div>
  );
}

export default Home;
