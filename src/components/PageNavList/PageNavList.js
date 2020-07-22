import React from "react";
import "./PageNavList.css";

const PageNavList = ({ elementsLi, stream, todoState }) => {
  return (
    <ul className="page-nav-list">
      {elementsLi.map((page, index) => {
        return (
          <li
            key={index}
            onClick={(e) => {
              if (todoState.currentPage !== parseInt(e.target.innerHTML)) {
                stream.updateCurrentPage(parseInt(e.target.innerHTML));
              }
            }}
            className={`page-nav-item${
              todoState.currentPage === page ? " active-page" : ""
            }`}
          >
            {page}
          </li>
        );
      })}
    </ul>
  );
};

export default PageNavList;
