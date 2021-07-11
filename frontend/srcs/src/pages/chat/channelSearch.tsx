import React from "react";

// import Button from '../../components/utilities/Button';
import ChannelSearchForm from "../../components/Forms/channelSearchForm";
import axios from "axios";
import ChannelSearchDto from "../../models/channel/ChannelSearch.dto";
import ChannelInformation from "../../components/channels/channelInformation";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../../models/channel/ChannelRelationship";

interface ChannelProps {
  myId: string;
}

interface ChannelStates {
  list: ChannelRelationship[];
  channelName: string;
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

  async setJoinBoolean(list: ChannelRelationship[]) {
    list.map(async (channel, index) => {
      try {
        const data = await axios.get(
          `/api/channels/relationships/${channel.id}`
        ); // A CHANGER a remettre quand ca marchera

        let indexData = data.data.findIndex(
          (channelRelation: any) =>
            Number(channelRelation.user_id) === Number(this.props.myId)
        );
        let a = this.state.list.slice();

        if (indexData !== -1) {
          a[index].type = data.data[indexData].type;
        } else {
          a[index].type = ChannelRelationshipType.null;
        }
        // if (this.state.list[index].type !== a[index].type) {
        this.setState({ list: a });
        // }
      } catch (error) {}
    });
  }

  onSubmit = async (values: ChannelSearchDto) => {
    try {
      const data = await axios.get("/api/channels?name=" + values.channelName);
      let a = data.data.slice();
      a.sort((channel1: ChannelRelationship, channel2: ChannelRelationship) =>
        channel1.channel.name.localeCompare(channel2.channel.name)
      );
      this.setJoinBoolean(a);
      this.setState({ list: a });
    } catch (error) {}
    this.setState({ channelName: values.channelName });
  };

  updateRelationshipState(id: string, newType: ChannelRelationshipType) {
    let a = this.state.list.slice();
    let index = a.findIndex((channel) => channel.channel_id === id);
    a[index].type = newType;
    this.setState({ list: a });
  }

  async joinChannel(id: string) {
    try {
      const data = await axios.get("/api/channels/relationships/" + id);
      let index = data.data.findIndex(
        (channelRelation: any) =>
          Number(channelRelation.user_id) === Number(this.props.myId)
      );
      if (index === -1) {
        axios.post("/api/channels/join", {
          channel_id: id + "",
          user_id: this.props.myId,
          user_name: "Jean", // A REMPLACER PAR LE VRAI NOM !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          type: ChannelRelationshipType.standard,
        });
        this.updateRelationshipState(id, ChannelRelationshipType.standard);
      }
    } catch (error) {}
  }

  async leaveChannel(id: string) {
    try {
      const data = await axios.get("/api/channels/relationships/" + id);
      let index = data.data.findIndex(
        (channelRelation: any) =>
          Number(channelRelation.user_id) === Number(this.props.myId)
      );
      if (
        index !== -1 &&
        data.data[index].type !== ChannelRelationshipType.ban
      ) {
        await axios.delete("/api/channels/leave/" + data.data[index].id);
        this.updateRelationshipState(id, ChannelRelationshipType.null);
      }
    } catch (error) {}
  }

  async banUserFromChannel(channel_id: string, user_id: string) {
    try {
      const data = await axios.get("/api/channels/relationships/" + channel_id);
      let index = data.data.findIndex(
        (channelRelation: any) =>
          Number(channelRelation.user_id) === Number(user_id)
      );
      if (index !== -1) {
        await axios.patch("/api/channels/update" + channel_id, {
          type: ChannelRelationshipType.ban,
        });
        this.updateRelationshipState(channel_id, ChannelRelationshipType.ban);
      }
    } catch (error) {}
  }

  async unbanUserFromChannel(channel_id: string, user_id: string) {
    try {
      const data = await axios.get("/api/channels/relationships/" + channel_id);
      let index = data.data.findIndex(
        (channelRelation: any) =>
          Number(channelRelation.user_id) === Number(user_id)
      );
      if (index !== -1) {
        await axios.patch("/api/channels/update" + channel_id, {
          type: ChannelRelationshipType.standard,
        });
        this.updateRelationshipState(
          channel_id,
          ChannelRelationshipType.standard
        );
      }
    } catch (error) {}
  }

  async setAdminUserFromChannel(channel_id: string, user_id: string) {
    try {
      const data = await axios.get("/api/channels/relationships/" + channel_id);
      let index = data.data.findIndex(
        (channelRelation: any) =>
          Number(channelRelation.user_id) === Number(user_id)
      );
      if (index !== -1) {
        await axios.patch("/api/channels/update" + channel_id, {
          type: ChannelRelationshipType.admin,
        });
        this.updateRelationshipState(channel_id, ChannelRelationshipType.admin);
      }
    } catch (error) {}
  }

  async unsetAdminUserFromChannel(channel_id: string, user_id: string) {
    try {
      const data = await axios.get("/api/channels/relationships/" + channel_id);
      let index = data.data.findIndex(
        (channelRelation: any) =>
          Number(channelRelation.user_id) === Number(user_id)
      );
      if (index !== -1) {
        await axios.patch("/api/channels/update" + channel_id, {
          type: ChannelRelationshipType.standard,
        });
        this.updateRelationshipState(
          channel_id,
          ChannelRelationshipType.standard
        );
      }
    } catch (error) {}
  }

  render() {
    return (
      <div className="">
        <ChannelSearchForm onSubmit={this.onSubmit} />
        <ul>
          {this.state.list.map((channel) => (
            <li key={channel.channel_id} className="relative w-full">
              <ChannelInformation
                id={channel.channel_id}
                name={channel.channel.name}
                mode={channel.channel.mode}
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
