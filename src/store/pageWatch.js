import { BehaviorSubject } from "rxjs";
const initialState = {
  episodes: {},
  reviewsData: [],
  pageReviewsData: 1,
  pageReviewsOnDestroy: null,
  isStopFetchingReviews: false,
  shouldUpdatePageReviewData: false,
  previousMalId: null,
  pageSplit: 1,
  title: null,
  malId: null,
  imageUrl: null,
};
const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;

const pageWatchStore = {
  initialState,
  currentState: () => {
    let current;
    behaviorSubject.subscribe((v) => (current = v));
    return current || initialState;
  },
  subscribe: (setState) => behaviorSubject.subscribe((v) => setState(v)),
  init: () => {
    behaviorSubject.next(state);
  },
  updateInfoPageWatch: (malId) => {
    state = {
      ...state,
      malId,
    };
    behaviorSubject.next(state);
  },
  resetState: () => {
    state = {
      ...state,
      episodes: {},
      malId: null,
    };
    behaviorSubject.next(state);
  },
  updateTitle: (title) => {
    state = {
      ...state,
      title,
    };
    behaviorSubject.next(state);
  },
  updateImageUrl: (imageUrl) => {
    state = {
      ...state,
      imageUrl,
    };
    behaviorSubject.next(state);
  },
  updatePageSplit: (page) => {
    state = {
      ...state,
      pageSplit: page,
    };
    behaviorSubject.next(state);
  },

  updateReviewsData: (data) => {
    state = {
      ...state,
      reviewsData: data,
    };
    behaviorSubject.next(state);
  },

  resetReviewsData: () => {
    state = {
      ...state,
      reviewsData: [],
      pageReviewsData: 1,
      pageSplit: 1,
      isStopFetchingReviews: false,
    };
    behaviorSubject.next(state);
  },

  updatePageReviewsOnDestroy: (page) => {
    state = {
      ...state,
      pageReviewsOnDestroy: page,
    };
    behaviorSubject.next(state);
  },

  allowUpdatePageReviewsData: (bool) => {
    state = {
      ...state,
      shouldUpdatePageReviewData: bool,
    };
    behaviorSubject.next(state);
  },

  updateIsStopFetching: (bool) => {
    state = {
      ...state,
      isStopFetchingReviews: bool,
    };
    behaviorSubject.next(state);
  },

  updatePageReview: (page) => {
    state = {
      ...state,
      pageReviewsData: page,
    };
    behaviorSubject.next(state);
  },

  updatePreviousMalId: (malId) => {
    state = {
      ...state,
      previousMalId: malId,
    };
    behaviorSubject.next(state);
  },

  updateEpisodes: (data) => {
    state = {
      ...state,
      episodes: { ...data },
    };
    behaviorSubject.next(state);
  },
};

export default pageWatchStore;
