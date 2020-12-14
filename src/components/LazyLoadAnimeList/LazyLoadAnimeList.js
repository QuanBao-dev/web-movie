/* eslint-disable react-hooks/exhaustive-deps */
import "./LazyLoadAnimeList.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useState } from "react";

import { lazyLoadAnimeListStream } from "../../epics/lazyLoadAnimeList";
import {
  useFetchDataGenreAnimeList,
  useGenreIdChange,
  useInitLazyLoadAnimeList,
  useUpdatePageScrollingWindow,
} from "../../Hook/lazyLoadAnimeList";

const AnimeList = loadable(() =>
  import("../../components/AnimeList/AnimeList")
);

const LazyLoadAnimeList = ({ genreId, url }) => {
  const [lazyLoadState, setLazyLoadState] = useState(
    lazyLoadAnimeListStream.currentState()
  );
  const virtual = true;
  useInitLazyLoadAnimeList(virtual, setLazyLoadState);
  useGenreIdChange(parseInt(genreId), virtual, lazyLoadState);
  useUpdatePageScrollingWindow(virtual, lazyLoadState);
  useFetchDataGenreAnimeList(lazyLoadState, parseInt(genreId), url, virtual);

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
        virtual={virtual}
        data={lazyLoadState.genreDetailData.slice(
          0,
          lazyLoadState.pageSplit *
            lazyLoadAnimeListStream.currentState().numberAnimeShowMore
        )}
        error={null}
      />
      {!lazyLoadState.isStopScrollingUpdated && (
        <div className="loading-symbol">
          <CircularProgress color="secondary" size="3rem" />
        </div>
      )}
      {lazyLoadState.isStopScrollingUpdated && <h1>End</h1>}
    </div>
  );
};

export default LazyLoadAnimeList;
