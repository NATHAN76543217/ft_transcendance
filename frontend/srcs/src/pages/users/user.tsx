import React from "react";

// import Button from '../../components/utilities/Button';
import UserPage from "./userPage";
import UserSearch from "./userSearch";
import { Route, Switch } from "react-router";
import UserDelete from "./userDelete";

class User extends React.Component {
  render() {
    return (
      <div className="">
        <Switch>
          <Route exact path="/users" component={UserPage} />

          <Route exact path="/users/find">
            <UserSearch />
          </Route>

          {/* --------- TEST --------- */}

          <Route exact path="/users/delete">
            <UserDelete />
          </Route>
          {/* ------------------------ */}
          <Route path="/users/:id" component={UserPage} />
        </Switch>
      </div>
    );
  }
}

export default User;
