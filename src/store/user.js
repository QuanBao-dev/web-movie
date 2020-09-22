import { BehaviorSubject } from "rxjs";
const behaviorSubject = new BehaviorSubject();
const initialState = undefined;
let state = initialState;

const userStore = {
  initialState,
  currentState:() => {
    let current;
    behaviorSubject.subscribe(v => current = v);
    return current;
  },
  subscribe:(setState) =>  behaviorSubject.subscribe((v) => setState(v)),
  init:() => behaviorSubject.next(state),
  updateUser: (user) =>{
    state = user;
    behaviorSubject.next(state);
  },
  updateAvatarUser:(image) => {
    state = {
      ...state,
      avatarImage:image
    };
    behaviorSubject.next(state);
  }
}

export default userStore;