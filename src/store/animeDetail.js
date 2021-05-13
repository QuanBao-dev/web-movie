import { BehaviorSubject } from "rxjs";

const initialState = {
  dataInformationAnime: {},
  dataVideoPromo: [],
  dataEpisodesAnime: {},
  dataLargePicture: "",
  dataLargePictureList: [],
  boxMovie: null,
  malId: null,
  dataRelatedAnime: [],
  pageRelated: 1,
  isLoadingCharacter: null,
  isLoadingInfoAnime: null,
  isLoadingVideoAnime: null,
  isLoadingLargePicture: null,
  isLoadingEpisode: null,
  isLoadingRelated: null,
};
const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;
const nameStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  init: () => {
    behaviorSubject.next(state);
  },
  updateIsLoading: (
    bool,
    key = "isLoadingCharacter" ||
      "isLoadingInfoAnime" ||
      "isLoadingVideoAnime" ||
      "isLoadingLargePicture" ||
      "isLoadingEpisode" ||
      "isLoadingRelated"
  ) => {
    state = {
      ...state,
      [key]: bool,
    };
    behaviorSubject.next(state);
  },
  resetState: () => {
    state = {
      ...initialState,
    };
    behaviorSubject.next(state);
  },
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => (ans = v));
    return ans || initialState;
  },
  updateData: (object = initialState) => {
    state = {
      ...state,
      ...object,
    };
    behaviorSubject.next(state);
  },
};

export default nameStore;
