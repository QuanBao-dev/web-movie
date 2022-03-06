import { BehaviorSubject } from "rxjs";
const initialState = {
  screenWidth: null,
  dataTopMovie: [],
  pageTopMovieOnDestroy: null,
  isStopFetchTopMovie: false,
  pageSplitTopMovie: 1,
  allowFetchIncreasePageTopMovie: false,
  pageTopMovie: 1,
  toggleFetchMode: "rank",
  positionScrollTop: 0
};
const behaviorSubject = new BehaviorSubject(initialState);

let state = initialState;

const topAnimeListStore = {
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
};

export default topAnimeListStore;
