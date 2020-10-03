import { BehaviorSubject } from "rxjs";
const initialState = {
  imgsMessage: [],
  isInBottomChatBot:true
};

const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;
const messageInputStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  init: () => {
    state = {
      ...state,
      imgsMessage: [],
      isInBottomChatBot:true
    };
    behaviorSubject.next(state);
  },
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => (ans = v));
    return ans;
  },
  updateImgsMessage: (newImage) => {
    state = {
      ...state,
      imgsMessage: [...state.imgsMessage, newImage],
    };
    behaviorSubject.next(state);
  },
  deleteImageByIndex: (index) => {
    state = {
      ...state,
      imgsMessage: [
        ...state.imgsMessage.slice(0, index),
        ...state.imgsMessage.slice(index+1, state.imgsMessage.length),
      ],
    };
    behaviorSubject.next(state);
  },
  updateIsInBottomChatBot:(bool) => {
    state = {
      ...state,
      isInBottomChatBot: bool,
    };
    behaviorSubject.next(state);
  }
};

export default messageInputStore;
