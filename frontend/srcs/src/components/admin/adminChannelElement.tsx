import axios from "axios";
import React, { useState } from "react";
import AppContext from "../../AppContext";
import { ChannelMode } from "../../models/channel/Channel";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../../models/channel/ChannelRelationship";
import { UserRole } from "../../models/user/IUser";
import User from "../../pages/users/user";
import CustomButton from "../utilities/CustomButton";
import AdminUserElement from "./adminUserElement";


const setchannelRelationshipsList = async (id: number, adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) => {
  // console.log("setchannelRelationshipsList")

  try {
    const data = await axios.get(
      `/api/channels/${id}`
    );
    // console.log("setchannelRelationshipsList", data)
    let a = data.data.users.slice();

    a.sort((relation1: ChannelRelationship, relation2: ChannelRelationship) =>
    relation1.user.name.localeCompare(relation2.user.name)
  ).reverse();

    a.sort((relation1: ChannelRelationship, relation2: ChannelRelationship) =>
      relation1.type.toString().localeCompare(relation2.type.toString())
    ).reverse();
    
    if (JSON.stringify(a) !== JSON.stringify(adminChannelElementInfo.channelRelationshipsList)) {
      setAdminChannelElementInfo({
        ...adminChannelElementInfo,
        channelRelationshipsList: a
      });
    }
  } catch (error) { }
}

