import axios from "axios";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../AppContext";
import AdminChannelElement from "../../components/admin/adminChannelElement";
import {
  Channel,
  ChannelMode,
  ChannelUser,
} from "../../models/channel/Channel";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { UserRole } from "../../models/user/IUser";
import ChannelSettingsProperties from "./channelSettingsProperties";

type ChannelSettingsParams = {
  id: string;
};

function ChannelSettings({
  match,
}: RouteComponentProps<ChannelSettingsParams>) {
  const contextValue = React.useContext(AppContext);
  const channelId = match.params.id !== undefined ? Number(match.params.id) : 4;

  const history = useHistory();

  const [channelInfo, setChannelInfo] = useState<Channel>({
    id: 0,
    name: "",
    mode: ChannelMode.public,
    myRole: ChannelRelationshipType.null,
    messages: [],
    users: [],
  });

  const setChannel = async () => {
    try {
      // const dataChannel = await axios.get(`/api/channels/${channelId}`, {
      const dataChannel = await axios.get(`/api/channels/` + channelId, {
        withCredentials: true,
      });
      // let a = dataChannel.data.slice();
      dataChannel.data.users.sort(
        (user1: { user: any }, user2: { user: any }) =>
          user1.user.name.localeCompare(user2.user.name)
      );
      const myRelationship = dataChannel.data.users.find((user: any) => {
        return user.user_id === contextValue.user?.id;
      });
      const myRole =
        myRelationship !== undefined
          ? myRelationship.type
          : ChannelRelationshipType.null;
      setChannelInfo({
        id: dataChannel.data.id,
        name: dataChannel.data.name,
        mode: dataChannel.data.mode,
        myRole: myRole,
        messages: [],
        users: dataChannel.data.users,
      });
    } catch (error) {}
  };

  const destroyChannel = async (id: number) => {
    if (channelInfo.myRole & ChannelRelationshipType.owner) {
      try {
        // console.log("Deleting channel " + id);
        await axios.delete(`/api/channels/${id}`, { withCredentials: true });
        history.push("/chat");
      } catch (error) {}
    } else {
    }
  };

  if (channelInfo.id !== channelId) {
    setChannel();
  }
  if (
    channelInfo.myRole &
    (ChannelRelationshipType.owner + ChannelRelationshipType.admin)
  ) {
    return (
      <div className="flex-grow">
        <ChannelSettingsProperties
          id={channelInfo.id}
          name={channelInfo.name}
          mode={channelInfo.mode}
          destroyChannel={destroyChannel}
          isChannelSettings={true}
          myRole={channelInfo.myRole}
        />
        <div>
          <h2 className="mt-12 text-3xl font-bold text-center">
            Channel Users
          </h2>
          <AdminChannelElement
            id={channelInfo.id}
            name={channelInfo.name}
            mode={channelInfo.mode}
            destroyChannel={destroyChannel}
            isChannelSettings={true}
            myRole={channelInfo.myRole}
          />
        </div>
      </div>
    );
  } else {
    return <div>You are not a channel administrator.</div>;
  }
}

export default ChannelSettings;
