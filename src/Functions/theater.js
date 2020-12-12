import { asyncScheduler, fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";

import { updateAllowFetchRooms, updateAllowUserJoin } from "../store/theater";
import {
  fetchRoomsData$,
  theaterStream,
  validateForm$,
} from "../epics/theater";

export const initTheaterState = (
  socket,
  setTheaterState,
  setFilterKeyRoom,
  inputSearchRoom
) => {
  return () => {
    if (!socket.connected) theaterStream.socket.connect();
    const subscription = theaterStream.subscribe(setTheaterState);
    theaterStream.init();
    const subscription1 = fromEvent(inputSearchRoom.current, "input")
      .pipe(
        throttleTime(400, asyncScheduler, {
          leading: true,
          trailing: true,
        })
      )
      .subscribe((e) => {
        setFilterKeyRoom(e.target.value);
      });
    return () => {
      theaterStream.socket.emit("disconnect-custom");
      if (socket.connected) theaterStream.socket.close();
      updateAllowUserJoin(false);
      subscription1.unsubscribe();
      subscription.unsubscribe();
    };
  };
};

export const fetchRoomData = (
  socket,
  theaterState,
  cookies,
  buttonSubmitRef,
  inputRoomNameRef,
  inputPasswordRef
) => {
  return () => {
    if (theaterState.allowFetchRooms) {
      fetchRoomsData$(cookies.idCartoonUser).subscribe((rooms) => {
        theaterStream.updateData({ rooms });
        updateAllowFetchRooms(false);
      });
    }
    socket.on("fetch-data-rooms", () => {
      if (theaterState.allowFetchRooms) {
        fetchRoomsData$(cookies.idCartoonUser).subscribe((rooms) => {
          theaterStream.updateData({ rooms });
          updateAllowFetchRooms(false);
        });
      }
    });
    const validationFormSub = validateForm$(
      buttonSubmitRef.current,
      inputRoomNameRef.current,
      inputPasswordRef.current
    ).subscribe();
    ///TODO create new room
    return () => {
      validationFormSub.unsubscribe();
    };
  };
};
