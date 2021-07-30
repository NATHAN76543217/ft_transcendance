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

    contextValue.channelSocket?.emit("destroyChannel-front", {
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
