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
  pageGenre:1,
  pageSplit:1
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
  updatePageSplit:(page) => {
    state = {
      ...state,
      pageSplit:page
    };
    subject.next(state);
  },
  resetAllGenrePage: () => {
    state = {
      ...state,
      genreDetailData: [],
      pageGenre: 1,
      pageSplit:1,
      genre:null,
      pageOnDestroy:null
    };
    subject.next(state);
  },
  updateGenre: (genre) => {
    state = {
      ...state,
      genre,
    };
    subject.next(state);
  },
  updateCurrentGenreId: (genreId) => {
    state = {
      ...state,
      currentGenreId: genreId,
    };
    subject.next(state);
  },
  updateIsStopScrollingUpdated: (bool) => {
    state = {
      ...state,
      isStopScrollingUpdated: bool,
    };
    subject.next(state);
  },
  updateAllowUpdatePageGenre: (bool) => {
    state = {
      ...state,
      allowFetchIncreaseGenrePage: bool,
    };
    subject.next(state);
  },
  updatePageGenre: (page) => {
    state = {
      ...state,
      pageGenre: page,
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
  updatePageOnDestroy : (page) => {
    state={
      ...state,
      pageOnDestroy:page
    };
    subject.next(state)
  }
};

export default lazyLoadAnimeListStore;