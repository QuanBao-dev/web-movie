import { BehaviorSubject } from "rxjs";

const initialState = {
  randomAnimeList: [],
  isLoading: true
};
const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;
const randomAnimeListStore = {
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((state) => (ans = state));
    return ans || initialState;
  },
  updateData: (obj = initialState) => {
    state = {
      ...state,
      ...obj,
    };
    behaviorSubject.next(state);
  },
};

export default randomAnimeListStore;
