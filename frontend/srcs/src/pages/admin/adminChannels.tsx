import axios from "axios";
import React from "react";

import { Channel, ChannelMode } from "../../models/channel/Channel";
import { IUser } from "../../models/user/IUser";
import AdminChannelElement from "../../components/admin/adminChannelElement";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";

interface AdminChannelProps {
  isOwner?: boolean | false;
  isAdmin?: boolean | false;
}

interface AdminChannelStates {
  list: Channel[];
}

class AdminChannels extends React.Component<
  AdminChannelProps,
  AdminChannelStates
> {
  constructor(props: AdminChannelProps) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    this.setAllChannels();
  }

  componentDidUpdate() {
    // console.log("Channels AdminUsers component did update")
  }

  async getAllUsers() {
    try {
      const dataUsers = await axios.get("/api/users", {
        withCredentials: true,
      });
      let a = dataUsers.data.slice();
      a.sort((user1: IUser, user2: IUser) =>
        user1.name.localeCompare(user2.name)
      );
      this.setState({ list: a });
    } catch (error) {}
  }

  setAllChannels = async () => {
    try {
      const dataUsers = await axios.get("/api/channels", {
        withCredentials: true,
      });
      let a = dataUsers.data.slice();
      a.sort((user1: Channel, user2: Channel) =>
        user1.name.localeCompare(user2.name)
      );
      this.setState({ list: a });
    } catch (error) {}
  };

  async deleteChannelRelationship(id: number) {
    try {
      await axios.delete(`/api/channels/leave/${id}`, {
        withCredentials: true,
      });
    } catch (error) {}
  }

  destroyChannel = async (id: number) => {
    try {
      // TODO: This should be handled on the backend directly
      /* const dataRelations = await axios.get(
        `/api/channels/${id}/`,
        { withCredentials: true }
      );
      dataRelations.data.map(async (relation: ChannelRelationship) => {
        this.deleteChannelRelationship(relation.user_id);
      }); */
      console.log("Deleting channel " + id);
      await axios.delete(`/api/channels/${id}`, { withCredentials: true });
    } catch (error) {}
    this.setAllChannels();
  };

  async createChannel(name: string, mode: ChannelMode) {
    try {
      await axios.post(
        "/api/channels",
        {
          name: name,
          password: "password",
          mode: mode,
        },
        { withCredentials: true }
      );
    } catch (error) {}
  }

  async createChannelRelationship(
    channel_id: string,
    user_id: string,
    type: ChannelRelationshipType
  ) {
    try {
      const dataUser = await axios.get("/api/users/" + user_id, {
        withCredentials: true,
      });
      const user_name = dataUser.data.name;
      await axios.post(
        "/api/channels/join",
        {
          channel_id: channel_id,
          user_id: user_id,
          user_name: user_name,
          type: type,
        },
        { withCredentials: true }
      );
    } catch (error) {}
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

    const sectionClass =
      "h-auto pt-4 pb-4 mx-4 my-4 bg-gray-200 flex-grow text-center";
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
                  <li key={channel.id} className="">
                    <AdminChannelElement
                      id={channel.id}
                      name={channel.name}
                      mode={channel.mode}
                      destroyChannel={this.destroyChannel}
                      isChannelSettings={false}
                      myRole={ChannelRelationshipType.owner}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default AdminChannels;
