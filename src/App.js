import "./App.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import { fetchingUser$, userStream } from "./epics/user";
import RequestedAnime from "./pages/RequestedAnime/RequestedAnime";
import navBarStore from "./store/navbar";
const StorageAnime = loadable(
  () => import("./pages/StorageAnime/StorageAnime"),
  {
    fallback: (
      <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
        <LinearProgress color="secondary" />
      </section>
    ),
  }
);
const Login = loadable(() => import("./pages/Login/Login"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const Register = loadable(() => import("./pages/Register/Register"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});

const StorageVertical = loadable(
  () => import("./pages/StorageVertical/StorageVertical"),
  {
    fallback: (
      <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
        <LinearProgress color="secondary" />
      </section>
    ),
  }
);
const FAQ = loadable(() => import("./pages/FAQ/FAQ"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const EditUser = loadable(() => import("./pages/EditUser/EditUser"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const AdminManager = loadable(
  () => import("./pages/AdminManager/AdminManager"),
  {
    fallback: (
      <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
        <LinearProgress color="secondary" />
      </section>
    ),
  }
);
const NotFound = loadable(() => import("./pages/404/NotFound"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const Home = loadable(() => import("./pages/Home/Home"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const AnimeDetail = loadable(() => import("./pages/AnimeDetail/AnimeDetail"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const CharacterDetail = loadable(
  () => import("./pages/CharacterDetail/CharacterDetail"),
  {
    fallback: (
      <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
        <LinearProgress color="secondary" />
      </section>
    ),
  }
);
const Theater = loadable(() => import("./pages/Theater/Theater"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const EpisodePage = loadable(() => import("./pages/EpisodePage/EpisodePage"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const SearchedList = loadable(() => import("./pages/Search/SearchedList"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
  ),
});
const PersonDetail = loadable(
  () => import("./pages/PersonDetail/PersonDetail"),
  {
    fallback: (
      <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
        <LinearProgress color="secondary" />
      </section>
    ),
  }
);

function App() {
  const [userState, setUserState] = useState(userStream.currentState());
  // eslint-disable-next-line no-unused-vars
  const [cookies, , removeCookie] = useCookies(["idCartoonUser"]);
  const [toggleNavBarState, setToggleNavBarState] = useState(
    navBarStore.initialState
  );
  const history = useHistory();
  useEffect(() => {
    const subscription = userStream.subscribe(setUserState);
    const subscriptionLock = navBarStore.subscribe(setToggleNavBarState);
    fetch("https://web-rtc-myanimefun.herokuapp.com");
    return () => {
      subscription.unsubscribe();
      subscriptionLock.unsubscribe();
    };
  }, []);

  useEffect(() => {
    navBarStore.init();
    if (toggleNavBarState.isShowBlockPopUp) {
      document.getElementsByTagName("body").item(0).className = "hidden-scroll";
    } else {
      document.getElementsByTagName("body").item(0).className = "";
    }
  }, [toggleNavBarState.isShowBlockPopUp]);
  useEffect(() => {
    const fetchingUserSub = fetchingUser$(cookies.idCartoonUser).subscribe(
      (v) => {
        if (!v.error) {
          userStream.updateUser(v.response.message);
        }
      }
    );
    return () => {
      fetchingUserSub.unsubscribe();
    };
  }, [cookies.idCartoonUser]);
  return (
    <Router history={history}>
      {toggleNavBarState.isShowBlockPopUp && (
        <div className="block-pop-up">
          <div className="loading-block">
            <CircularProgress color="secondary" size="10rem" />
          </div>
        </div>
      )}
      <NavBar
        userState={userState}
        removeCookie={removeCookie}
        cookies={cookies}
      />
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/storage/vertical" component={StorageVertical} />
        <Route path="/storage" component={StorageAnime} exact />
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
        <Route path="/anime/:name" component={AnimeDetail} />
        {userState && userState.role === "Admin" && (
          <Route path="/admin" component={AdminManager} exact />
        )}
        {userState && <Route path="/theater" component={Theater} />}
        {userState && <Route path="/edit" component={EditUser} />}
        {userState && <Route path="/requests" component={RequestedAnime} />}
        {!userState && <Route path="/auth/login" component={Login} />}
        {!userState && <Route path="/auth/register" component={Register} />}
        <Route path="/*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
