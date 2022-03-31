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
    // window.scroll({
    //   top: 0,
    // });
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
    const { dataDetailOriginal } = animeListSeasonState;
    const filteredData = dataDetailOriginal.filter(({ score, genres }) => {
      let isContained = true;
      if (parseInt(animeListSeasonState.genreId)) {
        const malIdList = genres.map(({ mal_id }) => mal_id);
        isContained = malIdList.includes(
          parseInt(animeListSeasonState.genreId)
        );
      }
      return (
        ((score === null && animeListSeasonState.score === 0) ||
          score > animeListSeasonState.score) &&
        isContained
      );
    });
    animeListSeasonStream.updateData({
      dataDetail: filteredData,
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

let subscription;
export const fetchAnimeListSeason = (
  animeListSeasonState = animeListSeasonStream.currentState()
) => {
  return () => {
    if (
      animeListSeasonState.currentPage !==
        animeListSeasonStream.currentState().currentPageOnDestroy ||
      animeListSeasonState.season !==
        animeListSeasonStream.currentState().currentSeasonOnDestroy ||
      animeListSeasonState.year !==
        animeListSeasonStream.currentState().currentYearOnDestroy
    ) {
      animeListSeasonStream.updateData({ isFetching: true });
      subscription && subscription.unsubscribe();
      subscription = fetchAnimeSeason$(
        animeListSeasonState.year,
        animeListSeasonState.season,
        animeListSeasonState.currentPage,
        animeListSeasonState.numberOfProduct,
        animeListSeasonState.score
      ).subscribe((v) => {
        if (!animeListSeasonStream.currentState().isInit) {
          animeListSeasonStream.updateData({
            triggerScroll: !animeListSeasonStream.currentState().triggerScroll,
            isInit: false,
          });
        }
        const filteredData = v.filter(({ score, genres }) => {
          let isContained = true;
          if (parseInt(animeListSeasonState.genreId)) {
            const malIdList = genres.map(({ mal_id }) => mal_id);
            isContained = malIdList.includes(
              parseInt(animeListSeasonState.genreId)
            );
          }
          return (
            ((score === null && animeListSeasonState.score === 0) ||
              score > animeListSeasonState.score) &&
            isContained
          );
        });
        animeListSeasonStream.updateData({
          dataDetail: filteredData,
          dataDetailOriginal: v,
          isFetching: false,
          isSmoothScroll: false,
        });
        animeListSeasonStream.updateDataQuick({ isInit: false });
        if (
          animeListSeasonStream.currentState().maxPage <
          animeListSeasonStream.currentState().currentPage
        ) {
          animeListSeasonStream.updateData({ currentPage: 1 });
        }
        animeListSeasonStream.updateDataQuick({
          currentPageOnDestroy:
            animeListSeasonStream.currentState().currentPage,
          currentSeasonOnDestroy: animeListSeasonStream.currentState().season,
          currentYearOnDestroy: animeListSeasonStream.currentState().year,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
};

export const listenWhenOptionChange = (
  animeListSeasonState,
  selectSeason,
  selectYear,
  selectScore,
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
      selectGenre.current
    )
      subscription4 = changeSeasonYear$(
        selectYear.current,
        selectSeason.current,
        selectScore.current,
        selectGenre.current
      ).subscribe(([year, season, score, genreId]) => {
        if (!animeListSeasonStream.currentState().isInit)
          animeListSeasonStream.updateData({
            triggerScroll: !animeListSeasonStream.currentState().triggerScroll,
            isSmoothScroll: false,
            isInit: false,
          });
        animeListSeasonStream.updateSeasonYear(season, year, score, genreId);
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
