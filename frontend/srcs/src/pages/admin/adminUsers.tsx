import axios from "axios";
import React from "react";

import { IUser } from "../../models/user/IUser";
import AdminUserElement from "../../components/admin/adminUserElement";
import { UserRole } from "../../models/user/IUser";

interface AdminUsersProps {
  myRole: UserRole;
}

interface AdminUsersStates {
  list: IUser[];
  isOwner: boolean;
  isAdmin: boolean;
}

class AdminUsers extends React.Component<AdminUsersProps, AdminUsersStates> {
  constructor(props: AdminUsersProps) {
    super(props);
    this.state = {
      list: [],
      isOwner: this.props.myRole === UserRole.owner,
      isAdmin: this.props.myRole === UserRole.admin,
    };
    this.banUser = this.banUser.bind(this);
    this.unbanUser = this.unbanUser.bind(this);
    this.setAdmin = this.setAdmin.bind(this);
    this.unsetAdmin = this.unsetAdmin.bind(this);
  }

  componentDidMount() {
    this.getAllUsers();
  }

  componentDidUpdate() {
    // console.log("AdminUsers component did update")
  }

  async getAllUsers() {
    try {
      const dataUsers = await axios.get("/api/users");
      let a = dataUsers.data.slice();
      a.sort((user1: IUser, user2: IUser) =>
        user1.name.localeCompare(user2.name)
      );
      this.setState({ list: a });
    } catch (error) {}
  }

  async banUser(id: string) {
    try {
      await axios.patch("/api/users/" + id, { role: UserRole.ban });
      let a = this.state.list.slice();
      let index = a.findIndex((userId) => Number(userId.id) === Number(id));
      a[index].role = UserRole.ban;
      this.setState({ list: a });
    } catch (error) {}
  }

  async unbanUser(id: string) {
    try {
      await axios.patch("/api/users/" + id, { role: UserRole.null });
      let a = this.state.list.slice();
      let index = a.findIndex((userId) => Number(userId.id) === Number(id));
      a[index].role = UserRole.null;
      this.setState({ list: a });
    } catch (error) {}
  }

  async setAdmin(id: string) {
    try {
      await axios.patch("/api/users/" + id, { role: UserRole.admin });
      let a = this.state.list.slice();
      let index = a.findIndex((userId) => Number(userId.id) === Number(id));
      a[index].role = UserRole.admin;
      this.setState({ list: a });
    } catch (error) {}
  }

  async unsetAdmin(id: string) {
    try {
      await axios.patch("/api/users/" + id, { role: UserRole.null });
      let a = this.state.list.slice();
      let index = a.findIndex((userId) => Number(userId.id) === Number(id));
      a[index].role = UserRole.null;
      this.setState({ list: a });
    } catch (error) {}
  }

  render() {
    const sectionClass =
      "h-auto pt-4 pb-4 mx-4 my-4 bg-gray-200 flex-grow text-center";
    const h1Class = "text-2xl font-bold text-center";
    return (
      <div className="w-auto">
        <h2 className="text-3xl font-bold text-center">Users Administration</h2>
        <div className="relative flex flex-wrap">
          <section className={sectionClass}>
            <h1 className={h1Class}>Standard users</h1>
            <ul className="relative w-auto pt-4 pl-4">
              {this.state.list.map((user) => {
                if (!(user.role & UserRole.ban)) {
                  return (
                    <li key={user.id} className="justify-center">
                      <AdminUserElement
                        id={user.id}
                        name={user.name}
                        role={user.role}
                        myRole={this.props.myRole}
                        banUser={this.banUser}
                        unbanUser={this.unbanUser}
                        setAdmin={this.setAdmin}
                        unsetAdmin={this.unsetAdmin}
                      />
                    </li>
                  );
                } else {
                  return (
                    <li key={user.id} className="">
                      <div></div>
                    </li>
                  );
                }
              })}
            </ul>
          </section>
          <section className={sectionClass}>
            <h1 className={h1Class}>Banned users</h1>
            <ul className="relative w-auto pt-4 pl-4">
              {this.state.list.map((user) => {
                if (user.role & UserRole.ban) {
                  return (
                    <li key={user.id} className="">
                      <AdminUserElement
                        id={user.id}
                        name={user.name}
                        role={user.role}
                        myRole={this.props.myRole}
                        banUser={this.banUser}
                        unbanUser={this.unbanUser}
                        setAdmin={this.setAdmin}
                        unsetAdmin={this.unsetAdmin}
                      />
                    </li>
                  );
                } else {
                  return (
                    <li key={user.id} className="">
                      <div></div>
                    </li>
                  );
                }
              })}
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default AdminUsers;
