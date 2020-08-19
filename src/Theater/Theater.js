import "./Theater.css";

import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, Route, Switch } from "react-router-dom";

import Input from "../components/Input/Input";
import TheaterWatch from "../components/TheaterWatch/TheaterWatch";
import {
  fetchRoomsData$,
  theaterStream,
  validateForm$,
} from "../epics/theater";
import { updateAllowFetchCurrentRoomDetail, updateAllowFetchRooms, updateSignIn } from "../store/theater";
import Axios from "axios";

const socket = theaterStream.socket;
const Theater = (props) => {
  const locationPath = props.location.pathname.replace(/\/theater\//g, "");
  const [theaterState, setTheaterState] = useState(theaterStream.initialState);
  const [cookies] = useCookies(["idCartoonUser"]);
  const inputRoomNameRef = useRef();
  const inputPasswordRef = useRef();
  const buttonSubmitRef = useRef();
  useEffect(() => {
    const subscription = theaterStream.subscribe(setTheaterState);
    theaterStream.init();
    if (theaterState.allowFetchRooms) {
      fetchRoomsData$(cookies.idCartoonUser).subscribe((rooms) => {
        theaterStream.updateRoomsTheater(rooms);
        updateAllowFetchRooms(false);
      });
    }
    socket.on("fetch-data-rooms", () => {
      if (theaterState.allowFetchRooms) {
        fetchRoomsData$(cookies.idCartoonUser).subscribe((rooms) => {
          theaterStream.updateRoomsTheater(rooms);
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
      subscription.unsubscribe();
      validationFormSub.unsubscribe();
    };
  }, [cookies.idCartoonUser, theaterState.allowFetchRooms]);
  // console.log(theaterState);
  return (
    <div className="container-theater-watch">
      <div className="container-room">
        <div className="container-room-list">
          {theaterState.rooms &&
            theaterState.rooms.map((room, index) => {
              return (
                <Link
                  to={`/theater/${room.groupId}`}
                  className={`room-link-item${
                    locationPath === room.groupId ? " active-link" : ""
                  }`}
                  onClick={() => {
                    updateSignIn(false);
                    updateAllowFetchCurrentRoomDetail(true);
                  }}
                  key={index}
                >
                  <div>{room.roomName}</div>
                </Link>
              );
            })}
        </div>
        <div className="input-room-layout">
          <Input label="Room Name" input={inputRoomNameRef} />
          <Input label="Password" type="password" input={inputPasswordRef} />
          <button
            className="btn btn-primary"
            onClick={async () => {
              const data = {
                roomName: inputRoomNameRef.current.value,
                password: inputPasswordRef.current.value,
              };
              inputRoomNameRef.current.value = "";
              inputPasswordRef.current.value = "";
              buttonSubmitRef.current.disabled = true;
              try {
                const res = await Axios.post("/api/theater", data, {
                  headers: {
                    authorization: `Bearer ${cookies.idCartoonUser}`,
                  },
                });
                socket.emit("create-new-room");
                updateAllowFetchRooms(true);
                theaterStream.addRoomTheater(res.data.message);
              } catch (error) {
                console.error(error);
              }
            }}
            ref={buttonSubmitRef}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="container-watch-interface">
        <Switch>
          <Route path="/theater/:groupId" component={TheaterWatch} />
        </Switch>
      </div>
    </div>
  );
};

export default Theater;
