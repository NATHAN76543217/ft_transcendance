import React from "react";
import { useHistory } from "react-router";
import AppContext from "../../AppContext";
import AdminChannelElement from "../../components/admin/adminChannelElement";
import {
  ChannelMode,
  ChannelUserRelationship,
  Message,
} from "../../models/channel/Channel";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { Events } from "../../models/channel/Events";
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

  const history = useHistory();

  const destroyChannel = async (channel_id: number) => {
    console.log("Deleting channel " + channel_id);

    contextValue.eventSocket?.emit(Events.Server.DestroyChannel, {
      channel_id: channel_id,
    });
    chatContextValue.setCurrentChannelRel(undefined);
    history.push("/chat");
  };

  if (
    props.myRole &
    (ChannelRelationshipType.Owner | ChannelRelationshipType.Admin)
  ) {
    return (
      <div className="grid justify-center ">
        <ChannelSettingsProperties
          id={props.id}
          name={props.name}
          mode={props.mode}
          destroyChannel={destroyChannel}
          isChannelSettings={true}
          myRole={props.myRole}
        />
        <div className="grid justify-center pt-4 pb-4 mt-8 border-2 border-gray-300 rounded-sm bg-neutral w-96">
          <h2 className="text-3xl font-bold text-center">Channel Users</h2>
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
