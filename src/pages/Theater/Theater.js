import "./Theater.css";

import loadable from "@loadable/component";
import Axios from "axios";
import React, { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, Route, Switch } from "react-router-dom";

import Input from "../../components/Input/Input";
import { theaterStream } from "../../epics/theater";
import { useFetchRoomData, useInitTheaterState } from "../../Hook/theater";
import {
  updateAllowFetchCurrentRoomDetail,
  updateAllowFetchRooms,
  updateSignIn,
} from "../../store/theater";

const Toggle = loadable(() => import("../../components/Toggle/Toggle"));
const TheaterWatch = loadable(
  () => import("../../pages/TheaterWatch/TheaterWatch"),
  {
    fallback: <i className="fas fa-spinner fa-9x fa-spin"></i>,
  }
);

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
  useInitTheaterState(
    socket,
    setTheaterState,
    setFilterKeyRoom,
    inputSearchRoom
  );
  useFetchRoomData(
    socket,
    theaterState,
    cookies,
    buttonSubmitRef,
    inputRoomNameRef,
    inputPasswordRef
  );
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
                // socket.emit("disconnect-custom");
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
            inputPasswordRef.current.value = "";
            theaterStream.updateData({
              rooms: [...theaterStream.currentState().rooms, res.data.message],
            });
          } catch (error) {
            if (error.response.data.error.toLowerCase().includes("roomname")) {
              setRoomNameError(error.response.data.error);
              inputRoomNameRef.current.value = "";
            } else {
              setRoomNameError(null);
              inputRoomNameRef.current.value = "";
              inputPasswordRef.current.value = "";
            }
            if (error.response.data.error.toLowerCase().includes("password")) {
              setPasswordError(error.response.data.error);
              inputPasswordRef.current.value = "";
            } else {
              inputRoomNameRef.current.value = "";
              inputPasswordRef.current.value = "";
              setPasswordError(null);
            }
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
