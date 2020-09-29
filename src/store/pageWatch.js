import { BehaviorSubject } from "rxjs";
const behaviorSubject = new BehaviorSubject();
const initialState = {
  episodes:[],
  reviewsData:[],
  pageReviewsData:1,
  pageReviewsOnDestroy:null,
  isStopFetchingReviews:false,
  shouldUpdatePageReviewData: false,
  previousMalId:null
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

  updateReviewsData:(data) => {
    state={
      ...state,
      reviewsData:[...state.reviewsData,...data]
    };
    behaviorSubject.next(state);
  },

  resetReviewsData:() => {
    state = {
      ...state,
      reviewsData:[],
      pageReviewsData:1,
      isStopFetchingReviews:false,
    };
    behaviorSubject.next(state)
  },

  updatePageReviewsOnDestroy:(page) => {
    state={
      ...state,
      pageReviewsOnDestroy:page
    };
    behaviorSubject.next(state);
  },
  
  allowUpdatePageReviewsData:(bool) => {
    state={
      ...state,
      shouldUpdatePageReviewData:bool
    };
    behaviorSubject.next(state);
  },

  updateIsStopFetching:(bool) => {
    state={
      ...state,
      isStopFetchingReviews:bool
    };
    behaviorSubject.next(state)
  },

  updatePageReview:(page) => {
    state={
      ...state,
      pageReviewsData:page
    };
    behaviorSubject.next(state);
  },

  updatePreviousMalId:(malId) => {
    state={
      ...state,
      previousMalId:malId
    }
    behaviorSubject.next(state);
  },

  updateEpisodes : (data) =>{
    state = {
      ...state,
      episodes:{...data},
    }
    behaviorSubject.next(state)
  }
};

export default pageWatchStore;
