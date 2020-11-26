import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { fetchBoxMovie$, fetchUpdatedMovie$, stream } from "../../epics/home";
import { userStream } from "../../epics/user";
const PaginationAnime = loadable(
  () => import("../PaginationAnimeList/PaginationAnime"),
  {
    fallback: (
      <div>
        <i className="fas fa-spinner fa-9x fa-spin"></i>
      </div>
    ),
  }
);

const UpdatedAnime = () => {
  const [homeState, setHomeState] = useState(
    stream.currentState() || stream.initialState
  );
  const [isEmpty, setIsEmpty] = useState(true);
  const [subNavToggle, setSubNavToggle] = useState(0);
  const [cookies] = useCookies(["idCartoonUser"]);
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
      setIsEmpty(true);
      subscription8 = fetchUpdatedMovie$().subscribe(({ data, lastPage }) => {
        stream.updateData({
          updatedMovie: data,
          lastPageUpdatedMovie: lastPage,
        });
        setIsEmpty(false);
      });
    }
    if (subNavToggle === 1) {
      setIsEmpty(true);
      subscription9 = fetchBoxMovie$(cookies.idCartoonUser).subscribe(
        ({ data, lastPage }) => {
          stream.updateData({
            boxMovie: data,
            lastPageBoxMovie: lastPage,
          });
          setIsEmpty(false);
        }
      );
    }
    return () => {
      subscription8 && subscription8.unsubscribe();
      subscription9 && subscription9.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    subNavToggle,
    homeState.currentPageBoxMovie,
    homeState.currentPageUpdatedMovie,
  ]);
  return (
    <div>
      <SubNavBar
        subNavToggle={subNavToggle}
        setSubNavToggle={setSubNavToggle}
        user={user}
      />
      <PaginationAnime
        updatedMovie={
          subNavToggle === 0 ? homeState.updatedMovie : homeState.boxMovie
        }
        lastPage={
          subNavToggle === 0
            ? homeState.lastPageUpdatedMovie
            : homeState.lastPageBoxMovie
        }
        subNavToggle={subNavToggle}
        currentPage={
          subNavToggle === 0
            ? stream.currentState().currentPageUpdatedMovie
            : stream.currentState().currentPageBoxMovie
        }
        isEmpty={isEmpty}
      />
    </div>
  );
};

function SubNavBar({ subNavToggle, setSubNavToggle, user }) {
  return (
    <div className="sub-nav-bar">
      <h1
        className={`sub-nav-item${subNavToggle === 0 ? " sub-nav-active" : ""}`}
        onClick={() => {
          setSubNavToggle(0);
        }}
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
