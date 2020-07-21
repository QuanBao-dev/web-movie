/* eslint-disable no-unused-vars */
import { BehaviorSubject } from "rxjs";
import { tap, share } from "rxjs/operators";
const initialState = {
  dataDetail: [],
  currentPage:1,
  numberOfProduct:12,
  year:2020,
  season:"summer",
  maxPage:1,
  isLoading:true,
  error:undefined
};

const subject = new BehaviorSubject(initialState);

let state = initialState;

const todoStore = {
  initialState,
  subscribe: (setState) => subject.pipe().subscribe((v) => setState(v)),
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

  increaseCurrentPage:() => {
    state = {
      ...state,
      currentPage:(state.currentPage+1 <= state.maxPage) ? state.currentPage + 1 : state.currentPage,
    }
    subject.next(state)
  },

  decreaseCurrentPage:() => {
    state = {
      ...state,
      currentPage: (state.currentPage - 1 > 0) ? state.currentPage-1 : state.currentPage,
    }
    subject.next(state)
  },

  updateSeason:(season) => {
    state = {
      ...state,
      season:season,
    }
    subject.next(state)
  },

  updateYear:(year) => {
    state = {
      ...state,
      year:year,
    }
    subject.next(state)
  },

  handleError:(error) => {
    state = {
      ...state,
      error:error
    }
    subject.next(state)
  }
};

export const updateMaxPage=(max) => {
  state.maxPage = max
}

export const updateIsLoading = (bool) => {
  state.isLoading = bool
}

export default todoStore;
