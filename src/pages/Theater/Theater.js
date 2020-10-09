import "./Theater.css";

import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, Route, Switch } from "react-router-dom";
import { asyncScheduler, fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";

import Input from "../../components/Input/Input";
import Toggle from "../../components/Toggle/Toggle";
import {
  fetchRoomsData$,
  theaterStream,
  validateForm$,
} from "../../epics/theater";
import TheaterWatch from "../../pages/TheaterWatch/TheaterWatch";
import {
  updateAllowFetchCurrentRoomDetail,
  updateAllowFetchRooms,
  updateAllowUserJoin,
  updateSignIn,
} from "../../store/theater";

const socket = theaterStream.socket;
const Theater = (props) => {
  const locationPath = props.location.pathname.replace(/\/theater\//g, "");
  const [theaterState, setTheaterState] = useState(theaterStream.initialState);
  const [cookies] = useCookies(["idCartoonUser"]);
  const [roomNameError, setRoomNameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [filterKeyRoom, setFilterKeyRoom] = useState("");
  const inputRoomNameRef = useRef();
  const inputPasswordRef = useRef();
  const buttonSubmitRef = useRef();
  const inputSearchRoom = useRef();
  useEffect(() => {
    if (!socket.connected) theaterStream.socket.connect();
    const subscription = fromEvent(inputSearchRoom.current, "input")
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
      subscription.unsubscribe();
    };
  }, []);
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
  // toggleAnimation(theaterState);
  return (
    <div className="container-theater-watch">
      <Toggle mode={theaterState.modeRoom} />
      <div
        className="container-room"
        style={{
          borderRight:
            theaterState.modeRoom === 1 ? "1px solid #ffffff70" : "none",
          maxWidth: theaterState.modeRoom === 1 ? "300px" : "0",
          minWidth: theaterState.modeRoom === 1 ? "300px" : "0",
        }}
      >
        <RoomList
          rooms={theaterState.rooms.filter((room) =>
            room.roomName.toLocaleLowerCase().includes(filterKeyRoom)
          )}
          locationPath={locationPath}
          inputSearchRoom={inputSearchRoom}
        />
        <InputCreateRoom
          inputRoomNameRef={inputRoomNameRef}
          inputPasswordRef={inputPasswordRef}
          buttonSubmitRef={buttonSubmitRef}
          cookies={cookies}
          roomNameError={roomNameError}
          passwordError={passwordError}
          setRoomNameError={setRoomNameError}
          setPasswordError={setPasswordError}
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

function RoomList({ rooms, locationPath, inputSearchRoom }) {
  return (
    <div className="container-room-list">
      <Input label={"Search room"} input={inputSearchRoom} />
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
  roomNameError,
  passwordError,
  setRoomNameError,
  setPasswordError,
}) {
  return (
    <div className="input-room-layout">
      <h1>Create Room</h1>
      <Input label="Room Name" input={inputRoomNameRef} error={roomNameError} />
      <Input
        label="Password"
        type="password"
        input={inputPasswordRef}
        error={passwordError}
      />
      <button
        className="btn btn-primary"
        onClick={async () => {
          const data = {
            roomName: inputRoomNameRef.current.value,
            password: inputPasswordRef.current.value,
          };
          buttonSubmitRef.current.disabled = true;
          try {
            const res = await Axios.post("/api/theater", data, {
              headers: {
                authorization: `Bearer ${cookies.idCartoonUser}`,
              },
            });
            socket.emit("create-new-room");
            updateAllowFetchRooms(true);
            inputRoomNameRef.current.value = "";
            inputPasswordRef.current.value = ""
            theaterStream.addRoomTheater(res.data.message);
          } catch (error) {
            if (error.response.data.error.toLowerCase().includes("roomname")) {
              setRoomNameError(error.response.data.error);
              inputRoomNameRef.current.value = "";
            } else {
              setRoomNameError(null);
              inputRoomNameRef.current.value = "";
              inputPasswordRef.current.value = ""
            }
            if (error.response.data.error.toLowerCase().includes("password")) {
              setPasswordError(error.response.data.error);
              inputPasswordRef.current.value = ""
            } else {
              inputRoomNameRef.current.value = "";
              inputPasswordRef.current.value = "";
              setPasswordError(null);
            };
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
