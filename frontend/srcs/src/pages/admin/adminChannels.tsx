import axios from 'axios';
import React, { useReducer } from 'react';

import IChannelInterface from '../../components/interface/IChannelInterface';
import AdminUserElement from '../../components/admin/adminUserElement';
import { UserRoleTypes } from '../../components/users/userRoleTypes';
import IUserInterface from '../../components/interface/IUserInterface';
import AdminChannelElement from '../../components/admin/adminChannelElement';
import { ChannelModeTypes } from '../../components/channels/channelModeTypes';
import { ChannelRelationshipTypes } from '../../components/channels/channelRelationshipTypes';
import IChannelRelationship from '../../components/interface/IChannelRelationshipInterface';

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
        this.setAllChannels = this.setAllChannels.bind(this);
    }

    componentDidMount() {
        this.setAllChannels();
    }

    componentDidUpdate() {
        console.log("AdminUsers component did update")
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

    async setAllChannels() {
        try {
            const dataUsers = await axios.get("/api/channels");
            let a = dataUsers.data.slice();
            a.sort((user1: IChannelInterface, user2: IChannelInterface) => user1.name.localeCompare(user2.name))
            this.setState({ list: a });
        } catch (error) {

        }
    }

    async destroyChannel(id: string) {
        try {
            const dataRelations = await axios.get("/api/channels/relationships/" + id)
            dataRelations.data.map(async (relation: IChannelRelationship) => {
                try {
                    await axios.delete("/api/channels/leave/" + relation.id);
                } catch (error) {}
            })
            await axios.delete("/api/channels/" + id);
        } catch (error) {}
        this.setAllChannels();
    }




    async createChannel(name: string, mode: ChannelModeTypes) {
        try {
            const data = await axios.post("/api/channels", {
                "name": name,
                "password": "password",
                "mode": mode,
            })
            console.log(data.data);
        } catch (error) {

        }
    }

    async createChannelRelationship(channel_id: string, user_id: string, type: ChannelRelationshipTypes) {
        try {
            const dataUser = await axios.get("/api/users/" + user_id);
            const user_name = dataUser.data.name;
            const data = await axios.post("/api/channels/join", {
                "channel_id": channel_id,
                "user_id": user_id,
                "user_name": user_name,
                "type": type
            })
            console.log(data.data);
        } catch (error) {

        }
    }

    async deleteChannelRelationship(id: string) {
        try {

            const data = await axios.delete("/api/channels/leave/" + id);
        } catch (error) { }
    }

    async displayChannelsData() {
        try {

            const data = await axios.get("/api/channels");
            console.log(data.data);
            // const relations = await axios.get("/api/channels/relationships")
            // console.log(relations.data);
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        // this.displayChannelsData();
        // this.createChannel("my chan4", ChannelModeTypes.public);
        // this.createChannelRelationship(
        //     "17",
        //     "1",
        //     ChannelRelationshipTypes.standard);
        // this.deleteChannelRelationship("1");
        // this.deleteChannelRelationship("3");
        // this.deleteChannelRelationship("4");


        const sectionClass = "h-auto pt-4 pb-4 mx-4 my-4 bg-gray-200 flex-grow text-center";
        const h1Class = "text-2xl font-bold text-center";
        return (

            <div className="w-auto">
                <h2 className="text-3xl font-bold text-center">
                    Channels Administration
                </h2>
                <div className="relative flex flex-wrap">
                    <section className={sectionClass}>
                        <ul className="relative w-auto pt-4 pl-4">
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