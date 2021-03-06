import axios from "axios";
import React, { useEffect, useState } from "react";

import { IUser } from "../../models/user/IUser";
import AdminUserElement from "../../components/admin/adminUserElement";
import { UserRole } from "../../models/user/IUser";
import AppContext from "../../AppContext";
import { Events } from "../../models/channel/Events";

const getAllUsers = async (adminInfo: AdminState, setAdminInfo: any) => {
  try {
    const dataUsers = await axios.get("/api/users");
    let a = dataUsers.data.slice();
    a.sort((user1: IUser, user2: IUser) =>
      user1.name.localeCompare(user2.name)
    ).reverse();
    a.sort((user1: IUser, user2: IUser) =>
      user1.role.toString().localeCompare(user2.role.toString())
    ).reverse();
    if (JSON.stringify(a) !== JSON.stringify(adminInfo.list)) {
      setAdminInfo({ list: a });
    }
  } catch (error) {}
};

interface AdminState {
  list: IUser[];
}

function AdminUsers() {
  const contextValue = React.useContext(AppContext);

  const [adminInfo, setAdminInfo] = useState<AdminState>({
    list: [],
  });

  const updateOneRole = async (user_id: number, newRole: UserRole) => {
    let a = adminInfo.list.slice();
    let index = a.findIndex((user: IUser) => {
      return Number(user.role) === user_id;
    });
    if (index !== -1) {
      a[index].role = newRole;
    }
    setAdminInfo({ list: a });
  };

  const setRole = async (
    id: number,
    role: UserRole,
    adminInfo: AdminState,
    setAdminInfo: any
  ) => {
    contextValue.eventSocket?.emit(Events.Server.UpdateUserRole, {
      user_id: id,
      role: role,
    });
    updateOneRole(id, role);
  };

  const banUser = async (
    id: number,
    adminInfo: AdminState,
    setAdminInfo: any
  ) => setRole(id, UserRole.Banned, adminInfo, setAdminInfo);

  const unbanUser = async (
    id: number,
    adminInfo: AdminState,
    setAdminInfo: any
  ) => setRole(id, UserRole.User, adminInfo, setAdminInfo);

  const setAdmin = async (
    id: number,
    adminInfo: AdminState,
    setAdminInfo: any
  ) => setRole(id, UserRole.Admin, adminInfo, setAdminInfo);

  const unsetAdmin = async (
    id: number,
    adminInfo: AdminState,
    setAdminInfo: any
  ) => setRole(id, UserRole.User, adminInfo, setAdminInfo);

  getAllUsers(adminInfo, setAdminInfo);

  useEffect(() => {
    getAllUsers(adminInfo, setAdminInfo);
  }, [adminInfo]);

  const sectionClass =
    "w-full h-auto p-4 mt-12 bg-gray-100 border-2 border-gray-300 rounded-sm ";
  const h1Class = "text-2xl font-bold text-center";
  return (
    <div className="grid justify-center border-t-2 border-gray-600">
      <div className="p-4 mt-12 border-2 border-gray-400 rounded-sm bg-neutral">
        <h2 className="text-3xl font-bold text-center">Users Administration</h2>
        <div className="w-full space-y-10 ">
          <section className={sectionClass}>
            <h1 className={h1Class}>Standard users</h1>
            <ul className="">
              {adminInfo.list.map((user) => {
                if (!(user.role & UserRole.Banned)) {
                  return (
                    <li key={user.id} className="">
                      <AdminUserElement
                        id={user.id}
                        name={user.name}
                        role={user.role}
                        myRole={contextValue.user?.role}
                        banUser={banUser}
                        unbanUser={unbanUser}
                        setAdmin={setAdmin}
                        unsetAdmin={unsetAdmin}
                        adminInfo={adminInfo}
                        setAdminInfo={setAdminInfo}
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
            <ul className="">
              {adminInfo.list.map((user) => {
                if (user.role & UserRole.Banned) {
                  return (
                    <li key={user.id} className="">
                      <AdminUserElement
                        id={user.id}
                        name={user.name}
                        role={user.role}
                        myRole={contextValue.user?.role}
                        banUser={banUser}
                        unbanUser={unbanUser}
                        setAdmin={setAdmin}
                        unsetAdmin={unsetAdmin}
                        adminInfo={adminInfo}
                        setAdminInfo={setAdminInfo}
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
    </div>
  );
}

export default AdminUsers;
