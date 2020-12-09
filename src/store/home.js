import { BehaviorSubject } from "rxjs";
const initialState = {
  isLoading: true,
  dataFilter: [],
  textSearch: "",
  dataCarousel: [],
};
const behaviorSubject = new BehaviorSubject(initialState);

let state = initialState;

const homeStore = {
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
    behaviorSubject.next(state);
  },
};

export default homeStore;
