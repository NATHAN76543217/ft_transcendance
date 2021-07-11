import axios from "axios";
import React from "react";
import { ChannelMode } from "../../models/channel/Channel";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../../models/channel/ChannelRelationship";
import { UserRole } from "../../models/user/IUser";
import CustomButton from "../utilities/CustomButton";
import AdminUserElement from "./adminUserElement";

type ChannelElementProps = {
  id: number;
  name: string;
  mode: ChannelMode;
  destroyChannel: (id: number) => void;
};

type ChannelElementStates = {
  channelRelationshipsList: ChannelRelationship[];
  showDestroyValidation: boolean;
  showUsersList: boolean;
};

class AdminChannelElement extends React.Component<
  ChannelElementProps,
  ChannelElementStates
> {
  constructor(props: ChannelElementProps) {
    super(props);
    this.state = {
      channelRelationshipsList: [],
      showDestroyValidation: false,
      showUsersList: false,
    };
  }

  componentDidMount() {
    this.setchannelRelationshipsList();
  }

  componentDidUpdate() {}

  async setchannelRelationshipsList() {
    try {
      const dataChannelRelationships = await axios.get(
        "/api/channels/relationships/" + this.props.id
      );
      let a = dataChannelRelationships.data.slice();
      a.sort((relation1: ChannelRelationship, relation2: ChannelRelationship) =>
        relation1.user_name.localeCompare(relation2.user_name)
      );
      this.setState({ channelRelationshipsList: a });
    } catch (error) {}
  }

  displayMode() {
    const divClass = "italic text-sm ";
    switch (this.props.mode) {
      case ChannelMode.public:
        return <div className={divClass + " text-green-600"}>Public</div>;
      case ChannelMode.protected:
        return <div className={divClass + "text-yellow-600"}>Protected</div>;
      case ChannelMode.private:
        return <div className={divClass + "text-red-600"}>Private</div>;
      default:
        return <div className={divClass + "text-gray-700"}></div>;
    }
  }

  changeDestroyValidationButtonState = () => {
    this.setState({ showDestroyValidation: !this.state.showDestroyValidation });
  };

  changeUsersListButtonState = () => {
    this.setState({ showUsersList: !this.state.showUsersList });
  };

  displayDestroyButton() {
    if (!this.state.showDestroyValidation) {
      return (
        <div className="relative inline-block w-auto h-6 text-center">
          <button
            className="inline-block w-full px-2 font-semibold text-gray-900 rounded-md justify-centerw-full bg-unset text-md focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
            onClick={this.changeDestroyValidationButtonState}
          >
            Destroy channel
          </button>
        </div>
      );
    }
  }

  displayDestroyValidationButton() {
    if (this.state.showDestroyValidation) {
      return (
        <div className="inline-flex items-center justify-center h-6 text-center rrelative w-54">
          <CustomButton
            content="Confirm destruction?"
            // url="/users/block"
            onClickFunctionId={this.props.destroyChannel}
            argId={this.props.id}
            bg_color="bg-unset"
            // bg_hover_color="bg-secondary-dark"
            dark_text
            text_size="text-sm"
          />
          <CustomButton
            content="No"
            // url="/users/block"
            onClickFunctionId={this.changeDestroyValidationButtonState}
            argId={this.props.id}
            bg_color="bg-secondary"
            // bg_hover_color="bg-secondary-dark"
            dark_text
            text_size="text-sm"
          />
        </div>
      );
    }
  }

  translateRelationTypeToRole(type: ChannelRelationshipType) {
    switch (type) {
      case ChannelRelationshipType.owner:
        return UserRole.owner;
      case ChannelRelationshipType.admin:
        return UserRole.admin;
      case ChannelRelationshipType.ban:
        return UserRole.ban;
      default:
        return UserRole.null;
    }
  }

  private async setChannelUserRelationship(
    id: number,
    type: ChannelRelationshipType
  ) {
    try {
      let a = this.state.channelRelationshipsList.slice();
      let index = a.findIndex((relation) => relation.user_id === id);
      if (index !== -1) {
        let relationId = a[index].user_id;
        await axios.patch("/api/channels/update/" + relationId, {
          type: type,
        });
        a[index].type = type;
        this.setState({ channelRelationshipsList: a });
      }
    } catch (error) {}
  }

  banUserFromChannel = async (id: number) =>
    this.setChannelUserRelationship(id, ChannelRelationshipType.ban);

  unbanUserFromChannel = async (id: number) =>
    this.setChannelUserRelationship(id, ChannelRelationshipType.standard);

  setAdminFromChannel = async (id: number) =>
    this.setChannelUserRelationship(id, ChannelRelationshipType.admin);

  unsetAdminFromChannel = async (id: number) =>
    this.setChannelUserRelationship(id, ChannelRelationshipType.standard);

  displayUsersList() {
    if (this.state.showUsersList) {
      return (
        <div>
          <ul className="relative w-auto pt-4 pl-4">
            {this.state.channelRelationshipsList.map((relation) => {
              let translatedRole = this.translateRelationTypeToRole(
                relation.type
              );

              if (!(relation.type & ChannelRelationshipType.null)) {
                return (
                  <li key={relation.user_id.toFixed()} className="">
                    <AdminUserElement
                      id={relation.user_id}
                      name={relation.user_name}
                      role={translatedRole}
                      myRole={UserRole.owner}
                      banUser={this.banUserFromChannel}
                      unbanUser={this.unbanUserFromChannel}
                      setAdmin={this.setAdminFromChannel}
                      unsetAdmin={this.unsetAdminFromChannel}
                      isChannelUserElement
                    />
                  </li>
                );
              } else {
                return (
                  <li key={relation.user_id} className="">
                    <div></div>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="flex items-center h-8 mt-2 group">
          <div className="flex">
            <div className="flex justify-center w-24 mr-2">
              {this.displayMode()}
            </div>
            <div
              className="w-48 font-bold text-md"
              onClick={this.changeUsersListButtonState}
            >
              {this.props.name}
            </div>
          </div>
          <div className="block w-48">
            {this.displayDestroyButton()}
            {this.displayDestroyValidationButton()}
          </div>
        </div>
        <div>{this.displayUsersList()}</div>
      </div>
    );
  }
}

export default AdminChannelElement;
