import { BehaviorSubject } from "rxjs";
const initialState = {};
const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;
const cachesStore = {
  subscribe: (setState) =>
    behaviorSubject.subscribe((value) => setState(value)),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((value) => {
      ans = value;
    });
    return ans;
  },
  updateData: (obj) => {
    state = {
      ...state,
      ...obj,
    };
    behaviorSubject.next(state);
  },
};

export default cachesStore;
