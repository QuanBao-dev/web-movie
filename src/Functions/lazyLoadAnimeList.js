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

export const genreIdChange = (genreId, currentGenreId) => {
  return () => {
    if (
      lazyLoadAnimeListStream.currentState().genreDetailData.length === 0 ||
      currentGenreId !== genreId
    ) {
      // window.scroll({
      //   top: 0,
      // });
      lazyLoadAnimeListStream.updateData({
        allowFetchIncreaseGenrePage: false,
        genreDetailData: [],
        pageGenre: 1,
        pageSplit: 1,
        genre: null,
        pageOnDestroy: null,
        isStopScrollingUpdated: false,
        currentGenreId: null,
      });
    }
    const timeout = setTimeout(() => {
      if (window.scrollY === 0) {
        // console.log("start", virtualAnimeListStream.currentState().scrollY);
      }
    }, 10);
    return () => {
      clearTimeout(timeout);
    };
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
  genreId,
  url,
  type
) => {
  return () => {
    let subscription;
    if (
      (pageGenre !== lazyLoadAnimeListStream.currentState().pageOnDestroy ||
        lazyLoadAnimeListStream.currentState().genreDetailData.length === 0) &&
      isStopScrollingUpdated === false
    ) {
      subscription = fetchDataGenreAnimeList$(
        genreId,
        pageGenre,
        url
      ).subscribe((v) => {
        if (!v.error) {
          let updatedAnime;
          if (
            lazyLoadAnimeListStream.currentState().genreDetailData.length ===
              0 ||
            lazyLoadAnimeListStream.currentState().currentGenreId !== genreId
          ) {
            updatedAnime = v;
          } else {
            updatedAnime = genreDetailData.concat(v);
          }
          if (type) {
            lazyLoadAnimeListStream.updateData({ genre: type });
          }
          if (v.meta) {
            lazyLoadAnimeListStream.updateData({ genre: v.meta.name });
          }
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
            currentGenreId: genreId,
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
