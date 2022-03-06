import {
  fetchTopMovie$,
  topAnimeListStream,
  topMovieUpdatedScrolling$,
} from "../epics/topAnimeList";

export const initTopAnimeList = (setTopAnimeListState) => {
  return () => {
    const subscription = topAnimeListStream.subscribe(setTopAnimeListState);
    topAnimeListStream.init();
    if (topAnimeListStream.currentState().screenWidth > 697) {
      setTimeout(() => {
        if (document.querySelector(".top-anime-list-container"))
          document.querySelector(".top-anime-list-container").scroll({
            top: topAnimeListStream.currentState().positionScrollTop,
          });
      }, 10);
    }
    if (topAnimeListStream.currentState().dataTopMovie.length === 0) {
      // updatePageTopMovieOnDestroy(null);
      topAnimeListStream.updateDataQuick({
        pageTopMovieOnDestroy: null,
      });
      topAnimeListStream.updateData({
        isStopFetchTopMovie: false,
      });
    }
    return () => {
      subscription.unsubscribe();
      if (topAnimeListStream.currentState().screenWidth > 697) {
        topAnimeListStream.updateData({
          positionScrollTop: document.querySelector(".top-anime-list-container")
            .scrollTop,
        });
      }
    };
  };
};

export const pageScrollingUpdatePage = () => {
  return () => {
    let subscription11;
    const topAnimeElement = document.querySelector(".top-anime-list-container");
    if (topAnimeElement) {
      subscription11 = topMovieUpdatedScrolling$(topAnimeElement).subscribe(
        () => {
          if (
            8 + (topAnimeListStream.currentState().pageSplitTopMovie - 1) * 8 >
            topAnimeListStream.currentState().dataTopMovie.length
          )
            topAnimeListStream.updateData({
              pageTopMovie:
                topAnimeListStream.currentState().dataTopMovie.length / 25 + 1,
            });
        }
      );
      if (topAnimeListStream.currentState().isStopFetchTopMovie) {
        subscription11 && subscription11.unsubscribe();
      }
    }
    return () => {
      subscription11 && subscription11.unsubscribe();
    };
  };
};

export const fetchTopAnime = (topAnimeListState) => {
  return () => {
    let subscription7;
    if (
      topAnimeListStream.currentState().pageTopMovieOnDestroy !==
        topAnimeListState.pageTopMovie &&
      !topAnimeListStream.currentState().isStopFetchTopMovie
    )
      subscription7 = fetchTopMovie$().subscribe((topMovieList) => {
        // console.log("fetch top movie");
        const updatedAnime = [
          ...topAnimeListStream.currentState().dataTopMovie,
          ...topMovieList,
        ];
        if (
          updatedAnime.length / 25 + 1 !==
          parseInt(updatedAnime.length / 25 + 1)
        ) {
          topAnimeListStream.updateData({
            isStopFetchTopMovie: true,
          });
        }

        topAnimeListStream.updateData({
          dataTopMovie: updatedAnime,
        });
      });
    return () => {
      subscription7 && subscription7.unsubscribe();
    };
  };
};
