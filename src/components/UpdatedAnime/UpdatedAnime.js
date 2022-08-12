import "./UpdatedAnime.css";

import loadable from "@loadable/component";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

import { updatedAnimeStream } from "../../epics/updatedAnime";
import { userStream } from "../../epics/user";
import {
  useFetchAnimeList,
  useInitUpdatedAnime,
} from "../../Hook/updatedAnime";

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
  const [updatedAnimeState, setUpdatedAnimeState] = useState(
    updatedAnimeStream.currentState()
  );
  const [isEmpty, setIsEmpty] = useState(true);
  const [subNavToggle, setSubNavToggle] = useState(
    updatedAnimeStream.currentState().subNavToggle || 0
  );
  const [cookies] = useCookies(["idCartoonUser"]);
  const user = userStream.currentState();
  useInitUpdatedAnime(setUpdatedAnimeState);
  useFetchAnimeList(updatedAnimeState, subNavToggle, setIsEmpty, cookies);
  return (
    <div
      style={{
        paddingBottom: "1.2rem",
        boxShadow: "0 0 3px 3px rgb(51, 57, 92)",
        backgroundColor: "#212541",
        marginBottom: "0.7rem",
      }}
    >
      <SubNavBar
        subNavToggle={subNavToggle}
        setSubNavToggle={setSubNavToggle}
        user={user}
      />
      <PaginationAnime
        updatedMovie={
          subNavToggle === 0
            ? updatedAnimeState.updatedMovie
            : updatedAnimeState.boxMovie
        }
        lastPage={
          subNavToggle === 0
            ? updatedAnimeState.lastPageUpdatedMovie
            : updatedAnimeState.lastPageBoxMovie
        }
        subNavToggle={subNavToggle}
        currentPage={
          subNavToggle === 0
            ? updatedAnimeStream.currentState().currentPageUpdatedMovie
            : updatedAnimeStream.currentState().currentPageBoxMovie
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
          updatedAnimeStream.updateDataQuick({ subNavToggle: 0 });
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
            updatedAnimeStream.updateDataQuick({ subNavToggle: 1 });
          }}
        >
          Box Anime
        </h1>
      )}
    </div>
  );
}

export default UpdatedAnime;
