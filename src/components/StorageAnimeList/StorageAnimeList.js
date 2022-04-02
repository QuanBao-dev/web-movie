/* eslint-disable no-useless-escape */
import "./StorageAnimeList.css";

import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  pluck,
  retry,
  switchMapTo,
  tap,
} from "rxjs/operators";

import storageAnimeStore from "../../store/storageAnime";
import AnimeList from "../AnimeList/AnimeList";

const StorageAnimeList = ({ query }) => {
  const [storageAnimeState, setStorageAnimeState] = useState(
    storageAnimeStore.currentState()
  );
  const history = useHistory();
  useEffect(() => {
    const subscription = storageAnimeStore.subscribe(setStorageAnimeState);
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    storageAnimeStore.updateData({
      q: query.match(/q=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g)
        ? query
            .match(/q=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g)[0]
            .replace("q=", "")
            .replace(/%20/g, " ")
        : "",
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
      rating: query.match(/rating=[a-zA-Z]+/g)
        ? query.match(/rating=[a-zA-Z]+/g)[0].replace("rating=", "")
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
      themes: query.match(/genres=[0-9,]+/g)
        ? query.match(/genres=[0-9,]+/g)[0].replace("genres=", "")
        : "",
      genres_exclude: query.match(/genres_exclude=[0-9,]+/g)
        ? query
            .match(/genres_exclude=[0-9,]+/g)[0]
            .replace("genres_exclude=", "")
        : "",
      producers: query.match(/producers=[0-9,]+/g)
        ? query.match(/producers=[0-9,]+/g)[0].replace("producers=", "")
        : "",
      letter: query.match(
        /letter=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g
      )
        ? query
            .match(/letter=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g)[0]
            .replace("letter=", "")
            .replace(/%20/g, " ")
        : "",
    });
    const subscription = timer(0)
      .pipe(
        filter(() => query !== storageAnimeStore.currentState().query),
        tap(() => {
          storageAnimeStore.updateData({
            isLoading: true,
          });
          window.scroll({ top: 0 });
        }),
        switchMapTo(
          ajax(`https://api.jikan.moe/v4/anime${query}`).pipe(
            pluck("response"),
            retry(10),
            catchError((error) => of({ error }))
          )
        )
      )
      .subscribe((response) => {
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
  }, [query]);
  const { isLoading, maxPage } = storageAnimeState;
  return (
    <div className="storage-anime-list-container">
      <h2 className="filter-anime-title">Storage</h2>
      {!isLoading && (
        <Link
          className="storage-anime-list-vertical-icon"
          to={`/storage/vertical${query.replace(/page=[0-9]+(&)?/g, ``)}`}
        >
          Change view
        </Link>
      )}
      {!isLoading && maxPage > 1 && (
        <PageStorageAnimeList
          maxPage={maxPage}
          query={query}
          history={history}
        />
      )}
      {isLoading && <CircularProgress color="secondary" size="4rem" />}
      {!isLoading && storageAnimeState.dataAnime.length > 0 && (
        <AnimeList data={storageAnimeState.dataAnime} />
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
function PageStorageAnimeList({ maxPage, query, history }) {
  const page =
    query !== ""
      ? parseInt(query.match(/page=[0-9]+/g)[0].replace("page=", ""))
      : 1;
  const amount = 6;
  let tempRight = 0;
  let tempLeft = 0;
  if (page - amount < 0) {
    tempRight += Math.abs(page - amount);
  }

  if (page + amount > maxPage) {
    tempLeft += Math.abs(page + amount - maxPage);
  }
  return (
    <ul className="storage-anime-page-list">
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
    </ul>
  );
}
