import "./PaginationAnime.css";

import React, { useEffect, useState } from "react";
import { fromEvent } from "rxjs";

import { stream } from "../../epics/home";
import loadable from "@loadable/component";
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
      <AnimeList empty={true} lazy={true} data={updatedMovie} />
      <div className="home__page-list">
        <div
          className="home__page-item-search"
          onClick={() => {
            if (subNavToggle === 0) {
              if (stream.currentState().currentPageUpdatedMovie !== 1)
                stream.updateData({
                  updatedMovie: [],
                });
              stream.updateData({
                currentPageUpdatedMovie: 1,
              });
            } else {
              if (stream.currentState().currentPageBoxMovie !== 1) {
                stream.updateData({
                  boxMovie: [],
                });
              }
              stream.updateData({
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
        {pageList &&
          pageList.map((pageData, index) => (
            <div
              key={index}
              className={`home__page-item-search${
                pageData === currentPage ? " home__active-page-search" : ""
              }`}
              onClick={() => {
                if (subNavToggle === 0) {
                  if (
                    stream.currentState().currentPageUpdatedMovie !== pageData
                  )
                    stream.updateData({
                      updatedMovie: [],
                    });
                  stream.updateData({
                    currentPageUpdatedMovie: pageData,
                  });
                } else {
                  if (stream.currentState().currentPageBoxMovie !== pageData)
                    stream.updateData({
                      boxMovie: [],
                    });
                  stream.updateData({
                    currentPageBoxMovie: pageData,
                  });
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
              if (stream.currentState().currentPageUpdatedMovie !== lastPage)
                stream.updateData({
                  updatedMovie: [],
                });
              stream.updateData({
                currentPageUpdatedMovie: lastPage,
              });
            } else {
              if (stream.currentState().currentPageBoxMovie !== lastPage)
                stream.updateData({
                  boxMovie: [],
                });
              stream.updateData({
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
      </div>
    </div>
  );
};
export default PaginationAnime;

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
