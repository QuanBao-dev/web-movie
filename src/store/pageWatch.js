import { BehaviorSubject } from "rxjs";
const behaviorSubject = new BehaviorSubject();
const initialState = {
  episodes:[],
};
let state = initialState;

const pageWatchStore = {
  initialState,
  currentState: () => {
    let current;
    behaviorSubject.subscribe((v) => (current = v));
    return current;
  },
  subscribe: (setState) => behaviorSubject.subscribe((v) => setState(v)),
  init: () => {
    behaviorSubject.next(state);
  },
  updateEpisodes : (data) =>{
    state = {
      ...state,
      episodes:[...data],
    }
    behaviorSubject.next(state)
  }
};

export const allowShouldFetchEpisodeMovie = (bool) => {
  state.shouldFetchEpisodeMovie = bool;
}

export default pageWatchStore;
