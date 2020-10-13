const { BehaviorSubject } = require("rxjs");

const behaviorSubject = new BehaviorSubject();
const initialState = {
  role: null,
  page: 1,
  numberDisplay: 12,
  dataCharacter:[],
};
let state = initialState;
const characterStore = {
  initialState,
  updateDataCharacter:(data)=>{
    state = {
      ...state,
      dataCharacter:data
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
