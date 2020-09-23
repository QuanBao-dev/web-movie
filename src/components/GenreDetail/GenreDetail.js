/* eslint-disable react-hooks/exhaustive-deps */
import './GenreDetail.css';

import React, { useEffect, useState } from 'react';
import { fromEvent, of, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, debounceTime, exhaustMap, filter, pluck, retry } from 'rxjs/operators';

import AnimeList from '../AnimeList/AnimeList';

const GenreDetail = (props) => {
  const { genreId, genre } = props.match.params;
  const [page, setPage] = useState(1);
  const [genreAnimeList, setGenreAnimeList] = useState([]);

  useEffect(() => {
    const subscription = updatePageScrollingWindow$().subscribe((v) => {
      const currentPage = page;
      setPage(currentPage + 1);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [page]);
  useEffect(() => {
    const subscription = fetchDataGenreAnimeList(genreId, page).subscribe(
      (v) => {
        const updatedAnime = [...genreAnimeList,...v];
        setGenreAnimeList(updatedAnime);
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [page, genreId]);

  return (
    <div className="container-genre-detail">
      <h1>
        {genre} anime
      </h1>
      <AnimeList data={genreAnimeList} error={null} />
    </div>
  );
};

function fetchDataGenreAnimeList(genreId, page) {
  return timer(0).pipe(
    exhaustMap(() =>
      ajax(`https://api.jikan.moe/v3/genre/anime/${genreId}/${page}`).pipe(
        retry(20),
        pluck("response", "anime"),
        catchError(() => of([]))
      )
    )
  );
}

function updatePageScrollingWindow$() {
  return fromEvent(window, "scroll").pipe(
    debounceTime(500),
    filter(() => document.body.scrollHeight - (window.scrollY + 2000) < 0)
  );
}

export default GenreDetail;
