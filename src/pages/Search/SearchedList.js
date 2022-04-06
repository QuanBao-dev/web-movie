import "./SearchedList.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry, switchMapTo, tap } from "rxjs/operators";
import { fromEvent, of, timer } from "rxjs";
import navBarStore from "../../store/navbar";
import searchedListStore from "../../store/searchedList";
import loadable from "@loadable/component";
const AnimeList = loadable(
  () => import("../../components/AnimeList/AnimeList"),
  {
    fallback: <CircularProgress color="primary" size="7rem" />,
  }
);

const SearchedList = (props) => {
  const key = props.location.search.replace("?key=", "");
  const [dataSearchedAnimeState, setDataSearchedAnimeState] = useState();
  const [maxPageDisplay, setMaxPageDisplay] = useState(7);
  const [searchedListState, setSearchedListState] = useState(
    searchedListStore.initialState
  );
  const [lastPage, setLastPage] = useState(1);
  useEffect(() => {
    const subscriptionInit = searchedListStore.subscribe(setSearchedListState);
    searchedListStore.init();
    checkWidth(setMaxPageDisplay);
    const subscription = fromEvent(window, "resize").subscribe((e) => {
      checkWidth(setMaxPageDisplay);
    });
    return () => {
      subscriptionInit.unsubscribe();
      subscription.unsubscribe();
      navBarStore.updateIsShowBlockPopUp(false);
    };
  }, []);
  useEffect(() => {
    if (searchedListStore.currentState().previousKey !== key) {
      searchedListStore.updatePage(1);
    }
  }, [key]);

  useEffect(() => {
    let subscription;
    subscription = fetchDataApi$(key, searchedListState.page).subscribe(
      ({ data, pagination }) => {
        searchedListStore.updatePreviousKey(key);
        if (pagination.last_visible_page < maxPageDisplay) {
          setMaxPageDisplay(pagination.last_visible_page);
        }
        setLastPage(pagination.last_visible_page);

        setDataSearchedAnimeState(data);
      }
    );
    return () => {
      subscription && subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, searchedListState.page]);
  let dataSearchDisplay;
  if (dataSearchedAnimeState) dataSearchDisplay = dataSearchedAnimeState;
  const pageList = narrowPageList(
    searchedListState.page,
    lastPage,
    maxPageDisplay
  );
  return (
    <div className="container-search-anime">
      <h1 style={{ color: "white" }}>Results searched for "{key}"</h1>
      {dataSearchDisplay && (
        <AnimeList
          lazy={true}
          data={dataSearchDisplay}
          error={null}
          searchBy={"anime"}
        />
      )}
      {dataSearchDisplay && dataSearchDisplay.length === 0 && (
        <h4 style={{ color: "white" }}>
          Not found any anime. Make sure your key search at least has 3
          characters
        </h4>
      )}
      {lastPage > 1 && (
        <div className="page-list">
          <div
            className="page-item-search"
            onClick={() => {
              searchedListStore.updatePage(1);
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
                  pageData === searchedListState.page
                    ? " active-page-search"
                    : ""
                }`}
                onClick={() => {
                  searchedListStore.updatePage(pageData);
                }}
              >
                {pageData}
              </div>
            ))}
          <div
            className="page-item-search"
            onClick={() => {
              searchedListStore.updatePage(lastPage);
            }}
          >
            <i className="fas fa-chevron-right"></i>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      )}
    </div>
  );
};

function checkWidth(setMaxPageDisplay) {
  if (window.innerWidth < 360) {
    setMaxPageDisplay(3);
  } else if (window.innerWidth < 386) {
    setMaxPageDisplay(4);
  } else if (window.innerWidth < 430) {
    setMaxPageDisplay(5);
  } else if (window.innerWidth < 557) {
    setMaxPageDisplay(6);
  }
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

function fetchDataApi$(text, page) {
  return timer(0).pipe(
    tap(() => navBarStore.updateIsShowBlockPopUp(true)),
    switchMapTo(
      ajax("https://api.jikan.moe/v4/anime?q=" + text + "&page=" + page).pipe(
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
