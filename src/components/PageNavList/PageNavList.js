import "./PageNavList.css";

import React from "react";
import { animeListSeasonStream } from "../../epics/animeListSeason";

const PageNavList = ({ numberOfPagesDisplay, animeListSeasonState }) => {
  animeListSeasonState.currentPage === 0 &&
    (animeListSeasonState.currentPage = 1);
  const elementsLi = Array.from(Array(numberOfPagesDisplay).keys()).map((v) => {
    if (
      animeListSeasonState.currentPage <= Math.floor(numberOfPagesDisplay / 2)
    ) {
      return v + 1;
    }
    if (
      animeListSeasonState.currentPage >=
      animeListSeasonState.maxPage - Math.floor(numberOfPagesDisplay / 2)
    ) {
      return animeListSeasonState.maxPage - numberOfPagesDisplay + (v + 1);
    }
    return (
      animeListSeasonState.currentPage -
      Math.floor(numberOfPagesDisplay / 2) +
      v
    );
  });
  return (
    elementsLi.length > 1 && (
      <ul className="page-nav-list">
        <li
          className={`page-nav-item`}
          onClick={() => {
            animeListSeasonStream.updateData({
              currentPage: 1,
              triggerScroll:
                !animeListSeasonStream.currentState().triggerScroll,
              isSmoothScroll: true,
              isInit: false
            });
          }}
        >
          <i className="fas fa-chevron-left"></i>
          <i className="fas fa-chevron-left"></i>
        </li>

        {elementsLi.map((page, index) => {
          return (
            <li
              key={index}
              onClick={(e) => {
                if (
                  animeListSeasonState.currentPage !==
                  parseInt(e.target.innerHTML)
                ) {
                  animeListSeasonStream.updateData({
                    currentPage: +e.target.innerHTML,
                    triggerScroll:
                      !animeListSeasonStream.currentState().triggerScroll,
                    isSmoothScroll: true,
                    isInit: false
                  });
                }
              }}
              className={`page-nav-item${
                animeListSeasonState.currentPage === page ? " active-page" : ""
              }`}
            >
              {page}
            </li>
          );
        })}
        <li
          className={`page-nav-item`}
          onClick={() => {
            animeListSeasonStream.updateData({
              triggerScroll:
                !animeListSeasonStream.currentState().triggerScroll,
              isSmoothScroll: true,
              currentPage: animeListSeasonState.maxPage,
              isInit: false
            });
          }}
        >
          <i className="fas fa-chevron-right"></i>
          <i className="fas fa-chevron-right"></i>
        </li>
      </ul>
    )
  );
};

export default PageNavList;
