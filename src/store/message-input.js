import { BehaviorSubject } from "rxjs";
const initialState = {
  imgsMessage: [],
};

const behaviorSubject = new BehaviorSubject(initialState);
let state = initialState;
const messageInputStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  init: () => {
    state = {
      imgsMessage: [],
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
      imgsMessage: [...state.imgsMessage, newImage],
    };
    behaviorSubject.next(state);
  },
  deleteImageByIndex: (index) => {
    state = {
      imgsMessage: [
        ...state.imgsMessage.slice(0, index),
        ...state.imgsMessage.slice(index+1, state.imgsMessage.length),
      ],
    };
    behaviorSubject.next(state);
  },
};

export default messageInputStore;
