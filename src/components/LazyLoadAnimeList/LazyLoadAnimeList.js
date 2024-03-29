/* eslint-disable react-hooks/exhaustive-deps */
import './LazyLoadAnimeList.css';

import loadable from '@loadable/component';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

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

const LazyLoadAnimeList = ({ url, query, searchBy }) => {
  const [lazyLoadState, setLazyLoadState] = useState(
    lazyLoadAnimeListStream.currentState()
  );
  const [cookie] = useCookies(["idCartoonUser"]);
  const animeListRef = useRef();
  useEffect(() => {
    document.body.style.backgroundImage = `url(/background.jpg)`;
    document.body.style.backgroundSize = "cover";
  }, []);
  useInitLazyLoadAnimeList(setLazyLoadState);
  useGenreIdChange(query, lazyLoadState);
  useUpdatePageScrollingWindow(lazyLoadState.isStopScrollingUpdated);
  useFetchDataGenreAnimeList(
    lazyLoadState,
    query,
    url,
    searchBy,
    cookie.idCartoonUser
  );
  return (
    <div className="container-genre-detail">
      <Link
        to={
          !["latest", "box"].includes(searchBy)
            ? `/storage?${
                query.match(/page=[0-9]+/g)
                  ? query
                      .replace(
                        /page=[0-9]+/g,
                        `page=${lazyLoadState.pageGenre}`
                      )
                      .replace("?", "")
                  : `${query !== "" ? "&" : ""}page=${
                      lazyLoadState.pageGenre
                    }` + query.replace("?", "")
              }`
            : "/"
        }
        className="filter-icon"
      >
        <i className="fas fa-filter"></i>
      </Link>
      <h1>Storage</h1>
      <AnimeList
        virtual={true}
        data={lazyLoadState.genreDetailData}
        error={null}
        lazy={true}
        animeListRef={animeListRef}
        searchBy={
          ["anime", "latest", "box"].includes(searchBy) ? "anime" : searchBy
        }
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
