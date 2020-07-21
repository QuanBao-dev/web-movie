import React from "react";
import "./User.css";
import { Link, Switch, Route } from "react-router-dom";
import Name from "../Name/Name";
function User(props) {
  return (
    <div>
      <div className="wrapper-button">
        <Link to={`${props.match.url}/person1`}>
          <button className="chat-box-user__button">Person 1</button>
        </Link>
        <Link to={`${props.match.url}/person2`}>
          <button className="chat-box-user__button">Person 2</button>
        </Link>
      </div>
      <Switch>
        <Route path={`${props.match.url}/:name`} component={Name} />
      </Switch>
    </div>
  );
}

export default User;
