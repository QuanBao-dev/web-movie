import { BehaviorSubject } from "rxjs";
const behaviorSubject = new BehaviorSubject();
const initialState = {
  users: [],
  shouldFetchAllUsers: true,
  usersFilter:[],
};

let state = initialState;

const adminStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe((v) => setState(v)),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => {
      ans = v;
    });
    return ans;
  },
  init: () => {
    behaviorSubject.next(state);
  },
  updateUsers: (data) => {
    state = {
      ...state,
      users: [...data],
    };
    behaviorSubject.next(state);
  },

  updateUsersFilter: (data) => {
    state = {
      ...state,
      usersFilter: [...data],
    };
    behaviorSubject.next(state);
  },
};

export const allowShouldFetchAllUser = (bool) => {
  state.shouldFetchAllUsers = bool;
};

export default adminStore;
