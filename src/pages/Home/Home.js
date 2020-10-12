import "./Home.css";

import { capitalize } from "lodash";
import React, { Suspense, useEffect, useState } from "react";

import { stream } from "../../epics/home";

const SearchInput = React.lazy(() =>
  import("../../components/SearchInput/SearchInput")
);

const AnimeListSeason = React.lazy(() =>
  import("../../components/AnimeListSeason/AnimeListSeason")
);
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
        stream.currentState().screenWidth >= 450 && (
          <Suspense fallback={<div>Loading...</div>}>
            <Carousel />
          </Suspense>
        )}
      <div className="recently-updated-movie">
        <div className="wrapper-search-anime-list">
          <Suspense
            fallback={
              <div>
                <i className="fas fa-spinner fa-9x fa-spin"></i>
              </div>
            }
          >
            <SearchInput />
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
            <Suspense fallback={<div>Loading...</div>}>
              <AnimeListSeason />
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <TopAnimeList homeState={homeState} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Home;
