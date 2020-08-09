import { BehaviorSubject } from "rxjs";

const initialState = {
  messages: [],
  currentPage: 1,
  numberCommentOfEachPage: 5,
  indexInputDisplayBlock: null,
  malId: null,
  shouldFetchComment: true
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
  initMessage: (messages) => {
    state = {
      ...state,
      messages: [...messages],
    };
    behaviorSubject.next(state);
  },
  updateMessage: (newMessage, index, isPush = true) => {
    // console.log(state.messages[index]);
    let suitablePositionToAdd = state.messages.length;
    if (index !== null) {
      const marginLeftSource = parseInt(
        state.messages[index].marginLeft.replace(/px/g, "")
      );
      for (let i = index + 1; i < state.messages.length; i++) {
        if (
          marginLeftSource >=
          parseInt(state.messages[i].marginLeft.replace(/px/g, ""))
        ) {
          suitablePositionToAdd = i;
          // console.log({suitablePositionToAdd});
          break;
        }
      }
    }
    // console.log(suitablePositionToAdd);
    if(isPush){
      state = {
        ...state,
        messages: [
          ...state.messages.slice(0, suitablePositionToAdd),
          newMessage,
          ...state.messages.slice(suitablePositionToAdd, state.messages.length),
        ],
      };
    } else {
      state = {
        ...state,
        messages: [
          ...state.messages.slice(suitablePositionToAdd, state.messages.length),
          newMessage,
          ...state.messages.slice(0, suitablePositionToAdd),
        ],
      };
    }
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
export default chatStore;
