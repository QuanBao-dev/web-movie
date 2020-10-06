import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchTopMovie$, stream, topMovieUpdatedScrolling$ } from '../../epics/home';
import { updatePageTopMovieOnDestroy } from '../../store/home';

function TopAnimeList({ homeState }) {
  useEffect(() => {
    return () => {
      updatePageTopMovieOnDestroy(stream.currentState().pageTopMovie);
    };
  }, []);
  useEffect(() => {
    let subscription7;
    let subscription11;
    const topAnimeElement = document.querySelector(".top-anime-list-container");
    if (topAnimeElement) {
      subscription11 = topMovieUpdatedScrolling$(topAnimeElement).subscribe(
        () => {
          updateDataTopScrolling();
        }
      );
    }
    if (stream.currentState().pageTopMovieOnDestroy !== homeState.pageTopMovie)
      subscription7 = fetchTopMovie$(subscription11).subscribe(
        (topMovieList) => {
          // console.log("fetch top movie");
          stream.updateTopMovie(topMovieList);
        }
      );
    return () => {
      subscription7 && subscription7.unsubscribe();
      subscription11 && subscription11.unsubscribe();
    };
  }, [homeState.pageTopMovie]);
  return (
    <div className="top-anime-list-container">
      <h1>Top Anime</h1>
      <ul className="top-anime-list">
        {homeState.dataTopMovie &&
          homeState.dataTopMovie.map((movie, index) => (
            <li key={index}>
              <h2>Rank {movie.rank}</h2>
              <div>
                <div className="top-anime-list-info">
                  <div className="top-movie-score__home">{movie.score}/10</div>
                  <Link to={"/anime/" + movie.mal_id}>
                    <img src={movie.image_url} alt="Preview" />
                  </Link>
                  <div className="title">{movie.title}</div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

function updateDataTopScrolling() {
  let page = stream.currentState().pageTopMovie;
  stream.updatePageTopMovie(page + 1);
}

export default TopAnimeList;
