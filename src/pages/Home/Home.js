import "./Home.css";

import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";

import { stream } from "../../epics/home";

const SearchInput = loadable(
  () =>
    new Promise((res, rej) =>
      setTimeout(
        () => res(import("../../components/SearchInput/SearchInput")),
        100
      )
    ),
  {
    fallback: (
      <div style={{ textAlign: "center" }}>
        <i className="fas fa-spinner fa-9x fa-spin"></i>
      </div>
    ),
  }
);

const AnimeListSeason = loadable(
  () =>
    new Promise((res, rej) =>
      setTimeout(
        () => res(import("../../components/AnimeListSeason/AnimeListSeason")),
        2000
      )
    ),
  {
    fallback: (
      <div style={{ textAlign: "center" }}>
        <i className="fas fa-spinner fa-9x fa-spin"></i>
      </div>
    ),
  }
);
const UpdatedAnime = loadable(
  () =>
    /* webpackPrefetch: true */ import(
      "../../components/UpdatedAnime/UpdatedAnime"
    ),
  {
    fallback: (
      <div style={{ textAlign: "center" }}>
        <i className="fas fa-spinner fa-9x fa-spin"></i>
      </div>
    ),
  }
);

const AnimeSchedule = loadable(
  () =>
    new Promise((res, rej) =>
      setTimeout(() => {
        res(
          /* webpackPrefetch: true */ import(
            "../../components/AnimeSchedule/AnimeSchedule"
          )
        );
      }, 1000)
    ),
  { fallback: <i className="fas fa-spinner fa-9x fa-spin"></i> }
);

const Genres = loadable(() => import("../../components/Genres/Genres"));

const SearchedAnimeList = loadable(() =>
  import("../../components/SearchedAnimeList/SearchedAnimeList")
);
const UpcomingAnimeList = loadable(
  () =>
    new Promise((res, rej) =>
      setTimeout(() => {
        res(
          /* webpackPrefetch: true */ import(
            "../../components/UpcomingAnimeList/UpcomingAnimeList"
          )
        );
      }, 500)
    ),
  {
    fallback: <i className="fas fa-spinner fa-9x fa-spin"></i>,
  }
);

const TopAnimeList = loadable(
  () => import("../../components/TopAnimeList/TopAnimeList"),
  {
    fallback: (
      <div>
        <i className="fas fa-spinner fa-4x fa-spin"></i>
      </div>
    ),
  }
);

const Carousel = loadable(
  () =>
    new Promise((res, rej) =>
      setTimeout(
        () =>
          res(
            /* webpackPrefetch: true */ import(
              "../../components/Carousel/Carousel"
            )
          ),
        0
      )
    ),
  {
    fallback: (
      <div
        style={{
          height: "650px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <i className="fas fa-spinner fa-9x fa-spin"></i>
      </div>
    ),
  }
);

window.addEventListener("resize", () => {
  stream.init();
});
function Home() {
  const [homeState, setHomeState] = useState(
    stream.currentState() ? stream.currentState() : stream.initialState
  );
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    stream.init();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // console.log(homeState);
  return (
    <div className="home-page">
      {stream.currentState().screenWidth &&
        stream.currentState().screenWidth >= 450 && <Carousel />}
      <div className="recently-updated-movie">
        <div className="wrapper-search-anime-list">
          <SearchInput />
          <SearchedAnimeList homeState={homeState} />
        </div>
        <UpcomingAnimeList />
        <UpdatedAnime />
      </div>
      <Genres />
      <AnimeSchedule />
      <div className="container-anime-list">
        <div className="container-display-anime__home">
          <div className="anime-pagination">
            <AnimeListSeason />
          </div>
          <TopAnimeList homeState={homeState} />
        </div>
      </div>
    </div>
  );
}

export default Home;
