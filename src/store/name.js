import { BehaviorSubject } from "rxjs";

const initialState = {
  dataInformationAnime: {},
  dataVideoPromo: [],
  dataEpisodesAnime: {},
  dataLargePicture: "",
  boxMovie: null,
};
const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;
const nameStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  init: () => {
    state = {
      ...initialState,
    };
    behaviorSubject.next(state);
  },
  updateBoxMovie: (data) => {
    state = {
      ...state,
      boxMovie: data === null ? null:{ ...data },
    };
    behaviorSubject.next(state);
  },
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => (ans = v));
    return ans || initialState;
  },
  updateDataInfoAnime: (data) => {
    state = {
      ...state,
      dataInformationAnime: { ...data },
    };
    behaviorSubject.next(state);
  },
  updateDataVideoPromo: (data) => {
    state = {
      ...state,
      dataVideoPromo: [...data],
    };
    behaviorSubject.next(state);
  },
  updateDataEpisodesAnime: (data) => {
    state = {
      ...state,
      dataEpisodesAnime: { ...data },
    };
    behaviorSubject.next(state);
  },
  updateDataLargePicture: (url) => {
    state = {
      ...state,
      dataLargePicture: url,
    };
    behaviorSubject.next(state);
  },
};

export default nameStore;
