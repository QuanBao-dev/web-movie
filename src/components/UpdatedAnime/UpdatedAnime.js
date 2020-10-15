import loadable from "@loadable/component";
import orderBy  from "lodash/orderBy";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { fetchBoxMovie$, fetchUpdatedMovie$, stream } from "../../epics/home";
import { userStream } from "../../epics/user";

const AnimeList = loadable(() => import("../AnimeList/AnimeList"), {
  fallback: <div>Loading...</div>,
});
const numberOfMovieShown = 18;
const UpdatedAnime = () => {
  const [homeState, setHomeState] = useState(
    stream.currentState() || stream.initialState
  );
  const [subNavToggle, setSubNavToggle] = useState(0);
  const [cookies] = useCookies(["idCartoonUser"]);
  const [limitShowRecentlyUpdated, setLimitShowRecentlyUpdated] = useState(
    numberOfMovieShown
  );
  const user = userStream.currentState();
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    let subscription8, subscription9;
    if (subNavToggle === 0) {
      subscription8 = fetchUpdatedMovie$().subscribe((updatedMovie) => {
        // console.log("updated movie");
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
  return (
    <div>
      <SubNavBar
        subNavToggle={subNavToggle}
        setSubNavToggle={setSubNavToggle}
        user={user}
      />
      <AnimeList
        empty={true}
        lazy={true}
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
      <div id="button-see-more__home" onClick={() => showMoreAnime()}>
        <div>See more</div>
      </div>
    </div>
  );
  function showMoreAnime() {
    const temp = limitShowRecentlyUpdated;
    stream.allowScrollToSeeMore(false);
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
};

function SubNavBar({ subNavToggle, setSubNavToggle, user }) {
  return (
    <div className="sub-nav-bar">
      <h1
        className={`sub-nav-item${subNavToggle === 0 ? " sub-nav-active" : ""}`}
        onClick={() => setSubNavToggle(0)}
      >
        Updated Anime
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
          Box Anime
        </h1>
      )}
    </div>
  );
}

export default UpdatedAnime;
