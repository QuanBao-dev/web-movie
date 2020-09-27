import { BehaviorSubject } from "rxjs";

const initialState = {
  messages: [],
  currentPage: 1,
  numberCommentOfEachPage: 5,
  indexInputDisplayBlock: null,
  malId: null,
  shouldFetchComment: true,
  currentName:"",
};

const behaviorSubject = new BehaviorSubject();
let state = initialState;
const chatStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe((v) => setState(v)),
  init: () => {
    behaviorSubject.next(state);
  },
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => {
      ans = v;
    });
    return ans;
  },
  updateMessages: (messages) => {
    state = {
      ...state,
      messages: [...messages],
    };
    behaviorSubject.next(state);
  },

  updateDeleteMessage: (listDelete = []) => {
    state = {
      ...state,
      messages: state.messages.filter(
        (message, index) => !listDelete.includes(index)
      ),
    };
    behaviorSubject.next(state);
  },

  updateInputDisplayBlock: (index) => {
    state = {
      ...state,
      indexInputDisplayBlock: index,
    };
    behaviorSubject.next(state);
  },

  updateCurrentPage: (page) => {
    state = {
      ...state,
      currentPage:page
    };
    behaviorSubject.next(state);
  }
};

export const allowShouldFetchComment = (bool) =>{
  state.shouldFetchComment = bool;
}
export const updateCurrentName = (name) => {
  state.currentName = name;
}
export default chatStore;
