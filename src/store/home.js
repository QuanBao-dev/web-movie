/* eslint-disable no-unused-vars */
import { BehaviorSubject } from "rxjs";
let today = new Date(Date.now()).getMonth() + 1;
let currentSeason;
let numSeason = today / 3;
if (numSeason <= 1) currentSeason = "winter";
if (1 <= numSeason && numSeason < 2) currentSeason = "spring";
if (2 <= numSeason && numSeason < 3) currentSeason = "summer";
if (3 <= numSeason) currentSeason = "fall";
const initialState = {
  dataDetail: [],
  dataDetailOriginal: [],
  currentPage: 1,
  numberOfProduct: 36,
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
  pageTopMovieOnDestroy: null,
  allowFetchIncreasePageTopMovie: false,
  isStopFetchTopMovie: false,
  currentPageOnDestroy: null,
  currentYearOnDestroy: null,
  currentSeasonOnDestroy: null,
  pageSplit:1,
  pageSplitTopMovie:1,
  positionScrollTop:0,
  modeFilter:"filter",
  isFirstLaunch:true,
  genreId:"0"
};

const subject = new BehaviorSubject(initialState);
let state = initialState;
const homeStore = {
  initialState,
  subscribe: (setState) => subject.pipe().subscribe((v) => setState(v)),
  currentState: () => {
    let ans;
    subject.subscribe((v) => (ans = v));
    return ans || initialState;
  },
  updateModeFilter:(mode) => {
    state={
      ...state,
      modeFilter:mode
    };
    subject.next(state);
  },
  updateIsFirstLaunch:(bool) => {
    state={
      ...state,
      isFirstLaunch:bool
    };
    subject.next(state);
  },
  updateNumberOfProduct:(number) => {
    state={
      ...state,
      numberOfProduct:number
    };
    subject.next(state);
  },
  updatePositionScrollTop:(pos) => {
    state = {
      ...state,
      positionScrollTop:pos
    };
    subject.next(state);
  },
  updatePageSplitTopMovie:(page)=>{
    state = {
      ...state,
      pageSplitTopMovie:page
    };
    subject.next(state);
  },
  updatePageSplit:(page) => {
    state={
      ...state,
      pageSplit:page
    };
    subject.next(state);
  },
  init: () => {
    state = {
      ...state,
      screenWidth: window.innerWidth,
    };
    subject.next(state);
  },
  updateIsStopFetchTopMovie: (bool) => {
    state = {
      ...state,
      isStopFetchTopMovie: bool,
    };
    subject.next(state);
  },
  updateAllowIncreasePageTopMovie: (bool) => {
    state = {
      ...state,
      allowFetchIncreasePageTopMovie: bool,
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

  updateSeasonYear: (season, year, score, modeFilter, genreId) => {
    state = {
      ...state,
      season: season,
      year: year,
      score,
      modeFilter,
      genreId
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
      dataTopMovie: data,
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
  allowScrollToSeeMore : (bool) => {
    state = {
      ...state,
      shouldScrollToSeeMore: bool
    }
    subject.next(state);
  }
};

export const updateDataOnDestroy = (page, season, year) => {
  state.currentPageOnDestroy = page;
  state.currentSeasonOnDestroy = season;
  state.currentYearOnDestroy = year;
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

export const updateCurrentPageOnDestroy = (page) => {
  state.currentPageOnDestroy = page;
};

export const updateOriginalData = (data) => {
  state.dataDetailOriginal = data;
  state.currentPage = 1;
};

export const savingTextSearch = (text) => {
  state.textSearch = text;
};

export const updateModeScrolling = (mode) => {
  state.modeScrolling = mode;
};

export default homeStore;
