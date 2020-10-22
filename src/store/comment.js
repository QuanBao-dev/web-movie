import { BehaviorSubject } from "rxjs";

const initialState = {
  messages: [],
  currentPage: 1,
  numberCommentOfEachPage: 5,
  indexInputDisplayBlock: null,
  malId: null,
  shouldFetchComment: true,
  currentName:"",
  lastPageComment:1,
  triggerFetch:0
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
    return ans || initialState;
  },
  updateMessages: (messages,lastPage) => {
    state = {
      ...state,
      messages: messages,
      lastPageComment:lastPage
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
  },
  updateTriggerFetch:(bool) => {
    state={
      ...state,
      triggerFetch:bool,
      messages:[],
      lastPageComment:1
    };
    behaviorSubject.next(state)
  },
  resetComments:()=>{
    state={
      ...state,
      messages:[],
      currentPage:1,
      lastPageComment:1
    };
    behaviorSubject.next(state)
  }
};

export const updateCurrentName = (name) => {
  state.currentName = name;
}
export default chatStore;
