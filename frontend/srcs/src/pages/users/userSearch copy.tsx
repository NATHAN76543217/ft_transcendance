import React from "react";

// import Button from '../../components/utilities/Button';
import UserInformation from "../../components/users/userInformation";
import UserSearchForm from "../../components/Forms/userSearchForm";
import IUserSearchFormValues from "../../models/user/SearchUser.dto";
import axios from "axios";
import { IUser } from "../../models/user/IUser";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import AppContext from "../../AppContext";

interface UserProps {}

interface UserStates {
  list: IUser[];
  username: string;
}

class UserSearch extends React.Component<UserProps, UserStates> {
  static contextType = AppContext;

  constructor(props: UserProps) {
    super(props);
    this.state = {
      list: [],
      username: "",
    };
    this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.unblockUser = this.unblockUser.bind(this);
    this.updateRelationshipState = this.updateRelationshipState.bind(this);
  }

  componentDidMount() {
    // this.del(1);
  }

  async del(id: number) {
    await axios.delete("/api/users/relationships/" + id);
  }

  componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
    // Typical usage (don't forget to compare props):
    // console.log("Previous list: " + prevStates.list);
    // console.log("Current list: " + this.state.list);
    // if (JSON.stringify(prevStates.list) !== JSON.stringify(this.state.list)) {
    //     this.setFriendAndBlockBoolean(this.state.list); // infinite loop ?
    // }
  }

  async setFriendAndBlockBoolean(list: IUser[]) {
    const contextValue = this.context;
    list.map(async (user, index) => {
      try {
        const data = await axios.get(
          "/api/users/relationships/" + user.id + "/" + contextValue.user.id
        ); // A CHANGER a remettre quand ca marchera
        if (data.data.type !== this.state.list[index].relationshipType) {
          let a = this.state.list.slice();
          a[index].relationshipType = data.data.type;
          this.setState({ list: a });
        }
      } catch (error) {
        let a = this.state.list.slice();
        a[index].relationshipType = UserRelationshipType.null;
        this.setState({ list: a });
      }
    });
  }

  onSubmit = async (values: IUserSearchFormValues) => {
    try {
      const data = await axios.get("/api/users?name=" + values.username);
      let a = data.data.slice();
      a.sort((user1: IUser, user2: IUser) =>
        user1.name.localeCompare(user2.name)
      );
      this.setFriendAndBlockBoolean(a);
      this.setState({ list: a });
    } catch (error) {}
    this.setState({ username: values.username });
  };

  updateRelationshipState(id: number, newType: UserRelationshipType) {
    let a = this.state.list.slice();
    let index = a.findIndex((userId) => userId.id === id);
    a[index].relationshipType = newType;
    this.setState({ list: a });
  }

  async addFriend(id: number) {
    const contextValue = this.context;
    let inf = contextValue.user.id < id;
    try {
      const currentRel = await axios.get(
        "/api/users/relationships/" + id + "/" + contextValue.user.id
      );
      if (
        !(
          inf &&
          currentRel.data.type & UserRelationshipType.pending_first_second
        ) &&
        !(
          !inf &&
          currentRel.data.type & UserRelationshipType.pending_second_first
        )
      ) {
        let newType: UserRelationshipType = currentRel.data.type;
        newType |= inf
          ? UserRelationshipType.pending_first_second
          : UserRelationshipType.pending_second_first;
        try {
          await axios.patch("/api/users/relationships/" + currentRel.data.id, {
            type: newType,
          });
          this.updateRelationshipState(id, newType);
        } catch (error) {}
      }
    } catch (error) {
      let newType: UserRelationshipType = inf
        ? UserRelationshipType.pending_first_second
        : UserRelationshipType.pending_second_first;
      try {
        await axios.post("/api/users/relationships", {
          user1_id: id + "",
          user2_id: contextValue.user.id,
          type: newType,
        });
        this.updateRelationshipState(id, newType);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async removeFriend(id: number) {
    const contextValue = this.context;
    try {
      const currentRel = await axios.get(
        "/api/users/relationships/" + id + "/" + contextValue.user.id
      );
      if (currentRel.data.type & UserRelationshipType.friends) {
        let newType: UserRelationshipType =
          currentRel.data.type & ~UserRelationshipType.friends;
        try {
          if (newType === UserRelationshipType.null) {
            await axios.delete(
              "/api/users/relationships/" + currentRel.data.id
            );
            this.updateRelationshipState(id, newType);
          } else {
            await axios.patch(
              "/api/users/relationships/" + currentRel.data.id,
              { type: newType }
            );
            this.updateRelationshipState(id, newType);
          }
        } catch (error) {}
      }
    } catch (error) {}
  }

  async blockUser(id: number) {
    const contextValue = this.context;
    let inf = contextValue.user.id < id;
    try {
      const currentRel = await axios.get(
        "/api/users/relationships/" + id + "/" + contextValue.user.id
      );
      if (
        !(
          inf && currentRel.data.type & UserRelationshipType.block_first_second
        ) &&
        !(
          !inf && currentRel.data.type & UserRelationshipType.block_second_first
        )
      ) {
        let newType: UserRelationshipType = currentRel.data.type;
        newType |= inf
          ? UserRelationshipType.block_first_second
          : UserRelationshipType.block_second_first;
        try {
          await axios.patch("/api/users/relationships/" + currentRel.data.id, {
            type: newType,
          });
          this.updateRelationshipState(id, newType);
        } catch (error) {}
      }
    } catch (error) {
      let newType: UserRelationshipType = inf
        ? UserRelationshipType.block_first_second
        : UserRelationshipType.block_second_first;
      try {
        await axios.post("/api/users/relationships", {
          user1_id: id + "",
          user2_id: contextValue.user.id,
          type: newType,
        });
        this.updateRelationshipState(id, newType);
      } catch (error) {}
    }
  }

  async unblockUser(id: number) {
    const contextValue = this.context;
    let inf = contextValue.user.id < id;
    try {
      const currentRel = await axios.get(
        "/api/users/relationships/" + id + "/" + contextValue.user.id
      );
      if (
        !(
          inf &&
          !(currentRel.data.type & UserRelationshipType.block_first_second)
        ) &&
        !(
          !inf &&
          !(currentRel.data.type & UserRelationshipType.block_second_first)
        )
      ) {
        let newType: UserRelationshipType = currentRel.data.type;
        newType &= inf
          ? ~UserRelationshipType.block_first_second
          : ~UserRelationshipType.block_second_first;
        try {
          if (newType === UserRelationshipType.null) {
            await axios.delete(
              "/api/users/relationships/" + currentRel.data.id
            );
            this.updateRelationshipState(id, newType);
          } else {
            await axios.patch(
              "/api/users/relationships/" + currentRel.data.id,
              { type: newType }
            );
            this.updateRelationshipState(id, newType);
          }
        } catch (error) {}
      }
    } catch (error) {}
  }

  render() {
    const contextValue = this.context;

    return (
      <div className="">
        <UserSearchForm onSubmit={this.onSubmit} />

        <ul>
          {this.state.list.map((user) => (
            <li key={user.id} className="relative w-full">
              <UserInformation
                id={user.id}
                name={user.name}
                status={user.status}
                nbWin={user.nbWin}
                nbLoss={user.nbLoss}
                imgPath={user.imgPath}
                relationshipTypes={user.relationshipType}
                idInf={contextValue.user.id < user.id}
                addFriend={this.addFriend}
                removeFriend={this.removeFriend}
                blockUser={this.blockUser}
                unblockUser={this.unblockUser}
                isInSearch
                isMe={user.id === contextValue.user.id}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default UserSearch;
