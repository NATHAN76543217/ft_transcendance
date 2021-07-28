import axios from "axios";
import React, { useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../AppContext";
import AdminChannelElement from "../../components/admin/adminChannelElement";
import {
  Channel,
  ChannelMode,
  ChannelUserRelationship,
  Message,
} from "../../models/channel/Channel";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import ChannelSettingsProperties from "./channelSettingsProperties";
import chatContext from "./chatContext";

type ChannelSettingsProps = {
  id: number;
  name: string;
  mode: ChannelMode;
  messages: Message[];
  myRole: ChannelRelationshipType;
  users: ChannelUserRelationship[];
  paramId: string;
};

function ChannelSettings(props: ChannelSettingsProps) {
  const contextValue = React.useContext(AppContext);
  const chatContextValue = React.useContext(chatContext);

  let channelId: number;
  if (props.paramId && props.paramId[0] === 'c') {
    channelId = Number(props.paramId.substring(1));
  } else {
    channelId = Number('c');
  }

  const history = useHistory();

  // const [channelInfo, setChannelInfo] = useState<Channel>({
  //   id: 0,
  //   name: "",
  //   mode: ChannelMode.public,
  //   myRole: ChannelRelationshipType.Member,
  //   messages: [],
  //   users: [],
  // });

  console.log('chatContext', chatContextValue)

  // const setChannel = async () => {
  //   try {
  //     // const dataChannel = await axios.get(`/api/channels/${channelId}`, {
  //     const dataChannel = await axios.get(`/api/channels/` + channelId, {
  //       withCredentials: true,
  //     });
  //     // let a = dataChannel.data.slice();
  //     dataChannel.data.users.sort(
  //       (user1: { user: any }, user2: { user: any }) =>
  //         user1.user.name.localeCompare(user2.user.name)
  //     );
  //     const myRelationship = dataChannel.data.users.find((user: any) => {
  //       return user.user_id === contextValue.user?.id;
  //     });
  //     const myRole =
  //       myRelationship !== undefined
  //         ? myRelationship.type
  //         : ChannelRelationshipType.Member;
  //     setChannelInfo({
  //       id: dataChannel.data.id,
  //       name: dataChannel.data.name,
  //       mode: dataChannel.data.mode,
  //       myRole: myRole,
  //       messages: [],
  //       users: dataChannel.data.users,
  //     });
  //   } catch (error) { }
  // };


  const destroyChannel = async (channel_id: number) => {
    console.log("Deleting channel " + channel_id);

    contextValue.socket?.emit('destroyChannel-front', {
      channel_id: channel_id,
    });
    chatContextValue.setCurrentChannelRel(undefined);
    history.push('/chat');
  };

  // if (channelInfo.id !== channelId) {
  //   setChannel();
  // }
  if (
    props.myRole &
    (ChannelRelationshipType.Owner | ChannelRelationshipType.Admin)
  ) {
    return (
      <div className="flex-grow">
        <ChannelSettingsProperties
          id={props.id}
          name={props.name}
          mode={props.mode}
          destroyChannel={destroyChannel}
          isChannelSettings={true}
          myRole={props.myRole}
        />
        <div>
          <h2 className="mt-12 text-3xl font-bold text-center">
            Channel Users
          </h2>
          <AdminChannelElement
            id={props.id}
            name={props.name}
            mode={props.mode}
            destroyChannel={destroyChannel}
            isChannelSettings={true}
            myRole={props.myRole}
          />
        </div>
      </div>
    );
  } else {
    return <div>You are not a channel administrator.</div>;
  }
}

export default ChannelSettings;
