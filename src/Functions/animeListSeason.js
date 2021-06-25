import orderBy from "lodash/orderBy";
import {
  animeListSeasonStream,
  changeCurrentPage$,
  changeSeasonYear$,
  fetchAnimeSeason$,
} from "../epics/animeListSeason";

export const initAnimeListSeason = (setAnimeListState) => {
  return () => {
    const subscription = animeListSeasonStream.subscribe(setAnimeListState);
    animeListSeasonStream.init();
    window.scroll({
      top: 0,
    });
    return () => {
      animeListSeasonStream.updateData({ isInit: true });
      subscription.unsubscribe();
    };
  };
};

export const filterAnimeList = (
  animeListSeasonState = animeListSeasonStream.currentState()
) => {
  return () => {
    const filterAnime = animeListSeasonState.dataDetailOriginal.filter(
      (movie) => {
        if (animeListSeasonState.modeFilter === "all") {
          return (
            movie.airing_start &&
            checkAnimeIncludeGenre(
              movie.genres,
              animeListSeasonStream.currentState().genreId
            ) &&
            (movie.score > animeListSeasonState.score ||
              animeListSeasonState.score === 0)
          );
        }
        return (
          movie.airing_start &&
          limitAdultGenre(movie.genres) &&
          checkAnimeIncludeGenre(
            movie.genres,
            animeListSeasonStream.currentState().genreId
          ) &&
          (movie.score > animeListSeasonState.score ||
            animeListSeasonState.score === 0)
        );
      }
    );
    animeListSeasonStream.updateDataQuick({
      maxPage: Math.ceil(
        filterAnime.length /
          animeListSeasonStream.currentState().numberOfProduct
      ),
    });
    const sortedArray = orderBy(filterAnime, ["airing_start"], ["desc"]).slice(
      (animeListSeasonState.currentPage - 1) *
        animeListSeasonState.numberOfProduct,
      animeListSeasonState.currentPage * animeListSeasonState.numberOfProduct
    );
    animeListSeasonStream.updateData({
      dataDetail: sortedArray,
    });
    if (
      animeListSeasonStream.currentState().maxPage <
      animeListSeasonStream.currentState().currentPage
    ) {
      animeListSeasonStream.updateData({ currentPage: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
};

export const fetchAnimeListSeason = (
  animeListSeasonState = animeListSeasonStream.currentState()
) => {
  return () => {
    if (
      animeListSeasonState.currentPage !==
        animeListSeasonState.currentPageOnDestroy ||
      animeListSeasonState.season !==
        animeListSeasonState.currentSeasonOnDestroy ||
      animeListSeasonState.year !== animeListSeasonState.currentYearOnDestroy
    ) {
      animeListSeasonStream.updateData({ isFetching: true });
      fetchAnimeSeason$(
        animeListSeasonState.year,
        animeListSeasonState.season,
        1,
        animeListSeasonState.numberOfProduct,
        animeListSeasonState.score
      ).subscribe((v) => {
        if (!animeListSeasonStream.currentState().isInit) {
          console.log("scroll");
          animeListSeasonStream.updateData({
            triggerScroll: !animeListSeasonStream.currentState().triggerScroll,
            isInit: false,
          });
        }
        animeListSeasonStream.updateData({
          dataDetail: v,
          isFetching: false,
          isSmoothScroll: false,
        });
        animeListSeasonStream.updateDataQuick({ isInit: false });
      });
    }
    return () => {
      animeListSeasonStream.updateDataQuick({
        currentPageOnDestroy: animeListSeasonStream.currentState().currentPage,
        currentSeasonOnDestroy: animeListSeasonState.season,
        currentYearOnDestroy: animeListSeasonState.year,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
};

export const listenWhenOptionChange = (
  animeListSeasonState,
  selectSeason,
  selectYear,
  selectScore,
  selectFilterMode,
  selectGenre
) => {
  return () => {
    if (selectSeason.current && selectYear.current) {
      selectSeason.current.value = animeListSeasonState.season;
      selectYear.current.value = animeListSeasonState.year;
    }
    const input = document.querySelector(".wrapper-search-anime-list input");
    if (input && input.value.trim() === "")
      input.value = animeListSeasonState.textSearch;

    const subscription3 = changeCurrentPage$().subscribe();
    let subscription4;
    if (
      selectYear.current &&
      selectSeason.current &&
      selectScore.current &&
      selectFilterMode.current &&
      selectGenre.current
    )
      subscription4 = changeSeasonYear$(
        selectYear.current,
        selectSeason.current,
        selectScore.current,
        selectFilterMode.current,
        selectGenre.current
      ).subscribe(([year, season, score, modeFilter, genreId]) => {
        if (!animeListSeasonStream.currentState().isInit)
          animeListSeasonStream.updateData({
            triggerScroll: !animeListSeasonStream.currentState().triggerScroll,
            isSmoothScroll: false,
            isInit: false,
          });
        animeListSeasonStream.updateSeasonYear(
          season,
          year,
          score,
          modeFilter,
          genreId
        );
      });
    return () => {
      subscription4 && subscription4.unsubscribe();
      subscription3.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
};

export function checkAnimeIncludeGenre(genresAnime, genreCheckMalId) {
  let check = false;
  if (genreCheckMalId === "0") {
    return true;
  }
  genresAnime.forEach((genre) => {
    if (genre.mal_id.toString() === genreCheckMalId) {
      check = true;
    }
  });
  return check;
}

export function limitAdultGenre(genres) {
  let check = true;
  genres.forEach((genre) => {
    if (genre.name === "Hentai") {
      check = false;
    }
  });
  return check;
}
