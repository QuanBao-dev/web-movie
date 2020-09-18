const { BehaviorSubject } = require("rxjs");

const behaviorSubject = new BehaviorSubject();
const initialState = {
  role: null,
  page: 1,
  numberDisplay: 12,
};
let state = initialState;
const characterStore = {
  initialState,
  init: () => {
    behaviorSubject.next(state);
  },
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => (ans = v));
    return ans;
  },
  updateRole: (role) => {
    state = {
      ...state,
      role: role,
    };
    behaviorSubject.next(state);
  },
  updatePage: (page) => {
    state = {
      ...state,
      page,
    };
    behaviorSubject.next(state);
  },
};

export default characterStore;
