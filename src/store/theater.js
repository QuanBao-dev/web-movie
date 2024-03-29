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
  modeRoom: 1,
  userId: null,
  allowRemoveVideoWatch: true,
  allowUserJoin: true,
  unreadMessage: 0,
  groupId: null,
  timePlayingVideo: 0,
  videoUrl: null,
  isVideoCall: false,
  isControlVideoWatching: false,
  isReconnect: false,
  isTriggerReconnect: false,
  isVideoWatchPlaying: false,
  peerId: null,
  isDisableReconnectButton: false,
};
let state = initialState;
const theaterStore = {
  initialState,
  socket: io.connect(
    process.env.NODE_ENV === "development" ? "localhost:5000" : "/",
    {
      upgrade: false,
      transports: ["websocket"],
    }
  ),
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  currentState: () => {
    let temp;
    behaviorSubject.subscribe((v) => (temp = v));
    return temp || initialState;
  },
  init: () => {
    behaviorSubject.next(state);
  },
  updateData: (object = initialState) => {
    state = {
      ...state,
      ...object,
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

export const updateUserIdNow = (string) => {
  state.userId = string;
};

export const updateAllowRemoveVideoWatch = (bool) => {
  state.allowRemoveVideoWatch = bool;
};

export const updateAllowUserJoin = (bool) => {
  state.allowUserJoin = bool;
};

export default theaterStore;
