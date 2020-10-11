/* eslint-disable react-hooks/exhaustive-deps */
import "./LazyLoadAnimeList.css";

import React, { Suspense, useEffect, useState } from "react";

import {
  fetchDataGenreAnimeList$,
  lazyLoadAnimeListStream,
  updatePageScrollingWindow$,
} from "../../epics/lazyLoadAnimeList";

const AnimeList = React.lazy(() =>
  import("../../components/AnimeList/AnimeList")
);

const LazyLoadAnimeList = ({ genreId, url }) => {
  const [lazyLoadState, setLazyLoadState] = useState(
    lazyLoadAnimeListStream.initialState
  );
  useEffect(() => {
    const subscription = lazyLoadAnimeListStream.subscribe(setLazyLoadState);
    lazyLoadAnimeListStream.init();
    window.scroll({
      top: 0,
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (
      lazyLoadAnimeListStream.currentState().genreDetailData.length === 0 ||
      lazyLoadAnimeListStream.currentState().currentGenreId !== genreId
    ) {
      window.scroll({
        top: 0,
      });
      lazyLoadAnimeListStream.updateAllowUpdatePageGenre(false);
      lazyLoadAnimeListStream.resetAllGenrePage();
      lazyLoadAnimeListStream.updateIsStopScrollingUpdated(false);
    }
  }, [lazyLoadState.currentGenreId]);
  useEffect(() => {
    let subscription1;
    subscription1 = updatePageScrollingWindow$().subscribe(() => {
      if (lazyLoadState.allowFetchIncreaseGenrePage)
        lazyLoadAnimeListStream.updatePageGenre(
          lazyLoadState.genreDetailData.length / 100 + 1
        );
    });
    return () => {
      subscription1 && subscription1.unsubscribe();
    };
  }, [lazyLoadState.allowFetchIncreaseGenrePage, lazyLoadState.pageGenre]);
  useEffect(() => {
    let subscription;
    if (
      lazyLoadState.pageGenre !==
        lazyLoadAnimeListStream.currentState().pageOnDestroy &&
      lazyLoadState.isStopScrollingUpdated === false
    )
      subscription = fetchDataGenreAnimeList$(
        genreId,
        lazyLoadState.pageGenre,
        url
      ).subscribe((v) => {
        if (!v.error) {
          let updatedAnime;
          if (
            lazyLoadAnimeListStream.currentState().genreDetailData.length ===
              0 ||
            lazyLoadAnimeListStream.currentState().currentGenreId !== genreId
          ) {
            updatedAnime = [...v.anime];
          } else {
            updatedAnime = [...lazyLoadState.genreDetailData, ...v.anime];
          }
          if (v.mal_url) {
            lazyLoadAnimeListStream.updateGenre(v.mal_url.name);
          }
          if (v.meta) {
            lazyLoadAnimeListStream.updateGenre(v.meta.name);
          }
          if (
            updatedAnime.length / 100 + 1 !==
            parseInt(updatedAnime.length / 100 + 1)
          ) {
            lazyLoadAnimeListStream.updateIsStopScrollingUpdated(true);
          }
          lazyLoadAnimeListStream.updateGenreDetailData(updatedAnime);
          lazyLoadAnimeListStream.updatePageOnDestroy(
            lazyLoadAnimeListStream.currentState().pageGenre
          );
          lazyLoadAnimeListStream.updateAllowUpdatePageGenre(true);
          lazyLoadAnimeListStream.updateCurrentGenreId(genreId);
        } else {
          lazyLoadAnimeListStream.updateIsStopScrollingUpdated(true);
          lazyLoadAnimeListStream.updateAllowUpdatePageGenre(false);
        }
      });
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [lazyLoadState.pageGenre, genreId]);
  return (
    <div className="container-genre-detail">
      <h1>
        {!lazyLoadState.genre ? (
          <i className="fas fa-spinner fa-2x fa-spin"></i>
        ) : (
          lazyLoadState.genre
        )}
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AnimeList
          data={lazyLoadState.genreDetailData.slice(
            0,
            10 + (lazyLoadState.pageSplit - 1) * 5
          )}
          error={null}
        />
      </Suspense>
      <div
        className="loading-symbol"
        style={{
          display: lazyLoadState.isStopScrollingUpdated ? "none" : "",
        }}
      >
        <i className="fas fa-spinner fa-3x fa-spin"></i>
      </div>
      {lazyLoadState.isStopScrollingUpdated && <h1>End</h1>}
    </div>
  );
};

export default LazyLoadAnimeList;
