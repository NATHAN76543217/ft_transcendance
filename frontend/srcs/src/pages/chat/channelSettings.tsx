import axios from "axios";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import AppContext from "../../AppContext";
import AdminChannelElement from "../../components/admin/adminChannelElement";
import { Channel, ChannelMode, ChannelUser,  } from "../../models/channel/Channel";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { UserRole } from "../../models/user/IUser";
import AdminChannels from "./adminChannels";
import AdminUsers from "./adminUsers";

type ChannelSettingsParams = {
  id: string;
};

function ChannelSettings({
  match,
}: RouteComponentProps<ChannelSettingsParams>) {
  const contextValue = React.useContext(AppContext);
  const channelId = match.params.id !== undefined ? Number(match.params.id) : 4;

  
  const [channelInfo, setChannelInfo] = useState<Channel>({
    id: 0,
    name: "",
    mode: ChannelMode.public,
    myRole: ChannelRelationshipType.null,
    // messages: Message[];
    users: [],
  })
  
  const setChannel = async () => {
    try {
      // const dataChannel = await axios.get(`/api/channels/${channelId}`, {
      const dataChannel = await axios.get(`/api/channels/` + channelId, {
        withCredentials: true,
      });
      // let a = dataChannel.data.slice();
      dataChannel.data.users.sort((user1: {user: any}, user2: {user: any}) =>
        user1.user.name.localeCompare(user2.user.name)
      );

      const myRelationship = dataChannel.data.users.find((user: any) => {
      return user.user_id === contextValue.user?.id
      });

      const myRole = myRelationship !== undefined ? myRelationship.type : ChannelRelationshipType.null

      console.log("myRelationship", myRelationship)

      setChannelInfo({
        id: dataChannel.data.id,
        name: dataChannel.data.name,
        mode: dataChannel.data.mode,
        myRole: myRole,
        users: dataChannel.data.users
      });
      console.log("dataChannel.data", dataChannel.data)
    } catch (error) { console.log("error setChannel") }
  };

  const destroyChannel = async (id: number) => {
    try {
      console.log("Deleting channel " + id);
      await axios.delete(`/api/channels/${id}`, { withCredentials: true });
    } catch (error) { }
    // this.setAllChannels();
  };

  // useEffect(() => {
  //   const test = () => {
  //     console.log("---------- useEffect", channelInfo)
  //   }
  // }, [channelInfo]);

  if (channelInfo.id !== channelId) {
    setChannel()
  }
  // if (true || contextValue.myRole & (UserRole.owner + UserRole.admin)) {
  return (
    <div>
      <AdminChannelElement
        id={channelInfo.id}
        name={channelInfo.name}
        mode={channelInfo.mode}
        destroyChannel={destroyChannel}
        isChannelSettings={true}
        myRole={channelInfo.myRole}
      />
    </div>
  );
  // } else {
  //   return <div>You are not a channel administrator.</div>;
  // }
}


export default ChannelSettings;
