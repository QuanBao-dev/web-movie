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
import { ReplaySubject } from "rxjs";

import NavBar from "./components/NavBar/NavBar";
import { fetchingUser$, userStream } from "./epics/user";
import navBarStore from "./store/navbar";
import { virtualAnimeListStream } from "./epics/virtualAnimeList";
import { lazyLoadAnimeListStream } from "./epics/lazyLoadAnimeList";

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

const ProducerDetail = loadable(
  () => import("./pages/ProducerDetail/ProducerDetail"),
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
const GenreDetail = loadable(() => import("./pages/GenreDetail/GenreDetail"), {
  fallback: (
    <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
      <LinearProgress color="secondary" />
    </section>
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
});

window.addEventListener("scroll", () => {
  scrollSaveSubject.next(window.scrollY);
  scrollSaveSubject.subscribe((v) => {
    const navBarE = document.querySelector(".nav-bar__app");
    const buttonScrollTopE = document.querySelector(".button-scroll-top");
    const e = document.getElementsByClassName("child-nav-bar__app").item(0);
    if (navBarE)
      if (window.scrollY < 50) {
        navBarE.style.transform = "translateY(0)";
        navBarE.style.backgroundColor = "rgba(2, 2, 2)";
        buttonScrollTopE.style.transform = "translateY(500px)";
      } else if (v - window.scrollY < -1) {
        navBarE.style.transform = "translateY(-500px)";
        if (e.style.display !== "flex")
          navBarE.style.backgroundColor = "rgba(2, 2, 2, 0.3)";
        if (e.style.display === "flex") e.style.display = "none";
        buttonScrollTopE.style.transform = "translateY(500px)";
      } else if (v - window.scrollY > 1) {
        navBarE.style.transform = "translateY(0)";
        buttonScrollTopE.style.transform = "translateY(0)";
        if (e.style.display !== "flex")
          navBarE.style.backgroundColor = "rgba(2, 2, 2, 0.3)";
      }
  });
});
window.addEventListener("load", () => {
  const body = document.querySelector("body");
  body.style.backgroundImage = "url(/background.jpg)";
});
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
      <div
        className="button-scroll-top"
        onClick={() => {
          const {
            genreDetailData,
            numberAnimeShowMore,
          } = lazyLoadAnimeListStream.currentState();
          virtualAnimeListStream.updateData({
            numberShowMorePreviousAnime: Math.ceil(
              genreDetailData.length / numberAnimeShowMore - 1
            ),
            numberShowMoreLaterAnime: 0,
          });
          window.scroll({
            top: 0,
            behavior: !virtualAnimeListStream.currentState().isVirtual
              ? "smooth"
              : "auto",
          });
        }}
      >
        <i className="fas fa-arrow-up fa-2x"></i>
      </div>
      <NavBar
        userState={userState}
        removeCookie={removeCookie}
        cookies={cookies}
      />
      <Switch>
        <Route path="/" component={Home} exact />
        {userState && userState.role === "Admin" && (
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
        <Route path="/anime/:name" component={AnimeDetail} />
        <Route path="/genre/:genreId" component={GenreDetail} />
        <Route path="/producer/:producerId" component={ProducerDetail} />
        <Route path="/studio/:producerId" component={ProducerDetail} />
        <Route path="/licensor/:producerId" component={ProducerDetail} />
        {userState && <Route path="/theater" component={Theater} />}
        {userState && <Route path="/edit" component={EditUser} />}
        {!userState && <Route path="/auth/login" component={Login} />}
        {!userState && <Route path="/auth/register" component={Register} />}
        <Route path="/*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
