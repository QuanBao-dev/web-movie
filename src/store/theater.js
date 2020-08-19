import { BehaviorSubject } from "rxjs";
import io from "socket.io-client";
const behaviorSubject = new BehaviorSubject();
const initialState = {
  rooms: [],
  allowFetchRooms: true,
  currentRoomDetail: null,
  isSignIn: false,
  notifications: [],
  roomsLoginId: [],
  allowFetchCurrentRoomDetail: true,
  usersOnline: [],
};
let state = initialState;
const theaterStore = {
  initialState,
  socket: io(`https://my-web-movie.herokuapp.com`,{
    transports: ['websocket']
  }),
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  currentState: () => {
    let temp;
    behaviorSubject.subscribe((v) => (temp = v));
    return temp;
  },
  init: () => {
    behaviorSubject.next(state);
  },
  updateRoomsTheater: (rooms) => {
    state = {
      ...state,
      rooms: [...rooms],
    };
    behaviorSubject.next(state);
  },

  addRoomTheater: (room) => {
    state = {
      ...state,
      rooms: [...state.rooms, room],
    };
    behaviorSubject.next(state);
  },

  updateCurrentRoomDetail: (room) => {
    state = {
      ...state,
      currentRoomDetail: { ...room },
    };
    behaviorSubject.next(state);
  },

  updateRoomsLoginId: (groupId) => {
    state = {
      ...state,
      roomsLoginId: [...state.roomsLoginId, groupId],
    };
    behaviorSubject.next(state);
  },

  updateUsersOnline: (users) => {
    state = {
      ...state,
      usersOnline: [...users],
    };
    behaviorSubject.next(state);
  },
};

export const updateAllowFetchRooms = (bool) => {
  state.allowFetchRooms = bool;
};

export const updateSignIn = (bool) => {
  state.isSignIn = bool;
};

export const updateAllowFetchCurrentRoomDetail = (bool) => {
  state.allowFetchCurrentRoomDetail = bool;
};

export default theaterStore;
