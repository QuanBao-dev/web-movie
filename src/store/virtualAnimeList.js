import { BehaviorSubject } from "rxjs";
const initialState = {
  screenWidth: null,
  screenHeight: null,
  quantityAnimePerRow: 1,
  offsetWidthAnime: null,
  offsetHeightAnime: null,
  numberShowMorePreviousAnime: 0,
  numberShowMoreLaterAnime: 0,
  scrollY: 0,
  isVirtual: false,
  margin: 0,
  isExceed: false,
  triggerUpdate: false,
};
const behaviorSubject = new BehaviorSubject(initialState);

let state = initialState;

const virtualAnimeListStore = {
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

export default virtualAnimeListStore;
