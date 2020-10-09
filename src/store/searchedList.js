import { BehaviorSubject } from "rxjs";
const initialState = {
  page:1,
  previousKey:""
}
const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;
const searchedListStore = {
  initialState,
  subscribe:(setState) => behaviorSubject.subscribe(setState),
  init:() => behaviorSubject.next(state),
  currentState:() => {
    let ans;
    behaviorSubject.subscribe((v) => ans = v);
    return ans || initialState
  },
  updatePage:(page) => {
    state = {
      ...state,
      page
    };
    behaviorSubject.next(state);
  },
  updatePreviousKey:(key) => {
    state={
      ...state,
      previousKey:key
    };
    behaviorSubject.next(state);
  }
}

export default searchedListStore;