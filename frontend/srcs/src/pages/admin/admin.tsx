import React from "react";
import AppContext from "../../AppContext";
import { UserRole } from "../../models/user/IUser";
import AdminChannels from "./adminChannels";
import AdminUsers from "./adminUsers";

class Admin extends React.Component {
  static contextType = AppContext;

  render() {
    const contextValue = this.context;
    if (true || contextValue.myRole & (UserRole.owner + UserRole.admin)) {
      return (
        <div>
          <AdminChannels />
          <AdminUsers />
        </div>
      );
    } else {
      return <div>You are not an administrator.</div>;
    }
  }
}

export default Admin;
