import {
  fetchDataGenreAnimeList$,
  lazyLoadAnimeListStream,
  updatePageScrollingWindow$,
} from "../epics/lazyLoadAnimeList";
import {
  resizedVirtual$,
  virtualAnimeListStream,
} from "../epics/virtualAnimeList";

export const initLazyLoadAnimeList = (virtual, setLazyLoadState) => {
  return () => {
    const subscription = lazyLoadAnimeListStream.subscribe(setLazyLoadState);
    lazyLoadAnimeListStream.init();
    virtualAnimeListStream.updateDataQuick({ isVirtual: virtual });
    window.scroll({
      top: 0,
    });
    return () => {
      if (virtual)
        virtualAnimeListStream.updateDataQuick({
          scrollY: window.scrollY,
        });
      subscription.unsubscribe();
      virtualAnimeListStream.updateDataQuick({ isVirtual: false });
    };
  };
};

export const genreIdChange = (genreId, virtual, currentGenreId) => {
  return () => {
    if (
      lazyLoadAnimeListStream.currentState().genreDetailData.length === 0 ||
      currentGenreId !== genreId
    ) {
      window.scroll({
        top: 0,
      });
      lazyLoadAnimeListStream.updateData({
        allowFetchIncreaseGenrePage: false,
        genreDetailData: [],
        pageGenre: 1,
        pageSplit: 1,
        genre: null,
        pageOnDestroy: null,
        isStopScrollingUpdated: false,
      });
      if (virtual)
        virtualAnimeListStream.updateDataQuick({
          scrollY: 0,
        });
    }
    const resizedSubscription = resizedVirtual$().subscribe(() => {
      const screenWidth = document.querySelector(".container-genre-detail")
        .offsetWidth;
      if (virtual)
        virtualAnimeListStream.updateData({
          screenWidth: screenWidth,
        });
    });
    const timeout = setTimeout(() => {
      if (window.scrollY === 0) {
        // console.log("start", virtualAnimeListStream.currentState().scrollY);
        if (virtual)
          window.scroll({
            top: virtualAnimeListStream.currentState().scrollY,
          });
      }
    }, 10);
    return () => {
      clearTimeout(timeout);
      resizedSubscription.unsubscribe();
    };
  };
};

export const updatePageScrollingWindow = (
  virtual,
  allowFetchIncreaseGenrePage,
  genreDetailData,
  isStopScrollingUpdated
) => {
  return () => {
    const subscription1 = updatePageScrollingWindow$().subscribe(() => {
      if (virtual)
        virtualAnimeListStream.updateDataQuick({
          numberShowMorePreviousAnime: 0,
          numberShowMoreLaterAnime: 0,
        });
      if (
        allowFetchIncreaseGenrePage &&
        lazyLoadAnimeListStream.currentState().pageSplit *
          lazyLoadAnimeListStream.currentState().numberAnimeShowMore >
          genreDetailData.length
      )
        // lazyLoadAnimeListStream.updatePageGenre(
        //   genreDetailData.length / 100 + 1
        // );
        lazyLoadAnimeListStream.updateData({
          pageGenre: genreDetailData.length / 100 + 1,
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
  virtual
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
            updatedAnime = v.anime;
            if (virtual)
              virtualAnimeListStream.updateDataQuick({
                numberShowMorePreviousAnime: 0,
                numberShowMoreLaterAnime: 0,
              });
          } else {
            updatedAnime = genreDetailData.concat(v.anime);
          }
          if (v.mal_url) {
            lazyLoadAnimeListStream.updateData({ genre: v.mal_url.name });
          }
          if (v.meta) {
            lazyLoadAnimeListStream.updateData({ genre: v.meta.name });
          }
          if (
            updatedAnime.length / 100 + 1 !==
            parseInt(updatedAnime.length / 100 + 1)
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
