import {
  fetchDataGenreAnimeList$,
  lazyLoadAnimeListStream,
  updatePageScrollingWindow$,
} from "../epics/lazyLoadAnimeList";

export const initLazyLoadAnimeList = (setLazyLoadState) => {
  return () => {
    const subscription = lazyLoadAnimeListStream.subscribe(setLazyLoadState);
    lazyLoadAnimeListStream.init();
    window.scroll({
      top: 0,
    });
    return () => {
      subscription.unsubscribe();
      lazyLoadAnimeListStream.updateDataQuick({ height: null });
    };
  };
};

export const genreIdChange = (query, currentQuery) => {
  return () => {
    if (
      lazyLoadAnimeListStream.currentState().genreDetailData.length === 0 ||
      currentQuery !== query
    ) {
      lazyLoadAnimeListStream.updateData({
        allowFetchIncreaseGenrePage: false,
        genreDetailData: [],
        pageGenre: 1,
        pageSplit: 1,
        query: null,
        pageOnDestroy: null,
        isStopScrollingUpdated: false,
        currentGenreId: null,
      });
    }
  };
};

export const updatePageScrollingWindow = (
  genreDetailData,
  isStopScrollingUpdated
) => {
  return () => {
    const subscription1 = updatePageScrollingWindow$().subscribe(() => {
      lazyLoadAnimeListStream.updateData({
        pageGenre: genreDetailData.length / 25 + 1,
      });
    });
    if (isStopScrollingUpdated) {
      subscription1 && subscription1.unsubscribe();
    }
    return () => {
      subscription1 && subscription1.unsubscribe();
    };
  };
};

export const fetchDataGenreAnimeList = (
  pageGenre,
  isStopScrollingUpdated,
  genreDetailData,
  query,
  url
) => {
  return () => {
    let subscription;
    if (
      (pageGenre !== lazyLoadAnimeListStream.currentState().pageOnDestroy ||
        lazyLoadAnimeListStream.currentState().genreDetailData.length === 0) &&
      isStopScrollingUpdated === false
    ) {
      subscription = fetchDataGenreAnimeList$(pageGenre, url).subscribe((v) => {
        if (!v.error) {
          let updatedAnime;
          if (
            lazyLoadAnimeListStream.currentState().genreDetailData.length ===
              0 ||
            lazyLoadAnimeListStream.currentState().query !== query
          ) {
            updatedAnime = v;
          } else {
            updatedAnime = genreDetailData.concat(v);
          }
          // if (type) {
          //   lazyLoadAnimeListStream.updateData({ genre: type });
          // }
          if (
            updatedAnime.length <
            lazyLoadAnimeListStream.currentState().numberAnimeShowMore
          ) {
            lazyLoadAnimeListStream.updateData({
              isStopScrollingUpdated: true,
            });
          }
          lazyLoadAnimeListStream.updateData({
            genreDetailData: updatedAnime,
            pageOnDestroy: lazyLoadAnimeListStream.currentState().pageGenre,
            allowFetchIncreaseGenrePage: true,
            query,
          });
        } else {
          lazyLoadAnimeListStream.updateData({
            isStopScrollingUpdated: true,
            allowFetchIncreaseGenrePage: false,
          });
        }
      });
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
  };
};
