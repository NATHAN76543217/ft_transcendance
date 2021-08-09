import UserPage from "./userPage";
import UserSearch from "./userSearch";
import { Route, Switch } from "react-router";
import UserDelete from "./userDelete";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";

function User(props: { relationshipsList: AppUserRelationship[] }) {
  return (
    <Switch>
      <Route exact path="/users" component={UserPage} />

      <Route exact path="/users/find">
        <UserSearch
        // relationshipsList={props.relationshipsList}
        />
      </Route>

      {/* --------- TEST --------- */}

      <Route exact path="/users/delete">
        <UserDelete />
      </Route>
      {/* ------------------------ */}
      <Route
        path="/users/:id"
        component={UserPage}
        // prop={props.relationshipsList}
      />
    </Switch>
  );
}

export default User;
