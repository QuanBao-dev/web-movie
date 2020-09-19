import "./App.css";

import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import {
  BrowserRouter as Router,
  NavLink as Link,
  Route,
  Switch,
} from "react-router-dom";

import EpisodePage from "./EpisodePage/EpisodePage";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Name from "./Name/Name";
import Register from "./Register/Register";
import { fetchingUser$, userStream } from "./epics/user";
import AdminManager from "./AdminManager/AdminManager";
import { allowShouldFetchAllUser } from "./store/admin";
import EditUser from "./EditUser/EditUser";
import Theater from "./Theater/Theater";
import { theaterStream } from "./epics/theater";
import { allowUpdatedMovie } from "./store/home";
import navBarStore from "./store/navbar";
import SearchedList from "./Search/SearchedList";
import { ReplaySubject } from "rxjs";
import CharacterDetail from "./components/CharacterDetail/CharacterDetail";
const scrollSaveSubject = new ReplaySubject(3);
window.addEventListener("resize", () => {
  const e = document.getElementsByClassName("child-nav-bar__app").item(0);
  if (document.body.offsetWidth > 697) {
    e.style.display = "flex";
  } else {
    e.style.display = "none";
  }
});

window.addEventListener("scroll", () => {
  scrollSaveSubject.next(window.scrollY);
  scrollSaveSubject.subscribe((v) => {
    const navBarE = document.querySelector(".nav-bar__app");
    const buttonScrollTopE = document.querySelector(".button-scroll-top");
    if (navBarE)
      if (window.scrollY === 0) {
        navBarE.style.transform = "translateY(0)";
        buttonScrollTopE.style.transform = "translateY(500px)";
      } else if (v - window.scrollY < -1) {
        navBarE.style.transform = "translateY(-500px)";
        buttonScrollTopE.style.transform = "translateY(500px)";
      } else if (v - window.scrollY > 1) {
        navBarE.style.transform = "translateY(0)";
        buttonScrollTopE.style.transform = "translateY(0)";
      }
  });
});

function App() {
  const navLoginRef = useRef();
  const navRegisterRef = useRef();
  const [user, setUser] = useState(userStream.initialState);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(["idCartoonUser"]);
  const [toggleNavBarState, setToggleNavBarState] = useState(
    navBarStore.initialState
  );

  useEffect(() => {
    const subscriptionLock = navBarStore.subscribe(setToggleNavBarState);
    navBarStore.init();
    if (toggleNavBarState.isShowBlockPopUp) {
      document.getElementsByTagName("body").item(0).className = "hidden-scroll";
    } else {
      document.getElementsByTagName("body").item(0).className = "";
    }
    const subscription = userStream.subscribe(setUser);
    const fetchingUserSub = fetchingUser$(cookies.idCartoonUser).subscribe();
    return () => {
      fetchingUserSub.unsubscribe();
      subscription.unsubscribe();
      subscriptionLock.unsubscribe();
    };
  }, [cookies.idCartoonUser, toggleNavBarState.isShowBlockPopUp]);
  return (
    <Router>
      {toggleNavBarState.isShowBlockPopUp && (
        <div className="block-pop-up">
          <div className="loading-block">
            <i className="fas fa-spinner fa-9x fa-spin"></i>
            <h1 className="loading-message">Waiting...</h1>
          </div>
        </div>
      )}
      <div
        className="button-scroll-top"
        onClick={() => {
          window.scroll({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <i className="fas fa-arrow-up fa-2x"></i>
      </div>
      <nav className="nav-bar">
        <ul className="nav-bar__app">
          <div
            className="toggle-show__nav"
            onClick={() => {
              const e = document
                .getElementsByClassName("child-nav-bar__app")
                .item(0);
              if (e.style.display === "none") {
                e.style.display = "flex";
              } else {
                e.style.display = "none";
              }
            }}
          >
            <i className="fas fa-bars fa-2x"></i>
          </div>
          <ul className="child-nav-bar__app">
            <li className="nav-bar__item">
              <Link
                to="/"
                activeClassName="active"
                onClick={() => {
                  window.scroll({
                    top: 0,
                    behavior: "smooth",
                  });
                  theaterStream.socket.emit("disconnect-custom");
                  allowUpdatedMovie(true);
                }}
                exact
              >
                Home
              </Link>
            </li>

            {user && user.role === "Admin" && (
              <li className="nav-bar__item">
                <Link
                  to="/admin"
                  onClick={() => {
                    allowShouldFetchAllUser(true);
                    theaterStream.socket.emit("disconnect-custom");
                  }}
                  activeClassName="active"
                >
                  Admin
                </Link>
              </li>
            )}

            {user && (
              <li className="nav-bar__item">
                <Link
                  to="/theater"
                  activeClassName="active"
                  onClick={() => {
                    theaterStream.socket.emit("disconnect-custom");
                  }}
                >
                  Theater
                </Link>
              </li>
            )}

            <li className="left-nav-item nav-bar__item" ref={navLoginRef}>
              {!user && (
                <Link
                  to="/auth/login"
                  activeClassName="active"
                  onClick={() => {
                    theaterStream.socket.emit("disconnect-custom");
                  }}
                >
                  Login
                </Link>
              )}
              {user && (
                <div
                  style={{
                    color: "white",
                    cursor: "pointer",
                    display: "inline",
                  }}
                  onClick={() => {
                    logoutUser(setCookie, cookies.idCartoonUser);
                    theaterStream.socket.emit("disconnect-custom");
                  }}
                >
                  Logout
                </div>
              )}
            </li>

            {!user && (
              <li ref={navRegisterRef} className="nav-bar__item">
                <Link
                  to="/auth/register"
                  activeClassName="active"
                  onClick={() => {
                    theaterStream.socket.emit("disconnect-custom");
                  }}
                >
                  Register
                </Link>
              </li>
            )}
            {user && (
              <li
                style={{ color: "white", cursor: "pointer" }}
                className="nav-bar__item"
              >
                <Link
                  to={`/edit`}
                  onClick={() => {
                    theaterStream.socket.emit("disconnect-custom");
                  }}
                >
                  {user.username}
                </Link>
              </li>
            )}
          </ul>
        </ul>
      </nav>
      <Switch>
        <Route path="/" component={Home} exact />
        {user && user.role === "Admin" && (
          <Route path="/admin" component={AdminManager} exact />
        )}
        <Route path="/anime/search" component={SearchedList} />
        <Route
          path="/anime/:malId/watch/:episode/:mode"
          component={EpisodePage}
        />
        <Route
          path="/anime/character/:characterId"
          component={CharacterDetail}
        />
        <Route path="/anime/:name" component={Name} />
        {user && <Route path="/theater" component={Theater} />}
        {user && <Route path="/edit" component={EditUser} />}
        {!user && <Route path="/auth/login" component={Login} />}
        {!user && <Route path="/auth/register" component={Register} />}
      </Switch>
    </Router>
  );
}

async function logoutUser(setCookie, cookie) {
  try {
    await Axios.delete("/api/users/logout", {
      headers: {
        authorization: `Bearer ${cookie}`,
      },
    });
    setCookie("idCartoonUser", "", {
      expires: new Date(Date.now() - 43200000),
      path: "/",
    });
    userStream.updateUser(undefined);
    // window.location.replace("/");
  } catch (error) {}
}
export default App;
