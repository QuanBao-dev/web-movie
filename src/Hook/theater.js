import { useEffect } from "react";
import { fetchRoomData, initTheaterState } from "../Functions/theater";
export const useInitTheaterState = (
  setTheaterState,
  setFilterKeyRoom,
  inputSearchRoom
) => {
  useEffect(
    initTheaterState(
      setTheaterState,
      setFilterKeyRoom,
      inputSearchRoom
    ),
    []
  );
};

export const useFetchRoomData = (
  theaterState,
  cookies,
  buttonSubmitRef,
  inputRoomNameRef,
  inputPasswordRef
) => {
  useEffect(
    fetchRoomData(
      theaterState,
      cookies,
      buttonSubmitRef,
      inputRoomNameRef,
      inputPasswordRef
    ),
    [cookies.idCartoonUser, theaterState.allowFetchRooms]
  );
};