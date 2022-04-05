import {
  fetchDataGenreAnimeList$,
  lazyLoadAnimeListStream,
  updatePageScrollingWindow$,
} from "../epics/lazyLoadAnimeList";

export const initLazyLoadAnimeList = (setLazyLoadState) => {
  return () => {
    const subscription = lazyLoadAnimeListStream.subscribe(setLazyLoadState);
    lazyLoadAnimeListStream.init();
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
      const page = query.match(/page=[0-9]+/g)
        ? parseInt(query.match(/page=[0-9]+/g)[0].replace("page=", ""))
        : 1;
      window.scroll({
        top: 0,
      });
      lazyLoadAnimeListStream.updateData({
        genreDetailData: [],
        pageGenre: +page,
        pageIsLoaded: null,
        pageSplit: 1,
        query: null,
        pageOnDestroy: null,
        isStopScrollingUpdated: false,
        currentGenreId: null,
        trigger: !lazyLoadAnimeListStream.currentState().trigger
      });
    }
  };
};

export const updatePageScrollingWindow = (isStopScrollingUpdated) => {
  return () => {
    const subscription1 = updatePageScrollingWindow$().subscribe(() => {
      if (
        lazyLoadAnimeListStream.currentState().pageGenre !==
        lazyLoadAnimeListStream.currentState().pageIsLoaded
      )
        lazyLoadAnimeListStream.updateData({
          pageGenre: lazyLoadAnimeListStream.currentState().pageGenre + 1,
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
            updatedAnime = v.data;
          } else {
            updatedAnime = genreDetailData.concat(v.data);
          }
          // if (type) {
          //   lazyLoadAnimeListStream.updateData({ genre: type });
          // }
          if (!v.pagination.has_next_page) {
            lazyLoadAnimeListStream.updateData({
              isStopScrollingUpdated: true,
            });
          }
          lazyLoadAnimeListStream.updateData({
            genreDetailData: updatedAnime,
            pageIsLoaded: null,
            pageOnDestroy: lazyLoadAnimeListStream.currentState().pageGenre,
            query,
          });
        } else {
          console.log("hsa");
          lazyLoadAnimeListStream.updateData({
            isStopScrollingUpdated: true,
          });
        }
      });
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
  };
};
