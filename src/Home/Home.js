import "./Home.css";

import { orderBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import AnimeList from "../components/AnimeList/AnimeList";
import AnimeSchedule from "../components/AnimeSchedule/AnimeSchedule";
import Input from "../components/Input/Input";
import PageNavList from "../components/PageNavList/PageNavList";
import SearchedAnimeList from "../components/SearchedAnimeList/SearchedAnimeList";
import {
  changeCurrentPage$,
  changeSearchInput$,
  changeSeason$,
  changeYear$,
  fetchAnimeSeason$,
  fetchBoxMovie$,
  fetchTopMovie$,
  fetchUpdatedMovie$,
  stream,
} from "../epics/home";
import { userStream } from "../epics/user";
import {
  allowBoxMovie,
  allowScrollToSeeMore,
  allowUpdatedMovie,
} from "../store/home";

let shouldFetchTopMovie = true;
const numberOfMovieShown = 4;
function Home() {
  const [homeState, setHomeState] = useState(stream.initialState);
  const [limitShowRecentlyUpdated, setLimitShowRecentlyUpdated] = useState(
    numberOfMovieShown
  );
  const user = userStream.currentState();
  const [cookies] = useCookies(["idCartoonUser"]);
  const [subNavToggle, setSubNavToggle] = useState(0);
  const searchInput = useRef(null);
  const selectYear = useRef(null);
  const selectSeason = useRef(null);
  const targetScroll = useRef(null);
  useEffect(() => {
    const subscription = initUIBehavior();
    const subscription2 = fetchAnimeSeason$(
      homeState.year,
      homeState.season,
      homeState.currentPage,
      homeState.numberOfProduct
    ).subscribe();
    const subscription3 = changeCurrentPage$().subscribe();
    const subscription4 = changeYear$(selectYear.current).subscribe();
    const subscription5 = changeSeason$(selectSeason.current).subscribe();
    const subscription6 = changeSearchInput$(searchInput.current).subscribe();
    let subscription7;
    if (shouldFetchTopMovie === true) {
      subscription7 = fetchTopMovie$().subscribe(
        () => (shouldFetchTopMovie = false)
      );
    }

    let subscription8;
    if (
      subNavToggle === 0 &&
      homeState.shouldFetchLatestUpdatedMovie === true
    ) {
      subscription8 = fetchUpdatedMovie$().subscribe(() => {
        allowUpdatedMovie(false);
      });
    }
    let subscription9;
    if (subNavToggle === 1 && homeState.shouldFetchBoxMovie === true) {
      subscription9 = fetchBoxMovie$(cookies.idCartoonUser).subscribe(() => {
        allowBoxMovie(false);
      });
    }

    if (subNavToggle === 1 && !user) {
      setSubNavToggle(0);
    }
    return () => {
      subscription7 && subscription7.unsubscribe();
      subscription8 && subscription8.unsubscribe()
      subscription9 && subscription9.unsubscribe()
      unsubscribeSubscription(
        subscription,
        subscription2,
        subscription3,
        subscription4,
        subscription5,
        subscription6
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cookies.idCartoonUser,
    subNavToggle,
    homeState.currentPage,
    homeState.numberOfProduct,
    homeState.season,
    homeState.shouldFetchBoxMovie,
    homeState.shouldFetchLatestUpdatedMovie,
    homeState.shouldScrollToSeeMore,
    homeState.textSearch,
    homeState.year,
    user,
  ]);
  middleWare(homeState);
  const { elementOptions, elementsLi } = pipeData();
  // console.log(homeState);
  return (
    <div className="home-page">
      <div className="recently-updated-movie">
        <SubNavBar
          subNavToggle={subNavToggle}
          setSubNavToggle={setSubNavToggle}
          user={user}
        />
        <AnimeList
          data={
            subNavToggle === 0
              ? orderBy(homeState.updatedMovie, ["updatedAt"], ["desc"]).slice(
                  0,
                  limitShowRecentlyUpdated > homeState.updatedMovie.length
                    ? homeState.updatedMovie.length
                    : limitShowRecentlyUpdated
                )
              : subNavToggle === 1 && user
              ? orderBy(homeState.boxMovie, ["dateAdded"], ["desc"]).slice(
                  0,
                  limitShowRecentlyUpdated > homeState.boxMovie.length
                    ? homeState.boxMovie.length
                    : limitShowRecentlyUpdated
                )
              : []
          }
          error={homeState.error || null}
        />
        <div
          style={{
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
            cursor: "pointer",
          }}
          onClick={() => showMoreAnime()}
        >
          <div>See more</div>
        </div>
      </div>
      <SelectFilterAnime
        targetScroll={targetScroll}
        homeState={homeState}
        selectSeason={selectSeason}
        selectYear={selectYear}
        elementOptions={elementOptions}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#242847",
          paddingBottom: "1rem",
          boxShadow: "0 20px 10px 10px #242847",
        }}
      >
        <div style={{ width: "300px" }}>
          <Input label="Search" input={searchInput} />
        </div>
      </div>
      <SearchedAnimeList homeState={homeState} />
      <div className="container-anime-list">
        <UpcomingAnimeList homeState={homeState} />
        <div className="anime-pagination">
          <AnimeList
            data={homeState.dataDetail}
            error={homeState.error || null}
          />
          <div style={{ margin: "auto", width: "50%", textAlign: "center" }}>
            <PageNavList
              elementsLi={elementsLi}
              stream={stream}
              homeState={homeState}
            />
          </div>
        </div>
      </div>
      <AnimeSchedule />
    </div>
  );

  function initUIBehavior() {
    if (homeState.shouldScrollToSeeMore) {
      allowScrollToSeeMore(false);
      // eslint-disable-next-line no-restricted-globals
      scroll({
        top: targetScroll.current.offsetTop - 90,
        behavior: "smooth",
      });
    }

    const subscription = stream.subscribe((v) => setHomeState(v));
    stream.init();
    selectSeason.current.value = homeState.season;
    selectYear.current.value = homeState.year;
    if (searchInput.current) {
      searchInput.current.value = homeState.textSearch;
    }
    return subscription;
  }

  function pipeData() {
    const startYear = 2000;
    const endYear = new Date(Date.now()).getFullYear();
    const numberOfYears = endYear - startYear + 1;
    const numberOfPagesDisplay = homeState.maxPage < 5 ? homeState.maxPage : 5;
    const elementOptions = Array.from(Array(numberOfYears).keys()).map(
      (v) => new Date(Date.now()).getFullYear() - v
    );
    const elementsLi = Array.from(Array(numberOfPagesDisplay).keys()).map(
      (v) => {
        if (homeState.currentPage <= Math.floor(numberOfPagesDisplay / 2)) {
          return v + 1;
        }
        if (
          homeState.currentPage >=
          homeState.maxPage - Math.floor(numberOfPagesDisplay / 2)
        ) {
          return homeState.maxPage - numberOfPagesDisplay + (v + 1);
        }
        return homeState.currentPage - Math.floor(numberOfPagesDisplay / 2) + v;
      }
    );
    return { elementOptions, elementsLi };
  }

  function showMoreAnime() {
    const temp = limitShowRecentlyUpdated;
    allowScrollToSeeMore(false);
    if (subNavToggle === 0) {
      if (temp + numberOfMovieShown <= homeState.updatedMovie.length) {
        setLimitShowRecentlyUpdated(temp + numberOfMovieShown);
      } else {
        setLimitShowRecentlyUpdated(homeState.updatedMovie.length);
      }
    } else if (subNavToggle === 1) {
      if (temp + numberOfMovieShown <= homeState.boxMovie.length) {
        setLimitShowRecentlyUpdated(temp + numberOfMovieShown);
      } else {
        setLimitShowRecentlyUpdated(homeState.boxMovie.length);
      }
    }
  }
}

const middleWare = (homeState) => {
  if (homeState.currentPage > homeState.maxPage) {
    homeState.currentPage = homeState.maxPage;
  }
};

function unsubscribeSubscription(...subscriptions) {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe();
  });
}


