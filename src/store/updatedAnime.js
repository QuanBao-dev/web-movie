import { BehaviorSubject } from "rxjs";
const initialState = {
  currentPageBoxMovie: 1,
  currentPageUpdatedMovie: 1,
  updatedMovie: [],
  boxMovie: [],
  lastPageUpdatedMovie: 1,
  lastPageBoxMovie: 1,
  subNavToggle: null,
  triggerFetch:false
};
const behaviorSubject = new BehaviorSubject(initialState);

let state = initialState;

const updatedAnimeStore = {
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

export default updatedAnimeStore;
