import { BehaviorSubject } from "rxjs";

const initialState = {
  messages: [],
  currentPage: 1,
  indexInputDisplayBlock: null,
};

const behaviorSubject = new BehaviorSubject();
let state = initialState;
const chatStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  init: () => {
    behaviorSubject.next(state);
  },
  updateMessage: (newMessage, index) => {
    console.log(state.messages[index]);
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
          console.log({suitablePositionToAdd});
          break;
        }
      }
    }
    console.log(suitablePositionToAdd);
    state = {
      ...state,
      messages: [
        ...state.messages.slice(0, suitablePositionToAdd),
        newMessage,
        ...state.messages.slice(suitablePositionToAdd, state.messages.length),
      ],
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
};

export default chatStore;
