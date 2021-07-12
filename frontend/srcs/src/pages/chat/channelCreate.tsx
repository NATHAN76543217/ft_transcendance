import React from 'react';

// import Button from '../../components/utilities/Button';
import ChannelCreateForm from '../../components/Forms/channelCreateForm';
import axios from 'axios';
import IChannelInterface from '../../components/interface/IChannelInterface';
import IChannelCreateFormValues from '../../components/interface/IChannelCreateFormValues';
import { ChannelRelationshipTypes } from '../../components/channels/channelRelationshipTypes';
import ChannelInformation from '../../components/channels/channelInformation';
import AppContext from '../../AppContext';


interface ChannelProps {
}

interface ChannelStates {
    
}

class ChannelCreate extends React.Component<ChannelProps, ChannelStates> {

    static contextType = AppContext

    constructor(props: ChannelProps) {
        super(props);
        this.state = {
        };
    }

    componentDidUpdate(prevProps: ChannelProps, prevStates: ChannelStates) {
        // Typical usage (don't forget to compare props):
        // console.log("Previous list: " + prevStates.list);
        // console.log("Current list: " + this.state.list);
        // if (JSON.stringify(prevStates.list) !== JSON.stringify(this.state.list)) {
        //     this.setFriendAndBlockBoolean(this.state.list); // infinite loop ?
        // }
    }

    onSubmit = async (values: IChannelCreateFormValues) => {
        const contextValue = this.context;
        try {
            // const data = await axios.get("/api/channels?name=" + values.channelName);
            const data = await axios.post("/api/channels", values);
            let channelId = data.data.id;
            axios.post("/api/channels/join", {
                channel_id: channelId + "",
                user_id: contextValue.myId, // a remplacer
                user_name: contextValue.user.name,  // A REMPLACER PAR LE VRAI NOM !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                type: ChannelRelationshipTypes.owner
            })
        } catch (error) { }
        // this.setState({ channelName: values.channelName });
    };

    render() {
        return (
            <div className="">
                <ChannelCreateForm onSubmit={this.onSubmit} />
            </div>
        );
    }
}

export default ChannelCreate;