function SubNavBar({ subNavToggle, setSubNavToggle, user }) {
  return (
    <div className="sub-nav-bar" style={{ display: "flex" }}>
      <h1
        className={`sub-nav-item${subNavToggle === 0 ? " sub-nav-active" : ""}`}
        onClick={() => setSubNavToggle(0)}
      >
        Recently Updated
      </h1>
      {user && (
        <h1
          className={`sub-nav-item${
            subNavToggle === 1 ? " sub-nav-active" : ""
          }`}
          onClick={() => {
            allowBoxMovie(true);
            setSubNavToggle(1);
          }}
        >
          Box Movie
        </h1>
      )}
    </div>
  );
}

function SelectFilterAnime({
  targetScroll,
  homeState,
  selectSeason,
  selectYear,
  elementOptions,
}) {
  return (
    <div
      style={{
        marginTop: "10px",
        textAlign: "center",
        backgroundColor: "#242847",
      }}
      ref={targetScroll}
    >
      <select
        style={{
          margin: "10px",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: "black",
          color: "white",
          fontSize: "150%",
          boxShadow: "2px 2px 5px 2px black",
        }}
        defaultValue={`${homeState.season}`}
        ref={selectSeason}
      >
        <option value="winter">winter</option>
        <option value="spring">spring</option>
        <option value="summer">summer</option>
        <option value="fall">fall</option>
      </select>
      <select
        style={{
          margin: "10px",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: "black",
          color: "white",
          fontSize: "150%",
          boxShadow: "2px 2px 5px 2px black",
        }}
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
    </div>
  );
}

function UpcomingAnimeList({ homeState }) {
  return (
    <div className="upcoming-anime-list-container">
      <h2>Top Anime</h2>
      <ul className="upcoming-anime-list">
        {homeState.dataTopMovie &&
          homeState.dataTopMovie.map((movie, index) => (
            <div key={index}>
              <h2>Rank {movie.rank}</h2>
              <li>
                <div className="upcoming-anime-list-info">
                  <Link to={"/anime/" + movie.mal_id}>
                    <img src={movie.image_url} alt="Preview" />
                  </Link>
                  <div className="title">{movie.title}</div>
                </div>
              </li>
            </div>
          ))}
      </ul>
    </div>
  );
}

export default Home;
