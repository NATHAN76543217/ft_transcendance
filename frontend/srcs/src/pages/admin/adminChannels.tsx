import axios from "axios";
import React from "react";

import { Channel } from "../../models/channel/Channel";
import { IUser } from "../../models/user/IUser";
import AdminChannelElement from "../../components/admin/adminChannelElement";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import AppContext from "../../AppContext";
import { Events } from "../../models/channel/Events";

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

  static contextType = AppContext;

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

  removeOneChannel = async (channel_id: number) => {
    try {
      await axios.get("/api/channels", {
        withCredentials: true,
      });
      let a = this.state.list.slice();
      const index = a.findIndex((channel) => {
        return Number(channel.id === channel_id);
      });
      if (index !== -1) {
        a.splice(index, 1);
      }
      this.setState({ list: a });
    } catch (error) {}
  };

  destroyChannel = async (channel_id: number) => {
    console.log("Deleting channel " + channel_id);

    this.context.socket?.emit(Events.Server.DestroyChannel, {
      channel_id: channel_id,
    });
    this.removeOneChannel(channel_id);
  };

  // async createChannel(name: string, mode: ChannelMode) {
  //   try {
  //     const newChannel = await axios.post(
  //       "/api/channels",
  //       {
  //         name: name,
  //         password: "password",
  //         mode: mode,
  //       },
  //       { withCredentials: true }
  //     );
  //     console.log('new channel created', newChannel)
  //     this.context.socket?.emit(Events.Server.JoinChannel, {
  //       channel_id: newChannel.data.id,
  //     });
  //   } catch (error) { }
  // }

  // async createChannelRelationship(
  //   channel_id: string,
  //   user_id: string,
  //   type: ChannelRelationshipType
  // ) {
  //   try {
  //     const dataUser = await axios.get("/api/users/" + user_id, {
  //       withCredentials: true,
  //     });
  //     const user_name = dataUser.data.name;
  //     await axios.post(
  //       "/api/channels/join",
  //       {
  //         channel_id: channel_id,
  //         user_id: user_id,
  //         user_name: user_name,
  //         type: type,
  //       },
  //       { withCredentials: true }
  //     );
  //   } catch (error) { }
  // }

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

    const sectionClass = "h-auto flex-grow text-center";

    return (
      <div className="flex justify-center mb-8">
        <div className="p-4 mt-12 mb-4 border-2 border-gray-300 rounded-sm bg-neutral ">
          <h2 className="w-full text-3xl font-bold text-center">
            Channels Administration
          </h2>
          <div className="flex flex-wrap ">
            <section className={sectionClass}>
              <ul className="pt-4 w-max-md">
                {this.state.list.map((channel) => {
                  return (
                    <li key={channel.id} className="grid justify-center my-4 ">
                      <AdminChannelElement
                        id={channel.id}
                        name={channel.name}
                        mode={channel.mode}
                        destroyChannel={this.destroyChannel}
                        isChannelSettings={false}
                        myRole={ChannelRelationshipType.Owner}
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminChannels;
