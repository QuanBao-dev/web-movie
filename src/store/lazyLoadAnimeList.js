/* eslint-disable no-unused-vars */
import { BehaviorSubject } from "rxjs";
const initialState = {
  genreDetailData: [],
  pageOnDestroy: null,
  allowFetchIncreaseGenrePage: false,
  isStopScrollingUpdated: false,
  currentPageOnDestroy: null,
  query:null,
  pageGenre: 1,
  numberAnimeShowMore: (parseInt(window.innerHeight / 376) + 1) * 5,
  width: null,
  height: null,
  quantityItemPerRow: 5,
  widthItem: null,
  heightItem: null,
  rowStart: 0,
  rowEnd: 0,
  widthContainerList: "100%",
  trigger:true,
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
