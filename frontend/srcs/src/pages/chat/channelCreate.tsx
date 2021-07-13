import React from 'react';

// import Button from '../../components/utilities/Button';
import axios from 'axios';
import ChannelInformation from '../../components/chat/ChatInformation';
import AppContext from '../../AppContext';
import { ChannelRelationshipType } from '../../models/channel/ChannelRelationship';
import ChannelCreateForm from '../../components/Forms/channelCreateForm';
import CreateChannelDto from '../../models/channel/CreateChannel.dto';
import JoinChannelDto from '../../models/channel/JoinChannel.dto';


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

    onSubmit = async (values: CreateChannelDto) => {
        try {
            // const data = await axios.get("/api/channels?name=" + values.channelName);
            const data = await axios.post("/api/channels", values);
            console.log(data);
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
