import { useEffect } from "react";
import { fetchRoomData, initTheaterState } from "../Functions/theater";
export const useInitTheaterState = (
  socket,
  setTheaterState,
  setFilterKeyRoom,
  inputSearchRoom
) => {
  useEffect(
    initTheaterState(
      socket,
      setTheaterState,
      setFilterKeyRoom,
      inputSearchRoom
    ),
    []
  );
};

export const useFetchRoomData = (
  socket,
  theaterState,
  cookies,
  buttonSubmitRef,
  inputRoomNameRef,
  inputPasswordRef
) => {
  useEffect(
    fetchRoomData(
      socket,
      theaterState,
      cookies,
      buttonSubmitRef,
      inputRoomNameRef,
      inputPasswordRef
    ),
    [cookies.idCartoonUser, theaterState.allowFetchRooms]
  );
};