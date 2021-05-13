const { BehaviorSubject } = require("rxjs");

const behaviorSubject = new BehaviorSubject();
const initialState = {
  role: null,
  page: 1,
  numberDisplay: 12,
  dataCharacter:[],
  dataCharacterRaw: [],
  keyFilter: "",
};
let state = initialState;
const characterStore = {
  initialState,
  updateData: (object = initialState) => {
    state = {
      ...state,
      ...object
    };
    behaviorSubject.next(state);
  },
  init: () => {
    behaviorSubject.next(state);
  },
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => (ans = v));
    return ans || initialState; 
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
