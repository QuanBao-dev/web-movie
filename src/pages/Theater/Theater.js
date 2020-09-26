import "./Theater.css";

import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, Route, Switch } from "react-router-dom";

import Input from "../../components/Input/Input";
import TheaterWatch from "../../components/TheaterWatch/TheaterWatch";
import {
  fetchRoomsData$,
  theaterStream,
  validateForm$,
} from "../../epics/theater";
import {
  updateAllowFetchCurrentRoomDetail,
  updateAllowFetchRooms,
  updateSignIn,
} from "../../store/theater";
import Axios from "axios";
import Toggle from "../../components/Toggle/Toggle";
import { of, timer } from "rxjs";
import { switchMap } from "rxjs/operators";

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
  toggleAnimation(theaterState);
  return (
    <div className="container-theater-watch">
      <Toggle mode={theaterState.modeRoom} />
      <div
        className="container-room"
        style={{
          display: "block",
          transition: "0.3s linear",
          transform:
            theaterState.modeRoom === 1
              ? "translate(0,0)"
              : "translate(-350px,0)",
        }}
      >
        <RoomList rooms={theaterState.rooms} locationPath={locationPath} />
        <InputCreateRoom
          inputRoomNameRef={inputRoomNameRef}
          inputPasswordRef={inputPasswordRef}
          buttonSubmitRef={buttonSubmitRef}
          cookies={cookies}
        />
      </div>
      <div className="container-watch-interface">
        <Switch>
          <Route path="/theater/:groupId" component={TheaterWatch} />
        </Switch>
      </div>
    </div>
  );
};

function toggleAnimation(theaterState) {
  const e = document.querySelector(".container-room");
  timer(300)
    .pipe(
      switchMap(() => {
        // console.log(theaterState.modeRoom);
        if (theaterState.modeRoom === 0) {
          return of("none");
        };
        return of("block");
      })
    )
    .subscribe((v) => {
      if (e) {
        e.style.display = v;
      }
    });
}

function RoomList({ rooms, locationPath }) {
  return (
    <div className="container-room-list">
      {rooms &&
        rooms.map((room, index) => {
          return (
            <Link
              to={`/theater/${room.groupId}`}
              className={`room-link-item${
                locationPath === room.groupId ? " active-link" : ""
              }`}
              onClick={() => {
                updateSignIn(false);
                updateAllowFetchCurrentRoomDetail(true);
                socket.emit("disconnect-custom");
              }}
              key={index}
            >
              <div style={{ display: "flex", paddingRight: "1.2rem" }}>
                {room.roomName}
              </div>
            </Link>
          );
        })}
    </div>
  );
}

function InputCreateRoom({
  inputRoomNameRef,
  inputPasswordRef,
  buttonSubmitRef,
  cookies,
}) {
  return (
    <div className="input-room-layout">
      <h1>Create Room</h1>
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
            alert(error.response.data.error);
          }
        }}
        ref={buttonSubmitRef}
      >
        Submit
      </button>
    </div>
  );
}

export default Theater;
