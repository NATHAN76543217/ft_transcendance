import React from 'react';

// import Button from '../../components/utilities/Button';
import ChannelSearchForm from '../../components/Forms/channelSearchForm';
import axios from 'axios';
import IChannelInterface from '../../components/interface/IChannelInterface';
import IChannelSearchFormValues from '../../components/interface/IChannelSearchFormValues';
import { ChannelRelationshipTypes } from '../../components/channels/channelRelationshipTypes';
import ChannelInformation from '../../components/channels/channelInformation';


interface ChannelProps {
}

interface ChannelStates {
    list: IChannelInterface[],
    channelName: string,
}

class ChannelSearch extends React.Component<ChannelProps, ChannelStates> {

    constructor(props: ChannelProps) {
        super(props);
        this.state = {
            list: [],
            channelName: "",
        };
        this.joinChannel = this.joinChannel.bind(this);
        this.leaveChannel = this.leaveChannel.bind(this);
    }

    componentDidUpdate(prevProps: ChannelProps, prevStates: ChannelStates) {
        // Typical usage (don't forget to compare props):
        // console.log("Previous list: " + prevStates.list);
        // console.log("Current list: " + this.state.list);
        // if (JSON.stringify(prevStates.list) !== JSON.stringify(this.state.list)) {
        //     this.setFriendAndBlockBoolean(this.state.list); // infinite loop ?
        // }
    }

    async setJoinBoolean(list: IChannelInterface[]) {
        list.map(async (channel, index) => {
            try {
                const data = await axios.get("/api/channels/relationships/" + channel.id) // A CHANGER a remettre quand ca marchera

                let indexData = data.data.findIndex((channelRelation: any) => Number(channelRelation.user_id) === Number("1"));
                let a = this.state.list.slice()

                if (indexData !== -1) {
                    a[index].type = data.data[indexData].type;
                } else {
                    a[index].type = ChannelRelationshipTypes.null;
                }
                // if (this.state.list[index].type !== a[index].type) {
                    this.setState({ list: a });
                // }
            } catch (error) { }
        })
    }

    onSubmit = async (values: IChannelSearchFormValues) => {
        try {
            const data = await axios.get("/api/channels?name=" + values.channelName);
            let a = data.data.slice()
            a.sort((channel1: IChannelInterface, channel2: IChannelInterface) => channel1.name.localeCompare(channel2.name))
            this.setJoinBoolean(a);
            this.setState({ list: a });
        } catch (error) { }
        this.setState({ channelName: values.channelName });
    };

    updateRelationshipState(id: string, newType: ChannelRelationshipTypes) {
        let a = this.state.list.slice()
        let index = a.findIndex((channelId) => channelId.id === id)
        a[index].type = newType;
        this.setState({ list: a });
    }

    async joinChannel(id: string) {
        try {
            const data = await axios.get("/api/channels/relationships/" + id)
            let index = data.data.findIndex((channelRelation: any) => Number(channelRelation.user_id) === Number("1"));
            if (index === -1) {
                axios.post("/api/channels/join", {
                    channel_id: id + "",
                    user_id: "1",
                    user_name: "Jean",  // A REMPLACER PAR LE VRAI NOM !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    type: ChannelRelationshipTypes.standard
                })
                this.updateRelationshipState(id, ChannelRelationshipTypes.standard);
            }
        } catch (error) { }
    }

    async leaveChannel(id: string) {
        try {
            const data = await axios.get("/api/channels/relationships/" + id)
            let index = data.data.findIndex((channelRelation: any) => Number(channelRelation.user_id) === Number("1"));
            if (index !== -1 && data.data[index].type !== ChannelRelationshipTypes.ban) {
                await axios.delete("/api/channels/leave/" + data.data[index].id)
                this.updateRelationshipState(id, ChannelRelationshipTypes.null);
            }
        } catch (error) { }
    }

    async banUserFromChannel(channel_id: string, user_id: string) {
        try {
            const data = await axios.get("/api/channels/relationships/" + channel_id)
            let index = data.data.findIndex((channelRelation: any) => Number(channelRelation.user_id) === Number(user_id));
            if (index !== -1) {
                await axios.patch("/api/channels/update" + channel_id, {
                    type: ChannelRelationshipTypes.ban
                })
                this.updateRelationshipState(channel_id, ChannelRelationshipTypes.ban);
            }
        } catch (error) { }
    }

    async unbanUserFromChannel(channel_id: string, user_id: string) {
        try {
            const data = await axios.get("/api/channels/relationships/" + channel_id)
            let index = data.data.findIndex((channelRelation: any) => Number(channelRelation.user_id) === Number(user_id));
            if (index !== -1) {
                await axios.patch("/api/channels/update" + channel_id, {
                    type: ChannelRelationshipTypes.standard
                })
                this.updateRelationshipState(channel_id, ChannelRelationshipTypes.standard);
            }
        } catch (error) { }
    }


    async setAdminUserFromChannel(channel_id: string, user_id: string) {
        try {
            const data = await axios.get("/api/channels/relationships/" + channel_id)
            let index = data.data.findIndex((channelRelation: any) => Number(channelRelation.user_id) === Number(user_id));
            if (index !== -1) {
                await axios.patch("/api/channels/update" + channel_id, {
                    type: ChannelRelationshipTypes.admin
                })
                this.updateRelationshipState(channel_id, ChannelRelationshipTypes.admin);
            }
        } catch (error) { }
    }

    async unsetAdminUserFromChannel(channel_id: string, user_id: string) {
        try {
            const data = await axios.get("/api/channels/relationships/" + channel_id)
            let index = data.data.findIndex((channelRelation: any) => Number(channelRelation.user_id) === Number(user_id));
            if (index !== -1) {
               await axios.patch("/api/channels/update" + channel_id, {
                    type: ChannelRelationshipTypes.standard
                })
                this.updateRelationshipState(channel_id, ChannelRelationshipTypes.standard);
            }
        } catch (error) { }
    }

    render() {
        return (
            <div className="">
                <ChannelSearchForm onSubmit={this.onSubmit} />
                <ul>
                    {this.state.list.map((channel) => (

                        <li key={channel.id} className="relative w-full">
                            <ChannelInformation
                                id={channel.id}
                                name={channel.name}
                                mode={channel.mode}
                                // imgPath="",
                                relationshipTypes={channel.type}
                                // isInSearch={true}
                                joinChannel={this.joinChannel}
                                leaveChannel={this.leaveChannel}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default ChannelSearch;
