import "./App.css";

import React, { useRef } from "react";
import {
  BrowserRouter as Router,
  NavLink as Link,
  Route,
  Switch,
} from "react-router-dom";
import Home from "./Home/Home";
import Chat from "./Chat/Chat";
import Name from "./Name/Name";
import Login from "./Login/Login";
import Register from "./Register/Register";
// import {ajax} from "rxjs/ajax";
function App() {
  const navLoginRef = useRef();
  const navRegisterRef = useRef();
  // useEffect(() =>{
  //   const sub = ajax({
  //     method:"DELETE",
  //     url:"http://localhost:5000/api/users",
  //     body:{
  //       request:"Hello"
  //     }
  //   }).subscribe(v => console.log(v));
  //   return () =>{
  //     sub.unsubscribe()
  //   }
  // },[])
  return (
    <Router>
      <nav>
        <ul className="nav-bar__app">
          <li>
            <Link to="/" activeClassName="active" exact>
              Home
            </Link>
          </li>
          <li>
            <Link to="/users/discuss" activeClassName="active">
              Discuss
            </Link>
          </li>
          <li ref={navLoginRef} style={{margin:"0 0 0 auto"}}>
            <Link to="/auth/login" activeClassName="active">
              Login
            </Link>
          </li>

          <li ref={navRegisterRef}>
            <Link to="/auth/register" activeClassName="active">
              Register
            </Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/users/discuss" component={Chat} />
        <Route path="/anime/:name" component={Name} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/register" component={Register} />
      </Switch>
    </Router>
  );
}

export default App;
