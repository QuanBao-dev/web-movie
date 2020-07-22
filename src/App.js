import "./App.css";

import React from "react";
import { BrowserRouter as Router,NavLink as Link, Route, Switch } from "react-router-dom";
import Home from "./Home/Home";
import User from "./User/User";
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
            <Link to="/about" activeClassName="active">About</Link>
          </li>
          <li>
            <Link to="/users" activeClassName="active">Users</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/about" component={About} />
        <Route path="/users" component={User} />
        <Route path="/anime/:name" component={Name}/>
      </Switch>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}

export default App;
