/* eslint-disable no-unused-vars */
import { BehaviorSubject } from "rxjs";
let today = new Date(Date.now()).getMonth() + 1;
let currentSeason;
let numSeason = parseInt(((today + 1) / 3).toString());

switch (numSeason) {
  case 2:
    currentSeason = "spring";
    break;
  case 3:
    currentSeason = "summer";
    break;
  case 4:
    currentSeason = "fall";
    break;
  case 1:
    currentSeason = "winter";
    break;
  default:
    break;
}

const initialState = {
  dataDetail: [],
  dataDetailOriginal: [],
  currentPage: 1,
  numberOfProduct: 45,
  year: new Date(Date.now()).getFullYear(),
  season: currentSeason,
  maxPage: 1,
  isLoading: true,
  dataFilter: [],
  textSearch: "",
  dataTopMovie: [],
  error: null,
  dataScheduleMovie: {},
  dateSchedule: Array.from(Array(7).keys()).map(() => false),
  updatedMovie: [],
  boxMovie: [],
  genreDetailData: [],
  pageGenre: 1,
  shouldFetchLatestUpdatedMovie: true,
  shouldFetchBoxMovie: false,
  shouldScrollToSeeMore: false,
  shouldFetchTopMovie: true,
  pageTopMovie: 1,
  screenWidth: null,
  upcomingAnimeList: [],
  score: 0,
  modeScrolling: "interval",
  dataCarousel: [],
  pageOnDestroy: null,
  pageTopMovieOnDestroy: null,
  allowFetchIncreaseGenrePage:false,
  currentGenreId:null,
  isStopScrollingUpdated:false,
};

const subject = new BehaviorSubject(initialState);
let state = initialState;
const homeStore = {
  initialState,
  subscribe: (setState) => subject.pipe().subscribe((v) => setState(v)),
  currentState: () => {
    let ans;
    subject.subscribe((v) => (ans = v));
    return ans;
  },
  init: () => {
    state = {
      ...state,
      screenWidth: window.innerWidth,
    };
    subject.next(state);
  },
  updateIsStopScrollingUpdated:(bool) => {
    state={
      ...state,
      isStopScrollingUpdated:bool
    }
    subject.next(state);
  },
  updateCurrentGenreId:(genreId) => {
    state={
      ...state,
      currentGenreId:genreId
    }
    subject.next(state);
  },
  updateError:(bool) => {
    state = {
      ...state,
      errorFetchGenre:bool
    };
    subject.next(state);
  },
  updateAllowUpdatePageGenre:(bool) => {
    state={
      ...state,
      allowFetchIncreaseGenrePage:bool
    };
    subject.next(state)
  },
  updatePageGenre: (page) => {
    state = {
      ...state,
      pageGenre: page,
    };
    subject.next(state);
  },
  updateDataCarousel: (data) => {
    state = {
      ...state,
      dataCarousel: [...data],
    };
    subject.next(state);
  },
  updateGenreDetailData: (genreDetail) => {
    state = {
      ...state,
      genreDetailData: genreDetail,
    };
    subject.next(state);
  },
  updatePageTopMovie: (num) => {
    state = {
      ...state,
      pageTopMovie: num,
    };
    subject.next(state);
  },

  updateDate: (date) => {
    state = {
      ...state,
      dateSchedule: [...date],
    };
    subject.next(state);
  },

  updateDataSchedule: (data) => {
    state = {
      ...state,
      dataScheduleMovie: {
        ...state.dataScheduleMovie,
        ...data,
      },
    };
    subject.next(state);
  },

  updateAnimeData: (data) => {
    state = {
      ...state,
      dataDetail: [...data],
    };
    subject.next(state);
  },

  catchingError: (error) => {
    state = {
      ...state,
      error: error,
    };
    subject.next(state);
  },

  updateCurrentPage: (page) => {
    state = {
      ...state,
      currentPage: page,
    };
    subject.next(state);
  },

  increaseCurrentPage: () => {
    state = {
      ...state,
      currentPage:
        state.currentPage + 1 <= state.maxPage
          ? state.currentPage + 1
          : state.currentPage,
    };
    subject.next(state);
  },

  decreaseCurrentPage: () => {
    state = {
      ...state,
      currentPage:
        state.currentPage - 1 > 0 ? state.currentPage - 1 : state.currentPage,
    };
    subject.next(state);
  },

  updateSeasonYear: (season, year, score) => {
    state = {
      ...state,
      season: season,
      year: year,
      score,
    };
    subject.next(state);
  },

  updateDataFilter: (dataFilter) => {
    state = {
      ...state,
      dataFilter: dataFilter,
    };
    subject.next(state);
  },

  updateTopMovie: (data) => {
    state = {
      ...state,
      dataTopMovie: [...state.dataTopMovie, ...data],
    };
    subject.next(state);
  },
  updateUpdatedMovie: (data) => {
    state = {
      ...state,
      updatedMovie: [...data],
    };
    subject.next(state);
  },

  updateBoxMovie: (data) => {
    state = {
      ...state,
      boxMovie: [...data],
    };
    subject.next(state);
  },

  updateUpcomingAnimeList: (upcomingDataList) => {
    state = {
      ...state,
      upcomingAnimeList: upcomingDataList,
    };
    subject.next(state);
  },
};

export const resetGenreDetail = () => {
  state.pageGenre = 1;
  state.genreDetailData = [];
};

export const updatePageOnDestroy = (page) => {
  state.pageOnDestroy = page;
};

export const updatePageTopMovieOnDestroy = (page) => {
  state.pageTopMovieOnDestroy = page;
};

export const resetScheduleDate = () => {
  const week = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const todayDate = new Date(Date.now())
    .toDateString()
    .slice(0, 3)
    .toLocaleLowerCase();
  const todayIndex = week.findIndex((day) => day.includes(todayDate));
  state.dateSchedule[todayIndex] = true;
};

export const updateMaxPage = (max) => {
  state.maxPage = max;
};

export const updateOriginalData = (data) => {
  state.dataDetailOriginal = data;
};

export const savingTextSearch = (text) => {
  state.textSearch = text;
};

export const allowScrollToSeeMore = (bool) => {
  state.shouldScrollToSeeMore = bool;
};

export const updateModeScrolling = (mode) => {
  state.modeScrolling = mode;
};

export default homeStore;
