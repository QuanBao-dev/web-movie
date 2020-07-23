import "./App.css";

import React from "react";
import { BrowserRouter as Router,NavLink as Link, Route, Switch } from "react-router-dom";
import Home from "./Home/Home";
import Chat from "./Chat/Chat";
import Name from "./Name/Name";

function App() {
  return (
    <Router>
      <nav>
        <ul className="nav-bar__app">
          <li>
            <Link to="/" activeClassName="active" exact>Home</Link>
          </li>
          <li>
            <Link to="/users/chat" activeClassName="active">Chat</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/users/chat" component={Chat} />
        <Route path="/anime/:name" component={Name}/>
      </Switch>
    </Router>
  );
}

export default App;
