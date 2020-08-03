import './App.css';

import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, NavLink as Link, Route, Switch } from 'react-router-dom';

// import Chat from './Chat/Chat';
import EpisodePage from './EpisodePage/EpisodePage';
import Home from './Home/Home';
import Login from './Login/Login';
import Name from './Name/Name';
import Register from './Register/Register';
import { fetchingUser$, userStream } from './epics/user';

function App() {
  const navLoginRef = useRef();
  const navRegisterRef = useRef();
  const [user, setUser] = useState(userStream.initialState);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["idCartoonUser"]);

  useEffect(() => {
    const subscription = userStream.subscribe(setUser);
    const fetchingUserSub = fetchingUser$(cookies.idCartoonUser).subscribe();
    return () => {
      fetchingUserSub.unsubscribe();
      subscription.unsubscribe();
    };
  }, [cookies.idCartoonUser]);
  // console.log(userStream.currentState());
  return (
    <Router>
      <nav>
        <ul className="nav-bar__app">
          <li>
            <Link to="/" activeClassName="active" exact>
              Home
            </Link>
          </li>
          <li ref={navLoginRef} style={{ margin: "0 0 0 auto" }}>
            {!user && (
              <Link to="/auth/login" activeClassName="active">
                Login
              </Link>
            )}
            {user && (
              <div
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => {
                  logoutUser(setCookie, cookies.idCartoonUser);
                }}
              >
                Logout
              </div>
            )}
          </li>

          {!user && (
            <li ref={navRegisterRef}>
              <Link to="/auth/register" activeClassName="active">
                Register
              </Link>
            </li>
          )}
          {user && (
            <li style={{ color: "white" }}>
              <div>{user.username}</div>
            </li>
          )}
        </ul>
      </nav>
      <Switch>
        <Route path="/" component={Home} exact />
        {/* <Route path="/users/discuss" component={Chat} /> */}
        <Route path="/anime/:malId/comment" component={EpisodePage} />
        <Route path="/anime/:name" component={Name} />
        {!user && <Route path="/auth/login" component={Login} />}
        {!user && <Route path="/auth/register" component={Register} />}
      </Switch>
    </Router>
  );
}

async function logoutUser(setCookie, cookie) {
  try {
    await Axios.delete("http://localhost:5000/api/users/logout", {
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
  } catch (error) {
    console.error(error);
  }
}
export default App;
