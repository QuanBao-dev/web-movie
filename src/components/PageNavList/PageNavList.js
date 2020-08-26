import "./PageNavList.css";

import React from "react";
import { allowScrollToSeeMore } from "../../store/home";

const PageNavList = ({ numberOfPagesDisplay, stream, homeState }) => {
  const elementsLi = Array.from(Array(numberOfPagesDisplay).keys()).map((v) => {
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
  });

  return (
    <ul className="page-nav-list">
      <li
        className={`page-nav-item`}
        onClick={() => {
          allowScrollToSeeMore(true);
          stream.updateCurrentPage(1);
        }}
      >
        Min
      </li>

      {elementsLi.map((page, index) => {
        return (
          <li
            key={index}
            onClick={(e) => {
              if (homeState.currentPage !== parseInt(e.target.innerHTML)) {
                allowScrollToSeeMore(true);
                stream.updateCurrentPage(parseInt(e.target.innerHTML));
              }
            }}
            className={`page-nav-item${
              homeState.currentPage === page ? " active-page" : ""
            }`}
          >
            {page}
          </li>
        );
      })}
      <li
        className={`page-nav-item`}
        onClick={() => {
          allowScrollToSeeMore(true);
          stream.updateCurrentPage(homeState.maxPage);
        }}
      >
        Max
      </li>
    </ul>
  );
};

export default PageNavList;
