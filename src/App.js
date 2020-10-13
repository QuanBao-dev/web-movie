import "./App.css";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import loadable from "@loadable/component";
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import {
  BrowserRouter as Router,
  NavLink as Link,
  Route,
  Switch,
} from "react-router-dom";
import { ReplaySubject } from "rxjs";

import { fetchingUser$, userStream } from "./epics/user";
import { allowShouldFetchAllUser } from "./store/admin";
import navBarStore from "./store/navbar";

const Login = loadable(() => import("./pages/Login/Login"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const Register = loadable(() => import("./pages/Register/Register"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});

const ProducerDetail = loadable(
  () => import("./pages/ProducerDetail/ProducerDetail"),
  {
    fallback: (
      <div>
        <LinearProgress color="secondary" />
      </div>
    ),
  }
);
const FAQ = loadable(() => import("./pages/FAQ/FAQ"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const EditUser = loadable(() => import("./pages/EditUser/EditUser"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const AdminManager = loadable(
  () => import("./pages/AdminManager/AdminManager"),
  {
    fallback: (
      <div>
        <LinearProgress color="secondary" />
      </div>
    ),
  }
);
const NotFound = loadable(() => import("./pages/404/NotFound"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const Home = loadable(() => import("./pages/Home/Home"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const Name = loadable(() => import("./pages/Name/Name"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const CharacterDetail = loadable(
  () => import("./pages/CharacterDetail/CharacterDetail"),
  {
    fallback: (
      <div>
        <LinearProgress color="secondary" />
      </div>
    ),
  }
);
const Theater = loadable(() => import("./pages/Theater/Theater"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const EpisodePage = loadable(() => import("./pages/EpisodePage/EpisodePage"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const SearchedList = loadable(() => import("./pages/Search/SearchedList"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});
const PersonDetail = loadable(
  () => import("./pages/PersonDetail/PersonDetail"),
  {
    fallback: (
      <div>
        <LinearProgress color="secondary" />
      </div>
    ),
  }
);
const GenreDetail = loadable(() => import("./pages/GenreDetail/GenreDetail"), {
  fallback: (
    <div>
      <LinearProgress color="secondary" />
    </div>
  ),
});

const scrollSaveSubject = new ReplaySubject(3);
window.addEventListener("resize", () => {
  const e = document.getElementsByClassName("child-nav-bar__app").item(0);
  if (document.body.offsetWidth > 697) {
    e.style.display = "flex";
  } else {
    e.style.display = "none";
  }
  if (window.innerWidth >= 450) {
    document.querySelector("body").style.backgroundImage =
      "url(https://scontent.fsgn3-1.fna.fbcdn.net/v/t1.15752-9/120124610_742264309838772_5338479055684884723_n.png?_nc_cat=111&_nc_sid=b96e70&_nc_ohc=4qKcWuhZKp0AX9pm5SH&_nc_oc=AQnem3joBFmuPKiFbyNxyR_Rg5yOM2Jzq5s_x9W1r4wBgj7fagomZrhxSkvKRue1dfvT4N08LBMbbE0AhQkSRblh&_nc_ht=scontent.fsgn3-1.fna&oh=32153f460cad9694a5c4077bdafa1195&oe=5F90DF07)";
  } else {
    document.querySelector("body").style.backgroundImage = "none";
  }
});

window.addEventListener("scroll", () => {
  scrollSaveSubject.next(window.scrollY);
  scrollSaveSubject.subscribe((v) => {
    const navBarE = document.querySelector(".nav-bar__app");
    const buttonScrollTopE = document.querySelector(".button-scroll-top");
    if (navBarE)
      if (window.scrollY < 70) {
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
if (window.innerWidth >= 450) {
  document.querySelector("body").style.backgroundImage =
    "url(https://scontent.fsgn3-1.fna.fbcdn.net/v/t1.15752-9/120124610_742264309838772_5338479055684884723_n.png?_nc_cat=111&_nc_sid=b96e70&_nc_ohc=4qKcWuhZKp0AX9pm5SH&_nc_oc=AQnem3joBFmuPKiFbyNxyR_Rg5yOM2Jzq5s_x9W1r4wBgj7fagomZrhxSkvKRue1dfvT4N08LBMbbE0AhQkSRblh&_nc_ht=scontent.fsgn3-1.fna&oh=32153f460cad9694a5c4077bdafa1195&oe=5F90DF07)";
}

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
            <CircularProgress color="secondary" size="7rem" />
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
            <i className="fas fa-bars fa-3x"></i>
          </div>
          <ul className="child-nav-bar__app">
            <li className="nav-bar__item">
              <Link to="/" activeClassName="active" exact>
                Home
              </Link>
            </li>

            {user && user.role === "Admin" && (
              <li className="nav-bar__item">
                <Link
                  to="/admin"
                  onClick={() => {
                    allowShouldFetchAllUser(true);
                  }}
                  activeClassName="active"
                >
                  Admin
                </Link>
              </li>
            )}

            {user && (
              <li className="nav-bar__item">
                <Link to="/theater" activeClassName="active">
                  Theater
                </Link>
              </li>
            )}
            <li
              style={{ color: "white", cursor: "pointer" }}
              className="left-nav-item nav-bar__item"
            >
              <Link to="/faq" activeClassName="active">
                FAQ
              </Link>
            </li>
            <li className="nav-bar__item" ref={navLoginRef}>
              {!user && (
                <Link
                  to="/auth/login"
                  activeClassName="active"
                  onClick={() => {}}
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
                    padding: "10px",
                  }}
                  onClick={() => {
                    logoutUser(setCookie, cookies.idCartoonUser);
                    window.location.replace("/");
                  }}
                >
                  Logout
                </div>
              )}
            </li>

            {!user && (
              <li ref={navRegisterRef} className="nav-bar__item">
                <Link to="/auth/register" activeClassName="active">
                  Register
                </Link>
              </li>
            )}
            {user && (
              <li
                style={{ color: "white", cursor: "pointer" }}
                className="nav-bar__item"
              >
                <Link to={`/edit`}>{user.username}</Link>
              </li>
            )}
            {user && (
              <li className="nav-bar__item">
                <div
                  style={{
                    color: "white",
                    cursor: "pointer",
                    display: "inline",
                  }}
                >
                  <img
                    className="avatar-user"
                    src={
                      !user.avatarImage
                        ? "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
                        : user.avatarImage
                    }
                    alt="avatar_user"
                    onClick={() => {
                      document.querySelector(".input-choose-avatar").click();
                    }}
                  />
                  <input
                    className="input-choose-avatar"
                    type="file"
                    onChange={async (e) => {
                      try {
                        if (
                          !["image/png", "image/jpeg", "image/gif"].includes(
                            e.target.files[0].type
                          )
                        ) {
                          return alert("You just can upload image");
                        }
                        const file = await convertImgToBase64(
                          e.target.files[0]
                        );
                        const res = await Axios.put(
                          "/api/users/current/avatar",
                          {
                            avatarImage: file.target.result,
                          },
                          {
                            headers: {
                              authorization: `Bearer ${cookies.idCartoonUser}`,
                            },
                          }
                        );
                        userStream.updateAvatarUser(res.data.message);
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  />
                </div>
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
        <Route path="/faq" component={FAQ} />
        <Route path="/anime/search" component={SearchedList} />
        <Route
          path="/anime/:malId/watch/:episode/:mode"
          component={EpisodePage}
        />
        <Route path="/anime/person/:personId" component={PersonDetail} />
        <Route
          path="/anime/character/:characterId"
          component={CharacterDetail}
        />
        <Route path="/anime/:name" component={Name} />
        <Route path="/genre/:genreId" component={GenreDetail} />
        <Route path="/producer/:producerId" component={ProducerDetail} />
        <Route path="/studio/:producerId" component={ProducerDetail} />
        <Route path="/licensor/:producerId" component={ProducerDetail} />
        {user && <Route path="/theater" component={Theater} />}
        {user && <Route path="/edit" component={EditUser} />}
        {!user && <Route path="/auth/login" component={Login} />}
        {!user && <Route path="/auth/register" component={Register} />}
        <Route path="/*" component={NotFound} />
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

async function convertImgToBase64(files) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (fileContent) => {
      res(fileContent);
    };

    reader.onerror = (error) => {
      rej(error);
    };
    reader.readAsDataURL(files);
  });
}
export default App;
