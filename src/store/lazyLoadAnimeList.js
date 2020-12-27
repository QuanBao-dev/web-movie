/* eslint-disable no-unused-vars */
import { BehaviorSubject } from "rxjs";
const initialState = {
  genreDetailData: [],
  pageOnDestroy: null,
  allowFetchIncreaseGenrePage: false,
  isStopScrollingUpdated: false,
  currentPageOnDestroy: null,
  currentGenreId: null,
  genre: null,
  pageGenre: 1,
  pageSplit: 1,
  numberAnimeShowMore: 20,
};

const subject = new BehaviorSubject(initialState);
let state = initialState;
const lazyLoadAnimeListStore = {
  initialState,
  subscribe: (setState) => subject.pipe().subscribe((v) => setState(v)),
  currentState: () => {
    let ans;
    subject.subscribe((v) => (ans = v));
    return ans || initialState;
  },
  init: () => {
    subject.next(state);
  },
  updateData: (data = initialState) => {
    state = {
      ...state,
      ...data,
    };
    subject.next(state);
  },
  updateDataQuick: (data = initialState) => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      state[key] = data[key];
    });
  },
};

export default lazyLoadAnimeListStore;