const displayMode = (props: ChannelElementProps) => {
  const divClass = "italic text-sm ";
  switch (props.mode) {
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

const changeDestroyValidationButtonState = (adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) => {
  setAdminChannelElementInfo({
    ...adminChannelElementInfo,
    showDestroyValidation: !adminChannelElementInfo.showDestroyValidation
  });
};

const changeUsersListButtonState = (adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) => {
  setAdminChannelElementInfo({
    ...adminChannelElementInfo,
    showUsersList: !adminChannelElementInfo.showUsersList
  });
};

const displayDestroyButton = (adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) => {
  const localChangeDestroyValidationButtonState = () => {
    changeDestroyValidationButtonState(adminChannelElementInfo, setAdminChannelElementInfo)
  }

  if (!adminChannelElementInfo.showDestroyValidation) {
    return (
      <div className="relative inline-block w-auto h-6 text-center">
        <button
          className="inline-block w-full px-2 font-semibold text-gray-900 rounded-md justify-centerw-full bg-unset text-md focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
          onClick={localChangeDestroyValidationButtonState}
        >
          Destroy channel
          </button>
      </div>
    );
  }
}

const displayDestroyValidationButton = (props: ChannelElementProps, adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) => {
  const localChangeDestroyValidationButtonState = () => {
    changeDestroyValidationButtonState(adminChannelElementInfo, setAdminChannelElementInfo)
  }

  if (adminChannelElementInfo.showDestroyValidation) {
    return (
      <div className="inline-flex items-center justify-center h-6 text-center rrelative w-54">
        <CustomButton
          content="Confirm destruction?"
          // url="/users/block"
          onClickFunctionId={props.destroyChannel}
          argId={props.id}
          bg_color="bg-unset"
          // bg_hover_color="bg-secondary-dark"
          dark_text
          text_size="text-sm"
        />
        <CustomButton
          content="No"
          // url="/users/block"
          onClickFunctionId={localChangeDestroyValidationButtonState}
          argId={props.id}
          bg_color="bg-secondary"
          // bg_hover_color="bg-secondary-dark"
          dark_text
          text_size="text-sm"
        />
      </div>
    );
  }
}

const translateRelationTypeToRole = (type: ChannelRelationshipType) => {
  switch (type) {
    case ChannelRelationshipType.owner:
      return UserRole.owner;
    case ChannelRelationshipType.admin:
      return UserRole.admin;
    case ChannelRelationshipType.banned:
      return UserRole.ban;
    default:
      return UserRole.null;
  }
}

const setChannelUserRelationship = async (
  user_id: number,
  type: ChannelRelationshipType,
  adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any
) => {
  try {
    console.log("----- setChannelUserRelationship ----- begin")
    // await axios.patch(`/api/channels/${adminChannelElementInfo.channel_id}/update/${user_id}`, {
      await axios.patch(`/api/channels/update`, {
        type: type,
      });
      console.log("----- setChannelUserRelationship ----- end")
      // a[index].type = type;
      // setAdminChannelElementInfo({
      //   ...adminChannelElementInfo,
      //   channelRelationshipsList: a,
      // });

      setchannelRelationshipsList(adminChannelElementInfo.channel_id, adminChannelElementInfo, setAdminChannelElementInfo)
  } catch (error) { }
}

const banUserFromChannel = async (user_id: number, adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) =>
  setChannelUserRelationship(user_id, ChannelRelationshipType.banned, adminChannelElementInfo, setAdminChannelElementInfo);

const unbanUserFromChannel = async (user_id: number, adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) =>
  setChannelUserRelationship(user_id, ChannelRelationshipType.member, adminChannelElementInfo, setAdminChannelElementInfo);

const setAdminFromChannel = async (user_id: number, adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) =>
  setChannelUserRelationship(user_id, ChannelRelationshipType.admin, adminChannelElementInfo, setAdminChannelElementInfo);

const unsetAdminFromChannel = async (user_id: number, adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) =>
  setChannelUserRelationship(user_id, ChannelRelationshipType.member, adminChannelElementInfo, setAdminChannelElementInfo);

const displayUsersList = (adminChannelElementInfo: ChannelElementStates, setAdminChannelElementInfo: any) => {
  // console.log("displayUsersList", adminChannelElementInfo)
  if (adminChannelElementInfo.showUsersList) {
    return (
      <div>
        <ul className="relative w-auto pt-4 pl-4">
          {adminChannelElementInfo.channelRelationshipsList.map((relation) => {
            let translatedRole = translateRelationTypeToRole(
              relation.type
            );

            if (!(relation.type & ChannelRelationshipType.null)) {
              return (
                <li key={relation.user_id.toFixed()} className="">
                  <AdminUserElement
                    id={relation.user_id}
                    name={relation.user.name}
                    role={translatedRole}
                    myRole={UserRole.owner}
                    banUser={banUserFromChannel}
                    unbanUser={unbanUserFromChannel}
                    setAdmin={setAdminFromChannel}
                    unsetAdmin={unsetAdminFromChannel}
                    isChannelUserElement
                    adminInfo={adminChannelElementInfo}
                    setAdminInfo={setAdminChannelElementInfo}
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

interface ChannelElementProps {
  id: number;
  name: string;
  mode: ChannelMode;
  destroyChannel: (id: number) => void;
};

interface ChannelElementStates {
  channelRelationshipsList: ChannelRelationship[];
  showDestroyValidation: boolean;
  showUsersList: boolean;
  channel_id: number;
};

function AdminChannelElement(props: ChannelElementProps) {
  const contextValue = React.useContext(AppContext);

  const [adminChannelElementInfo, setAdminChannelElementInfo] = useState<ChannelElementStates>({
    channelRelationshipsList: [],
    showDestroyValidation: false,
    showUsersList: false,
    channel_id: props.id,
  });

  setchannelRelationshipsList(props.id, adminChannelElementInfo, setAdminChannelElementInfo);

  const localChangeUsersListButtonState = () => {
    changeUsersListButtonState(adminChannelElementInfo, setAdminChannelElementInfo)
  }

  return (
    <div className={adminChannelElementInfo.showUsersList ? "bg-blue-200 rounded-md py-1" : "py-1"}>
      <div className="flex items-center h-8 mt-2 group">
        <div className="flex">
          <div className="flex justify-center w-24 mr-2">
            {displayMode(props)}
          </div>
          <div
            className="w-48 font-bold cursor-pointer text-md hover:underline"
            onClick={localChangeUsersListButtonState}
          >
            {props.name}
          </div>
        </div>
        <div className="block w-48">
          {displayDestroyButton(adminChannelElementInfo, setAdminChannelElementInfo)}
          {displayDestroyValidationButton(props, adminChannelElementInfo, setAdminChannelElementInfo)}
        </div>
      </div>
      <div>{displayUsersList(adminChannelElementInfo, setAdminChannelElementInfo)}</div>
    </div>
  );
}


export default AdminChannelElement;
