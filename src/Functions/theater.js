import { asyncScheduler, fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";

import { updateAllowFetchRooms, updateAllowUserJoin } from "../store/theater";
import {
  fetchRoomsData$,
  theaterStream,
  validateForm$,
} from "../epics/theater";

export const initTheaterState = (
  setTheaterState,
  setFilterKeyRoom,
  inputSearchRoom
) => {
  return () => {
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
      // theaterStream.socket.emit("disconnect-custom");
      updateAllowUserJoin(false);
      subscription1.unsubscribe();
      subscription.unsubscribe();
    };
  };
};

export const fetchRoomData = (
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
    // socket.on("fetch-data-rooms", () => {
    //   if (theaterState.allowFetchRooms) {
    //     fetchRoomsData$(cookies.idCartoonUser).subscribe((rooms) => {
    //       theaterStream.updateData({ rooms });
    //       updateAllowFetchRooms(false);
    //     });
    //   }
    // });
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
