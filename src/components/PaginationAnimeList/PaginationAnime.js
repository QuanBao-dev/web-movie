import "./PaginationAnime.css";

import React, { useEffect, useState } from "react";
import { fromEvent } from "rxjs";

import loadable from "@loadable/component";
import { updatedAnimeStream } from "../../epics/updatedAnime";
const AnimeList = loadable(() => import("../AnimeList/AnimeList"), {
  fallback: (
    <div>
      <i className="fas fa-spinner fa-9x fa-spin"></i>
    </div>
  ),
});

const PaginationAnime = ({
  lastPage = 1,
  updatedMovie,
  currentPage = 1,
  subNavToggle,
  isEmpty = true,
}) => {
  const [maxPageDisplay, setMaxPageDisplay] = useState(
    lastPage < 7 ? lastPage : 7
  );
  useEffect(() => {
    checkWidth(setMaxPageDisplay, lastPage);
    const subscription = fromEvent(window, "resize").subscribe(() => {
      checkWidth(setMaxPageDisplay, lastPage);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [lastPage]);
  const pageList = narrowPageList(currentPage, lastPage, maxPageDisplay);
  return (
    <div>
      <AnimeList
        empty={isEmpty}
        lazy={true}
        data={updatedMovie}
        isAllowDelete={subNavToggle === 1 ? true : false}
      />
      {pageList.length > 1 && (
        <div className="home__page-list">
          {pageList.length > 0 && (
            <div
              className="home__page-item-search"
              onClick={() => {
                if (subNavToggle === 0) {
                  if (
                    updatedAnimeStream.currentState()
                      .currentPageUpdatedMovie !== 1
                  )
                    updatedAnimeStream.updateData({
                      updatedMovie: [],
                    });
                  updatedAnimeStream.updateData({
                    currentPageUpdatedMovie: 1,
                  });
                } else {
                  if (
                    updatedAnimeStream.currentState().currentPageBoxMovie !== 1
                  ) {
                    updatedAnimeStream.updateData({
                      boxMovie: [],
                    });
                  }
                  updatedAnimeStream.updateData({
                    currentPageBoxMovie: 1,
                  });
                }
                const subNavBar = document.querySelector(".sub-nav-bar");
                window.scroll({
                  top: subNavBar.offsetTop - 90,
                });
              }}
            >
              <i className="fas fa-chevron-left"></i>
              <i className="fas fa-chevron-left"></i>
            </div>
          )}
          {pageList &&
            pageList.map((pageData, index) => (
              <div
                key={index}
                className={`home__page-item-search${
                  pageData === currentPage ? " home__active-page-search" : ""
                }`}
                onClick={() => {
                  if (subNavToggle === 0) {
                    updateNewPageUpdatedAnime(pageData);
                  } else {
                    updateNewPageBoxMovie(pageData);
                  }
                  const subNavBar = document.querySelector(".sub-nav-bar");
                  window.scroll({
                    top: subNavBar.offsetTop - 90,
                  });
                }}
              >
                {pageData}
              </div>
            ))}
          <div
            className="home__page-item-search"
            onClick={() => {
              if (subNavToggle === 0) {
                if (
                  updatedAnimeStream.currentState().currentPageUpdatedMovie !==
                  lastPage
                )
                  updatedAnimeStream.updateData({
                    updatedMovie: [],
                  });
                updatedAnimeStream.updateData({
                  currentPageUpdatedMovie: lastPage,
                });
              } else {
                if (
                  updatedAnimeStream.currentState().currentPageBoxMovie !==
                  lastPage
                )
                  updatedAnimeStream.updateData({
                    boxMovie: [],
                  });
                updatedAnimeStream.updateData({
                  currentPageBoxMovie: lastPage,
                });
              }
              const subNavBar = document.querySelector(".sub-nav-bar");
              window.scroll({
                top: subNavBar.offsetTop - 90,
              });
            }}
          >
            <i className="fas fa-chevron-right"></i>
            <i className="fas fa-chevron-right"></i>
          </div>
          <select
            className="select-page"
            value={
              subNavToggle === 0
                ? updatedAnimeStream.currentState().currentPageUpdatedMovie
                : updatedAnimeStream.currentState().currentPageBoxMovie
            }
            onChange={(e) => {
              if (subNavToggle === 0) {
                updateNewPageUpdatedAnime(+e.target.value);
              } else {
                updateNewPageBoxMovie(+e.target.value);
              }
              const subNavBar = document.querySelector(".sub-nav-bar");
              window.scroll({
                top: subNavBar.offsetTop - 90,
              });
            }}
          >
            {Array.from(Array(lastPage).keys()).map((page, key) => (
              <option key={key}>{page + 1}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
export default PaginationAnime;

function updateNewPageBoxMovie(pageData) {
  if (updatedAnimeStream.currentState().currentPageBoxMovie !== pageData)
    updatedAnimeStream.updateData({
      boxMovie: [],
    });
  updatedAnimeStream.updateData({
    currentPageBoxMovie: pageData,
  });
}

function updateNewPageUpdatedAnime(pageData) {
  if (updatedAnimeStream.currentState().currentPageUpdatedMovie !== pageData)
    updatedAnimeStream.updateData({
      updatedMovie: [],
    });
  updatedAnimeStream.updateData({
    currentPageUpdatedMovie: pageData,
  });
}

function narrowPageList(page, lastPage, maxPageDisplay) {
  return Array.from(Array(maxPageDisplay).keys()).map((v) => {
    if (page <= Math.floor(maxPageDisplay / 2)) {
      return v + 1;
    }
    if (page >= lastPage - Math.floor(maxPageDisplay / 2)) {
      return lastPage - maxPageDisplay + (v + 1);
    }
    return page - Math.floor(maxPageDisplay / 2) + v;
  });
}

function checkWidth(setMaxPageDisplay, lastPage) {
  if (window.innerWidth < 360) {
    setMaxPageDisplay(lastPage < 3 ? lastPage : 3);
  } else if (window.innerWidth < 386) {
    setMaxPageDisplay(lastPage < 4 ? lastPage : 4);
  } else if (window.innerWidth < 430) {
    setMaxPageDisplay(lastPage < 5 ? lastPage : 5);
  } else if (window.innerWidth < 557) {
    setMaxPageDisplay(lastPage < 6 ? lastPage : 6);
  } else if (window.innerWidth > 557) {
    setMaxPageDisplay(lastPage < 7 ? lastPage : 7);
  }
}
