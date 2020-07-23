/* eslint-disable no-unused-vars */
import { BehaviorSubject } from "rxjs";
import { tap, share } from "rxjs/operators";
const initialState = {
  dataDetail: [],
  currentPage: 1,
  numberOfProduct: 12,
  year: 2020,
  season: "summer",
  maxPage: 1,
  isLoading: true,
  dataFilter: [],
  textSearch: "",
  dataTopMovie:[],
  error:null,
};

const subject = new BehaviorSubject(initialState);

let state = initialState;

const todoStore = {
  initialState,
  subscribe: (setState) => subject.pipe(tap((v) => console.log(v))).subscribe((v) => setState(v)),
  init: () => {
    subject.next(state);
  },

  updateAnimeData: (data) => {
    state = {
      ...state,
      dataDetail: [...data],
    };
    subject.next(state);
  },

  catchingError:(error) => {
    state = {
      ...state,
      error:error,
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

  updateSeason: (season) => {
    state = {
      ...state,
      season: season,
    };
    subject.next(state);
  },

  updateYear: (year) => {
    state = {
      ...state,
      year: year,
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
};

export const updateMaxPage = (max) => {
  state.maxPage = max;
};

export const updateIsLoading = (bool) => {
  state.isLoading = bool;
};

export const savingTextSearch = (text) => {
  state.textSearch = text;
};

export const updateTopMovie =(data) => {
  state.dataTopMovie = data;
};


export default todoStore;
