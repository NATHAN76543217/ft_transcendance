import axios from 'axios';
import React, { useReducer } from 'react';

import IChannelInterface from '../../components/interface/IChannelInterface';
import AdminUserElement from '../../components/admin/adminUserElement';
import { UserRoleTypes } from '../../components/users/userRoleTypes';
import IUserInterface from '../../components/interface/IUserInterface';
import AdminChannelElement from '../../components/admin/adminChannelElement';
import { ChannelModeTypes } from '../../components/channels/channelModeTypes';

interface AdminChannelProps {
    isOwner?: boolean | false;
    isAdmin?: boolean | false;
}

interface AdminChannelStates {
    list: IChannelInterface[];
    // isOwner: boolean;
    // isAdmin: boolean;
}


class AdminChannels extends React.Component<AdminChannelProps, AdminChannelStates> {
    constructor(props: AdminChannelProps) {
        super(props);
        this.state = {
            list: [],
            // isOwner: this.props.isOwner === undefined ? false : true,
            // isAdmin: this.props.isAdmin === undefined ? false : true,
        }
        this.destroyChannel = this.destroyChannel.bind(this);
    }

    componentDidMount() {
        this.getAllChannels();
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

    async getAllChannels() {
        try {
            const dataUsers = await axios.get("/api/channels");
            let a = dataUsers.data.slice();
            a.sort((user1: IChannelInterface, user2: IChannelInterface) => user1.name.localeCompare(user2.name))
            this.setState({ list: a });
        } catch (error) {

        }
    }

    async destroyChannel(id: string) {
       
    }




    async createChannel(name: string, mode: ChannelModeTypes) {
        try {
            const data = await axios.post("/api/channels", {
                "name": name,
                "password": "password",
                "mode": mode,
            })
            console.log(data.data);
        } catch (error)
        {
            
        }
    }

    render() {     
        
        // this.createChannel("chan5", ChannelModeTypes.private);

        const sectionClass = "h-auto pt-4 pb-4 mx-4 my-4 bg-gray-200 flex-grow text-center";
        const h1Class = "text-2xl font-bold text-center";
        return (

<div className="w-auto">
                <div>
                    - See all chat channels (without joining)
                    - Destroy channels
                    - Give or remove rights to a chat channel to a user
                </div>

                <h2 className="text-3xl font-bold text-center">
                    Channels Administration
                </h2>
                <div className="relative flex flex-wrap xl:block">
                    <section className={sectionClass + ""}>
                        <ul className="relative w-full pt-4 pl-4">
                            {this.state.list.map((channel) => {
                                    return (
                                        <li key={channel.name} className="">
                                            <AdminChannelElement
                                                id={channel.id}
                                                name={channel.name}
                                                mode={channel.mode}
                                                destroyChannel={this.destroyChannel}
                                                
                                            />
                                        </li>
                                    )
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

export default AdminChannels;