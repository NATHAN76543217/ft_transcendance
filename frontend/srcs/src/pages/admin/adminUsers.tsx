import axios from 'axios';
import React, { useReducer } from 'react';

import IUserInterface from '../../components/interface/IUserInterface';
import AdminUserElement from '../../components/admin/adminUserElement';
import { UserRoleTypes } from '../../components/users/userRoleTypes';

interface AdminUsersProps {
    myRole: UserRoleTypes;
}

interface AdminUsersStates {
    list: IUserInterface[];
    isOwner: boolean;
    isAdmin: boolean;
}

class AdminUsers extends React.Component<AdminUsersProps, AdminUsersStates> {
    constructor(props: AdminUsersProps) {
        super(props);
        this.state = {
            list: [],
            isOwner: this.props.myRole === UserRoleTypes.owner,
            isAdmin: this.props.myRole === UserRoleTypes.admin,
        }
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
            a.sort((user1: IUserInterface, user2: IUserInterface) => user1.name.localeCompare(user2.name))
            this.setState({ list: a });
        } catch (error) {

        }
    }

    async banUser(id: string) {
        try {
            const data = await axios.patch("/api/users/" + id, { "role": UserRoleTypes.ban });
            let a = this.state.list.slice();
            let index = a.findIndex((userId) => Number(userId.id) === Number(id))
            a[index].role = UserRoleTypes.ban;
            this.setState({ list: a });
            
            // const dataTry = await axios.get("/api/users/" + id);
            // console.log(dataTry.data)
        } catch (error) {
            console.log(error);
        }
    }

    async unbanUser(id: string) {
        try {
            const data = await axios.patch("/api/users/" + id, { "role": UserRoleTypes.null });
            let a = this.state.list.slice();
            let index = a.findIndex((userId) => Number(userId.id) === Number(id))
            a[index].role = UserRoleTypes.null;
            this.setState({ list: a });
            
            // const dataTry = await axios.get("/api/users/" + id);
            // console.log(dataTry.data)
        } catch (error) {
            console.log(error);
        }
    }

    async setAdmin(id: string) {
        try {
            const data = await axios.patch("/api/users/" + id, { "role": UserRoleTypes.admin });
            let a = this.state.list.slice();
            let index = a.findIndex((userId) => Number(userId.id) === Number(id))
            a[index].role = UserRoleTypes.admin;
            this.setState({ list: a });
            
            // const dataTry = await axios.get("/api/users/" + id);
            // console.log(dataTry.data)
        } catch (error) {
            console.log(error);
        }
    }

    async unsetAdmin(id: string) {
        try {
            const data = await axios.patch("/api/users/" + id, { "role": UserRoleTypes.null });
            let a = this.state.list.slice();
            let index = a.findIndex((userId) => Number(userId.id) === Number(id))
            a[index].role = UserRoleTypes.null;
            this.setState({ list: a });
            
            // const dataTry = await axios.get("/api/users/" + id);
            // console.log(dataTry.data)
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const sectionClass = "h-auto pt-4 pb-4 mx-4 my-4 bg-gray-200 flex-grow text-center";
        const h1Class = "text-2xl font-bold text-center";
        return (
            <div className="w-auto">
                <h2 className="text-3xl font-bold text-center">
                    Users Administration
                </h2>
                <div className="relative flex flex-wrap">
                    <section className={sectionClass}>

                        <h1 className={h1Class}>
                            Standard users
                        </h1>
                        <ul className="relative w-auto pt-4 pl-4">
                            {this.state.list.map((user) => {
                                if (!(user.role & UserRoleTypes.ban)) {
                                    return (
                                        <li key={user.name} className="justify-center">
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
                                    )
                                }
                            }
                            )
                            }
                        </ul>

                    </section>
                    <section className={sectionClass}>

                        <h1 className={h1Class}>
                            Banned users
                        </h1>
                        <ul className="relative w-auto pt-4 pl-4">
                            {this.state.list.map((user) => {
                                if (user.role & UserRoleTypes.ban) {
                                    return (
                                        <li key={user.name} className="">
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
                                    )
                                }
                            }
                            )
                            }
                        </ul>

                    </section>
                </div>



            </div>
        )
    }
}

export default AdminUsers;