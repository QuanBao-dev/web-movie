import { BehaviorSubject } from "rxjs";
const behaviorSubject = new BehaviorSubject();
const initialState = {
  isShowBlockPopUp: false,
};

let state = initialState;

const navBarStore = {
  initialState,
  init:() =>{
    behaviorSubject.next(state);
  },
  subscribe: (setState) => behaviorSubject.subscribe((v) => setState(v)),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => {
      ans = v;
    });
    return ans;
  },
  updateIsShowBlockPopUp: (bool) => {
    state = {
      ...state,
      isShowBlockPopUp: bool,
    };
    behaviorSubject.next(state);
  },
};

export default navBarStore;
