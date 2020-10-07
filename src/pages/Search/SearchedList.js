import "./SearchedList.css";
import React, { Suspense, useEffect, useState } from "react";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry, switchMapTo, tap } from "rxjs/operators";
import { of, timer } from "rxjs";
import navBarStore from "../../store/navbar";
const AnimeList = React.lazy(() =>
  import("../../components/AnimeList/AnimeList")
);
const numberOfProductSearch = 7;
const SearchedList = (props) => {
  const key = props.location.search.replace("?key=", "");
  const [dataSearchedAnimeState, setDataSearchedAnimeState] = useState();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  useEffect(() => {
    const subscription = fetchDataApi$(key, 1).subscribe((data) => {
      setLastPage(data.last_page);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [key]);
  useEffect(() => {
    let subscription;
    subscription = fetchDataApi$(key, page).subscribe((data) => {
      setDataSearchedAnimeState(data.results);
    });
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [key, page]);
  let dataSearchDisplay;
  if (dataSearchedAnimeState) dataSearchDisplay = dataSearchedAnimeState;
  const pageList = narrowPageList(page, lastPage);
  return (
    <div className="container-search-anime">
      <h1 style={{ color: "white" }}>Results searched for "{key}"</h1>
      {dataSearchDisplay && (
        <Suspense fallback={<div>Loading...</div>}>
          <AnimeList data={dataSearchDisplay} error={null} />
        </Suspense>
      )}
      {dataSearchDisplay && dataSearchDisplay.length === 0 && (
        <h4 style={{ color: "white" }}>
          Not found any anime. Make sure your key search at least has 3
          characters
        </h4>
      )}
      <div className="page-list">
        <div
          className="page-item-search"
          onClick={() => {
            setPage(1);
          }}
        >
          <i className="fas fa-chevron-left"></i>
          <i className="fas fa-chevron-left"></i>
        </div>
        {pageList &&
          pageList.map((pageData, index) => (
            <div
              key={index}
              className={`page-item-search${
                pageData === page ? " active-page-search" : ""
              }`}
              onClick={() => {
                setPage(pageData);
              }}
            >
              {pageData}
            </div>
          ))}
        <div
          className="page-item-search"
          onClick={() => {
            setPage(lastPage);
          }}
        >
          <i className="fas fa-chevron-right"></i>
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
};

function narrowPageList(page, lastPage) {
  return Array.from(Array(numberOfProductSearch).keys()).map((v) => {
    if (page <= Math.floor(numberOfProductSearch / 2)) {
      return v + 1;
    }
    if (page >= lastPage - Math.floor(numberOfProductSearch / 2)) {
      return lastPage - numberOfProductSearch + (v + 1);
    }
    return page - Math.floor(numberOfProductSearch / 2) + v;
  });
}

function fetchDataApi$(text, page) {
  return timer(0).pipe(
    tap(() => navBarStore.updateIsShowBlockPopUp(true)),
    switchMapTo(
      ajax(
        "https://api.jikan.moe/v3/search/anime?q=" + text + "&page=" + page
      ).pipe(
        retry(20),
        tap(() => {
          navBarStore.updateIsShowBlockPopUp(false);
          window.scroll({
            top: 0,
          });
        }),
        pluck("response"),
        catchError(() => of({}))
      )
    )
  );
}

export default SearchedList;
