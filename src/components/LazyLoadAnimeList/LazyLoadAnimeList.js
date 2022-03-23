/* eslint-disable react-hooks/exhaustive-deps */
import './LazyLoadAnimeList.css';

import loadable from '@loadable/component';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';

import { lazyLoadAnimeListStream } from '../../epics/lazyLoadAnimeList';
import {
  useFetchDataGenreAnimeList,
  useGenreIdChange,
  useInitLazyLoadAnimeList,
  useUpdatePageScrollingWindow,
} from '../../Hook/lazyLoadAnimeList';

const AnimeList = loadable(() =>
  import("../../components/AnimeList/AnimeList")
);

const LazyLoadAnimeList = ({ genreId, url, type }) => {
  const [lazyLoadState, setLazyLoadState] = useState(
    lazyLoadAnimeListStream.currentState()
  );
  const animeListRef = useRef();
  useEffect(() => {
    document.body.style.backgroundImage = `url(/background.jpg)`;
    document.body.style.backgroundSize = "cover";
  }, []);
  useInitLazyLoadAnimeList(setLazyLoadState);
  useGenreIdChange(parseInt(genreId), lazyLoadState);
  useUpdatePageScrollingWindow(lazyLoadState);
  useFetchDataGenreAnimeList(
    lazyLoadState,
    parseInt(genreId),
    url,
    type
  );
  return (
    <div className="container-genre-detail">
      <h1>
        {!lazyLoadState.genre ? (
          <CircularProgress color="secondary" size="5rem" />
        ) : (
          lazyLoadState.genre
        )}
      </h1>
      <AnimeList
        virtual={true}
        data={lazyLoadState.genreDetailData}
        error={null}
        animeListRef={animeListRef}
      />
      {!lazyLoadState.isStopScrollingUpdated && (
        <div className="loading-symbol">
          <CircularProgress color="secondary" size="3rem" />
        </div>
      )}
      {/* {lazyLoadState.isStopScrollingUpdated && <h1>End</h1>} */}
    </div>
  );
};

export default LazyLoadAnimeList;
