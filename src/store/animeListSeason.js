import { BehaviorSubject } from "rxjs";
let today = new Date(Date.now()).getMonth() + 1;
let currentSeason;
let numSeason = today / 3;
if (numSeason <= 1) currentSeason = "winter";
if (1 < numSeason && numSeason <= 2) currentSeason = "spring";
if (2 < numSeason && numSeason <= 3) currentSeason = "summer";
if (3 < numSeason) currentSeason = "fall";

const initialState = {
  maxPage: 1,
  dataDetail: [],
  dataDetailOriginal: [],
  modeFilter: "filter",
  score: 0,
  genreId: "0",
  currentPage: 1,
  numberOfProduct: 40,
  season: currentSeason,
  year: new Date(Date.now()).getFullYear(),
  textSearch: "",
  screenWidth: null,
  currentPageOnDestroy: null,
  currentYearOnDestroy: null,
  currentSeasonOnDestroy: null,
  isFetching: false,
  triggerScroll: false,
  isSmoothScroll: true,
  isInit: true,
};
const behaviorSubject = new BehaviorSubject(initialState);

let state = initialState;

const animeListSeasonStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe((v) => setState(v)),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => {
      ans = v;
    });
    return ans || initialState;
  },
  init: () => {
    state = {
      ...state,
      screenWidth: window.innerWidth,
    };
    behaviorSubject.next(state);
  },
  updateData: (data = initialState) => {
    state = {
      ...state,
      ...data,
    };
    behaviorSubject.next(state);
  },
  updateDataQuick: (data = initialState) => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      state[key] = data[key];
    });
  },
  increaseCurrentPage: () => {
    state = {
      ...state,
      currentPage:
        state.currentPage + 1 <= state.maxPage
          ? state.currentPage + 1
          : state.currentPage,
    };
    behaviorSubject.next(state);
  },
  decreaseCurrentPage: () => {
    state = {
      ...state,
      currentPage:
        state.currentPage - 1 > 0 ? state.currentPage - 1 : state.currentPage,
    };
    behaviorSubject.next(state);
  },
  updateSeasonYear: (season, year, score, modeFilter, genreId) => {
    if (genreId === "12" && modeFilter === "filter") {
      genreId = "0";
    }
    state = {
      ...state,
      season: season,
      year: year,
      score,
      modeFilter,
      genreId,
    };
    behaviorSubject.next(state);
  },
};

export default animeListSeasonStore;
