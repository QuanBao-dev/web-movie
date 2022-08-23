/* eslint-disable no-useless-escape */
import "./StorageAnimeList.css";

import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { iif, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  map,
  pluck,
  retry,
  switchMapTo,
  tap,
} from "rxjs/operators";

import storageAnimeStore from "../../store/storageAnime";
import AnimeList from "../AnimeList/AnimeList";
import { decode } from "url-encode-decode";
import cachesStore from "../../store/caches";
const StorageAnimeList = ({ query }) => {
  const [storageAnimeState, setStorageAnimeState] = useState(
    storageAnimeStore.currentState()
  );
  const history = useHistory();
  const pageStorageAnimeListRef = useRef();
  useEffect(() => {
    const subscription = storageAnimeStore.subscribe(setStorageAnimeState);
    return () => subscription.unsubscribe();
  }, []);
  // console.log(cachesStore.currentState())
  useEffect(() => {
    const searchBy = query.match(/anime|characters|people|manga/g)
      ? query.match(/anime|characters|people|manga/g)[0]
      : "anime";
    storageAnimeStore.updateData({
      q: query.match(/q=[a-zA-Z\%~!@_#$%^*(){}:"?><|/\\\`0-9]+&/g)
      ? decode(
          query
            .match(/q=[a-zA-Z\%~!@_#$%^*(){}:"?><|/\\\`0-9]+&/g)[0]
            .replace("q=", "")
            .replace(/(&)$/g, "")
        )
      : query.match(/q=.+/g)
      ? decode(
          query
            .match(/q=.+/g)[0]
            .replace("q=", "")
            .replace(/(&)$/g, "")
        )
      : "",
      searchBy: searchBy,
      page: query.match(/page=[0-9]+/g)
        ? parseInt(query.match(/page=[0-9]+/g)[0].replace("page=", ""))
        : 1,
      min_score: query.match(/min_score=[0-9]+/g)
        ? parseInt(
            query.match(/min_score=[0-9]+/g)[0].replace("min_score=", "")
          )
        : "",
      max_score: query.match(/max_score=[0-9]+/g)
        ? parseInt(
            query.match(/max_score=[0-9]+/g)[0].replace("max_score=", "")
          )
        : "",
      sfw: query.match(/sfw/g) ? query.match(/sfw/g)[0] : "",
      rating: query.match(/rating=[a-zA-Z0-9]+/g)
        ? query.match(/rating=[a-zA-Z0-9]+/g)[0].replace("rating=", "")
        : "",
      status: query.match(/status=[a-zA-Z]+/g)
        ? query.match(/status=[a-zA-Z]+/g)[0].replace("status=", "")
        : "",
      sort: query.match(/sort=[a-zA-Z]+/g)
        ? query.match(/sort=[a-zA-Z]+/g)[0].replace("sort=", "")
        : "desc",
      orderBy: query.match(/order_by=[a-zA-Z_]+/g)
        ? query.match(/order_by=[a-zA-Z_]+/g)[0].replace("order_by=", "")
        : "",
      type: query.match(/type=[a-zA-Z]+/g)
        ? query.match(/type=[a-zA-Z]+/g)[0].replace("type=", "")
        : "",
      genres: query.match(/genres=[0-9,]+/g)
        ? query.match(/genres=[0-9,]+/g)[0].replace("genres=", "")
        : "",
      genres_exclude: query.match(/genres_exclude=[0-9,]+/g)
        ? query
            .match(/genres_exclude=[0-9,]+/g)[0]
            .replace("genres_exclude=", "")
        : "",
      demographics: query.match(/genres=[0-9,]+/g)
        ? query.match(/genres=[0-9,]+/g)[0].replace("genres=", "")
        : "",
      explicit_genres: query.match(/genres=[0-9,]+/g)
        ? query.match(/genres=[0-9,]+/g)[0].replace("genres=", "")
        : "",
      themes: query.match(/genres=[0-9,]+/g)
        ? query.match(/genres=[0-9,]+/g)[0].replace("genres=", "")
        : "",
      producers:
        searchBy !== "manga"
          ? query.match(/producers=[0-9,]+/g)
            ? query.match(/producers=[0-9,]+/g)[0].replace("producers=", "")
            : ""
          : query.match(/magazines=[0-9,]+/g)
          ? query.match(/magazines=[0-9,]+/g)[0].replace("magazines=", "")
          : "",
      letter: query.match(/letter=[a-zA-Z\%~!@_#$%^*(){}:"?><|/\\\`0-9]+&/g)
        ? decode(
            query
              .match(/letter=[a-zA-Z\%~!@_#$%^*(){}:"?><|/\\\`0-9]+&/g)[0]
              .replace("letter=", "")
              .replace(/(&)$/g, "")
          )
        : query.match(/letter=.+/g)
        ? decode(
            query
              .match(/letter=.+/g)[0]
              .replace("letter=", "")
              .replace(/(&)$/g, "")
          )
        : "",
    });
    const subscription = iif(
      () =>
        cachesStore.currentState().genres &&
        cachesStore.currentState().genres[
          `https://api.jikan.moe/v4/${
            storageAnimeStore.currentState().searchBy
          }${query}`
        ],
      timer(0).pipe(
        map(
          () =>
            cachesStore.currentState().genres[
              `https://api.jikan.moe/v4/${
                storageAnimeStore.currentState().searchBy
              }${query}`
            ]
        )
      ),
      timer(0).pipe(
        filter(() => query !== storageAnimeStore.currentState().query),
        tap(() => {
          storageAnimeStore.updateData({
            isLoading: true,
          });
          window.scroll({ top: 0 });
        }),
        switchMapTo(
          ajax(
            `https://api.jikan.moe/v4/${
              storageAnimeStore.currentState().searchBy
            }${query}`
          ).pipe(
            pluck("response"),
            retry(10),
            catchError((error) => of({ error }))
          )
        )
      )
    ).subscribe((response) => {
      cachesStore.updateData({
        genres: {
          ...(cachesStore.currentState().genres || {}),
          [`https://api.jikan.moe/v4/${
            storageAnimeStore.currentState().searchBy
          }${query}`]: response,
        },
      });
      if (response.error) return;
      storageAnimeStore.updateData({
        dataAnime: response.data,
        query,
        isLoading: false,
        maxPage: response.pagination.last_visible_page,
      });
    });
    return () => {
      subscription.unsubscribe();
      if (window.location.href.includes("storage"))
        storageAnimeStore.updateData({
          query: null,
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, storageAnimeState.searchBy]);
  const { isLoading, maxPage } = storageAnimeState;
  return (
    <div className="storage-anime-list-container">
      <h2 className="filter-anime-title">Storage</h2>
      {!isLoading && maxPage > 1 && (
        <PageStorageAnimeList
          maxPage={maxPage}
          query={query}
          history={history}
          pageStorageAnimeListRef={pageStorageAnimeListRef}
        />
      )}
      {!isLoading && (
        <Link
          className="storage-anime-list-vertical-icon"
          to={`/storage/vertical${query}`}
        >
          Change view
        </Link>
      )}
      {isLoading && <CircularProgress color="secondary" size="4rem" />}
      {!isLoading && storageAnimeState.dataAnime.length > 0 && (
        <AnimeList
          data={storageAnimeState.dataAnime}
          searchBy={storageAnimeState.searchBy}
          lazy={true}
        />
      )}
      {!isLoading && storageAnimeState.dataAnime.length === 0 && (
        <h1>No results</h1>
      )}
      {!isLoading && maxPage > 1 && (
        <PageStorageAnimeList
          maxPage={maxPage}
          query={query}
          history={history}
        />
      )}
    </div>
  );
};

export default StorageAnimeList;
function PageStorageAnimeList({
  maxPage,
  query,
  history,
  pageStorageAnimeListRef,
}) {
  const page =
    query !== "" && query.match(/page=[0-9]+/g)
      ? parseInt(query.match(/page=[0-9]+/g)[0].replace("page=", ""))
      : 1;
  const amount = 5;
  let tempRight = 0;
  let tempLeft = 0;
  if (page - amount < 0) {
    tempRight += Math.abs(page - amount);
  }

  if (page + amount > maxPage) {
    tempLeft += Math.abs(page + amount - maxPage);
  }
  return (
    <ul className="storage-anime-page-list" ref={pageStorageAnimeListRef}>
      <Link
        className="storage-anime-page-item-container"
        to={`/storage${
          query !== ""
            ? query.replace(/page=[0-9]+/g, `page=${1}`)
            : `?page=${1}`
        }`}
      >
        <li className="storage-anime-page-item">
          <i className="fas fa-chevron-left"></i>
          <i className="fas fa-chevron-left"></i>
        </li>
      </Link>
      {Array.from(Array(maxPage).keys())
        .slice(
          page - amount > 0 ? page - amount - tempLeft : 0,
          page + amount < maxPage ? page + amount + tempRight : maxPage
        )
        .map((key) => (
          <Link
            key={key}
            className="storage-anime-page-item-container"
            to={`/storage${
              query !== ""
                ? query.replace(/page=[0-9]+/g, `page=${key + 1}`)
                : `?page=${key + 1}`
            }`}
          >
            <li
              className="storage-anime-page-item"
              style={{
                backgroundColor: key + 1 === page ? "red" : "",
              }}
            >
              {key + 1}
            </li>
          </Link>
        ))}
      <select
        defaultValue={
          query.match(/page=[0-9]+/g)
            ? query.match(/page=[0-9]+/g)[0].replace("page=", "")
            : null
        }
        className="storage-anime-select-page"
        onChange={(e) => {
          const page = e.target.value.replace(`/${maxPage}`, "");
          history.push(
            `/storage${
              query !== ""
                ? query.replace(/page=[0-9]+/g, `page=${page}`)
                : `?page=${page}`
            }`
          );
        }}
      >
        {Array.from(Array(maxPage).keys()).map((key) => (
          <option value={key + 1} key={key}>
            {key + 1}/{maxPage}
          </option>
        ))}
      </select>
      <Link
        className="storage-anime-page-item-container"
        to={`/storage${
          query !== ""
            ? query.replace(/page=[0-9]+/g, `page=${maxPage}`)
            : `?page=${maxPage}`
        }`}
      >
        <li className="storage-anime-page-item">
          <i className="fas fa-chevron-right"></i>
          <i className="fas fa-chevron-right"></i>
        </li>
      </Link>
    </ul>
  );
}
