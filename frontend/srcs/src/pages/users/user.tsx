import React from "react";

// import Button from '../../components/utilities/Button';
import UserPage from "./userPage";
import UserSearch from "./userSearch";
import UserCreate from "./userCreate";
import { Route } from "react-router";
import UserDelete from "./userDelete";

interface UserProps {
  myId: string;
}

interface UserStates {}

class User extends React.Component<UserProps, UserStates> {
  render() {
    return (
      <div className="">
        <Route exact path="/users/find">
          <UserSearch />
        </Route>
        <Route exact path="/users" component={UserPage} />
        <Route exact path="/users/:id" component={UserPage} />

        {/* --------- TEST --------- */}
        <Route exact path="/users/create">
          <UserCreate />
        </Route>

        <Route exact path="/users/delete">
          <UserDelete />
        </Route>
        {/* ------------------------ */}
      </div>
    );
  }
}

export default User;
