import './PageNavList.css';

import React from 'react';

const PageNavList = ({ numberOfPagesDisplay, stream, homeState }) => {
  homeState.currentPage === 0 && (homeState.currentPage = 1);
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
    elementsLi.length !== 0 && (
      <ul className="page-nav-list">
        <li
          className={`page-nav-item`}
          onClick={() => {
            stream.allowScrollToSeeMore(true);
            stream.updateCurrentPage(1);
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
                if (homeState.currentPage !== parseInt(e.target.innerHTML)) {
                  stream.allowScrollToSeeMore(true);
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
            stream.allowScrollToSeeMore(true);
            stream.updateCurrentPage(homeState.maxPage);
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
