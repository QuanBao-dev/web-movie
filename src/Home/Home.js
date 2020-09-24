import "./Home.css";

import { capitalize, orderBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";

import AnimeList from "../components/AnimeList/AnimeList";
import AnimeSchedule from "../components/AnimeSchedule/AnimeSchedule";
import Input from "../components/Input/Input";
import PageNavList from "../components/PageNavList/PageNavList";
import SearchedAnimeList from "../components/SearchedAnimeList/SearchedAnimeList";
import {
  changeCurrentPage$,
  changeSearchInput$,
  changeSeasonYear$,
  fetchAnimeSeason$,
  fetchBoxMovie$,
  fetchTopMovie$,
  fetchUpdatedMovie$,
  listenSearchInputPressEnter$,
  stream,
  topMovieUpdatedScrolling$,
} from "../epics/home";
import { userStream } from "../epics/user";
import {
  allowScrollToSeeMore,
  updateMaxPage,
  updatePageTopMovieOnDestroy,
} from "../store/home";
import UpcomingAnimeList from "../components/UpcomingAnimeList/UpcomingAnimeList";
import Genres from "../components/Genres/Genres";

const numberOfMovieShown = 18;
window.addEventListener("resize", () => {
  stream.init();
});
function Home() {
  const [homeState, setHomeState] = useState(
    stream.currentState() ? stream.currentState() : stream.initialState
  );
  const [limitShowRecentlyUpdated, setLimitShowRecentlyUpdated] = useState(
    numberOfMovieShown
  );
  const user = userStream.currentState();
  const history = useHistory();
  const [cookies] = useCookies(["idCartoonUser"]);
  const [subNavToggle, setSubNavToggle] = useState(0);
  const searchInput = useRef(null);
  const selectYear = useRef(null);
  const selectSeason = useRef(null);
  const selectScore = useRef(null);
  const targetScroll = useRef(null);
  useEffect(() => {
    let subscription8, subscription9;
    if (subNavToggle === 0) {
      subscription8 = fetchUpdatedMovie$().subscribe((updatedMovie) => {
        console.log("updated movie");
        stream.updateUpdatedMovie(updatedMovie);
      });
    }
    if (subNavToggle === 1) {
      subscription9 = fetchBoxMovie$(cookies.idCartoonUser).subscribe((v) => {
        stream.updateBoxMovie(v);
      });
    }
    return () => {
      subscription8 && subscription8.unsubscribe();
      subscription9 && subscription9.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subNavToggle]);

  useEffect(() => {
    const subscription2 = fetchAnimeSeason$(
      homeState.year,
      homeState.season,
      homeState.currentPage,
      homeState.numberOfProduct,
      homeState.score
    ).subscribe((v) => {
      stream.updateAnimeData(v);
    });
    return () => {
      subscription2.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeState.year, homeState.season]);
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
    const sortedArray = orderBy(filterAnime, ["airing_start"], ["desc"]).slice(
      (homeState.currentPage - 1) * homeState.numberOfProduct,
      homeState.currentPage * homeState.numberOfProduct
    );
    stream.updateAnimeData(sortedArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeState.currentPage, homeState.score]);
  useEffect(() => {
    const subscription = initUIBehavior();
    const subscription3 = changeCurrentPage$().subscribe();

    const subscription4 = changeSeasonYear$(
      selectYear.current,
      selectSeason.current,
      selectScore.current
    ).subscribe(([year, season, score]) => {
      stream.updateSeasonYear(season, year, score);
    });

    const subscription6 = changeSearchInput$(searchInput.current).subscribe();

    if (subNavToggle === 1 && !user) {
      setSubNavToggle(0);
    }

    const subscription10 = listenSearchInputPressEnter$(
      searchInput.current
    ).subscribe((v) => {
      history.push("/anime/search?key=" + v);
    });
    return () => {
      unsubscribeSubscription(
        subscription,
        subscription3,
        subscription4,
        subscription6,
        subscription10
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cookies.idCartoonUser,
    subNavToggle,
    homeState.shouldScrollToSeeMore,
    homeState.textSearch,
    homeState.screenWidth,
  ]);
  middleWare(homeState);
  const startYear = 1963;
  const endYear = new Date(Date.now()).getFullYear();
  const numberOfYears = endYear - startYear + 1;
  const numberOfPagesDisplay = homeState.maxPage < 4 ? homeState.maxPage : 4;
  const e = document.getElementById("button-see-more__home");
  if (e) {
    if (subNavToggle === 0) {
      if (limitShowRecentlyUpdated >= homeState.updatedMovie.length) {
        e.style.display = "none";
      } else {
        e.style.display = "flex";
      }
    } else {
      const e = document.getElementById("button-see-more__home");
      if (limitShowRecentlyUpdated >= homeState.boxMovie.length) {
        e.style.display = "none";
      } else {
        e.style.display = "flex";
      }
    }
  }
  // console.log(homeState);
  return (
    <div className="home-page">
      <div className="recently-updated-movie">
        <UpcomingAnimeList />
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
          id="button-see-more__home"
          onClick={() => showMoreAnime()}
        >
          <div>See more</div>
        </div>
      </div>
      <Genres />
      <AnimeSchedule />
      <div className="container-anime-list">
        <div className="wrapper-search-anime-list">
          <div style={{ width: "90%" }}>
            <Input label="Search Anime" input={searchInput} />
          </div>
          <SearchedAnimeList homeState={homeState} />
        </div>
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
            <AnimeList
              data={homeState.dataDetail}
              error={homeState.error || null}
            />
            <div style={{ width: "50%", textAlign: "center" }}>
              <PageNavList
                numberOfPagesDisplay={numberOfPagesDisplay}
                stream={stream}
                homeState={homeState}
              />
            </div>
          </div>
          <TopAnimeList homeState={homeState} />
        </div>
      </div>
    </div>
  );

  function initUIBehavior() {
    if (homeState.shouldScrollToSeeMore) {
      allowScrollToSeeMore(false);
      window.scroll({
        top: targetScroll.current.offsetTop - 170,
        behavior: "smooth",
      });
    }

    const subscription = stream.subscribe((v) => setHomeState(v));
    stream.init();
    selectSeason.current.value = homeState.season;
    selectYear.current.value = homeState.year;
    if (
      document.querySelector(".container-anime-list input").value.trim() === ""
    )
      document.querySelector(".container-anime-list input").value =
        homeState.textSearch;

    return subscription;
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

function limitAdultGenre(genres) {
  let check = true;
  genres.forEach((genre) => {
    if (genre.name === "Hentai") {
      check = false;
    }
  });
  return check;
}

function updateDataTopScrolling() {
  let page = stream.currentState().pageTopMovie;
  if (page < 5) {
    stream.updatePageTopMovie(page + 1);
  }
}

function unsubscribeSubscription(...subscriptions) {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe();
  });
}

function SubNavBar({ subNavToggle, setSubNavToggle, user }) {
  return (
    <div className="sub-nav-bar">
      <h1
        className={`sub-nav-item${subNavToggle === 0 ? " sub-nav-active" : ""}`}
        onClick={() => setSubNavToggle(0)}
      >
        Updated Movies
      </h1>
      {user && (
        <h1
          className={`sub-nav-item${
            subNavToggle === 1 ? " sub-nav-active" : ""
          }`}
          onClick={() => {
            setSubNavToggle(1);
          }}
        >
          Box Movies
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
        onChange={() => stream.updateCurrentPage(1)}
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
        onChange={() => stream.updateCurrentPage(1)}
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
        onChange={() => stream.updateCurrentPage(1)}
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

function TopAnimeList({ homeState }) {
  useEffect(() => {
    return () => {
      updatePageTopMovieOnDestroy(stream.currentState().pageTopMovie);
    };
  }, []);
  useEffect(() => {
    let subscription7; let subscription11;
    const topAnimeElement = document.querySelector(".top-anime-list-container");
    if (topAnimeElement) {
      subscription11 = topMovieUpdatedScrolling$(topAnimeElement).subscribe(
        () => {
          updateDataTopScrolling();
        }
      );
    }
    if (stream.currentState().pageTopMovieOnDestroy !== homeState.pageTopMovie)
      subscription7 = fetchTopMovie$(subscription11).subscribe((topMovieList) => {
        console.log("fetch top movie");
        stream.updateTopMovie(topMovieList);
      });
    return () => {
      subscription7 && subscription7.unsubscribe();
      subscription11 && subscription11.unsubscribe();
    };
  }, [homeState.pageTopMovie]);
  return (
    <div className="top-anime-list-container">
      <h1>Top Anime {new Date(Date.now()).getFullYear()}</h1>
      <ul className="top-anime-list">
        {homeState.dataTopMovie &&
          homeState.dataTopMovie.map((movie, index) => (
            <li key={index}>
              <h2>Rank {movie.rank}</h2>
              <div>
                <div className="top-anime-list-info">
                  <div className="top-movie-score__home">{movie.score}/10</div>
                  <Link to={"/anime/" + movie.mal_id}>
                    <img src={movie.image_url} alt="Preview" />
                  </Link>
                  <div className="title">{movie.title}</div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Home;
