import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { ChannelMode } from "../../models/channel/Channel";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../../models/channel/ChannelRelationship";
import { UserRole } from "../../models/user/IUser";
import CustomButton from "../utilities/CustomButton";
import AdminUserElement from "./adminUserElement";

const setchannelRelationshipsList = async (
  id: number,
  adminChannelElementInfo: ChannelElementStates,
  setAdminChannelElementInfo: any
) => {
  try {
    const data = await axios.get(`/api/channels/${id}`);
    // console.log('setchannelRelationshipsList - ' + data.data.id, data)
    let a = data.data.users.slice();
    a.sort((relation1: ChannelRelationship, relation2: ChannelRelationship) =>
      relation1.user.name.localeCompare(relation2.user.name)
    ).reverse();

    a.sort((relation1: ChannelRelationship, relation2: ChannelRelationship) =>
      relation1.type.toString().localeCompare(relation2.type.toString())
    ).reverse();

    if (
      JSON.stringify(a) !==
      JSON.stringify(adminChannelElementInfo.channelRelationshipsList)
    ) {
      setAdminChannelElementInfo({
        ...adminChannelElementInfo,
        channelRelationshipsList: a,
        channel_id: id,
      });
    }
  } catch (error) {}
};

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
};

const changeDestroyValidationButtonState = (
  adminChannelElementInfo: ChannelElementStates,
  setAdminChannelElementInfo: any
) => {
  setAdminChannelElementInfo({
    ...adminChannelElementInfo,
    showDestroyValidation: !adminChannelElementInfo.showDestroyValidation,
  });
};

const changeUsersListButtonState = (
  adminChannelElementInfo: ChannelElementStates,
  setAdminChannelElementInfo: any
) => {
  setAdminChannelElementInfo({
    ...adminChannelElementInfo,
    showUsersList: !adminChannelElementInfo.showUsersList,
  });
};

const displayDestroyButton = (
  adminChannelElementInfo: ChannelElementStates,
  setAdminChannelElementInfo: any
) => {
  const localChangeDestroyValidationButtonState = () => {
    changeDestroyValidationButtonState(
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );
  };

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
};

const displayDestroyValidationButton = (
  props: ChannelElementProps,
  adminChannelElementInfo: ChannelElementStates,
  setAdminChannelElementInfo: any
) => {
  const localChangeDestroyValidationButtonState = () => {
    changeDestroyValidationButtonState(
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );
  };

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
};

const translateRelationTypeToRole = (type: ChannelRelationshipType) => {
  switch (type) {
    case ChannelRelationshipType.Owner:
      return UserRole.Owner;
    case ChannelRelationshipType.Admin:
      return UserRole.Admin;
    case ChannelRelationshipType.Banned:
      return UserRole.Banned;
    case ChannelRelationshipType.Muted:
      return ChannelRelationshipType.Muted;
    case ChannelRelationshipType.Invited:
      return ChannelRelationshipType.Invited;
    default:
      return UserRole.User;
  }
};

interface ChannelElementProps {
  id: number;
  name: string;
  mode: ChannelMode;
  destroyChannel: (id: number) => void;
  isChannelSettings?: boolean;
  myRole: ChannelRelationshipType;
}

interface ChannelElementStates {
  channelRelationshipsList: ChannelRelationship[];
  showDestroyValidation: boolean;
  showUsersList: boolean | undefined;
  channel_id: number;
  myRole: ChannelRelationshipType;
}

function AdminChannelElement(props: ChannelElementProps) {
  const contextValue = React.useContext(AppContext);

  const [adminChannelElementInfo, setAdminChannelElementInfo] =
    useState<ChannelElementStates>({
      channelRelationshipsList: [],
      showDestroyValidation: false,
      showUsersList: props.isChannelSettings,
      channel_id: props.id,
      myRole: props.myRole,
    });

  useEffect(() => {
    const updateChannelIdAndRole = () => {
      setAdminChannelElementInfo({
        ...adminChannelElementInfo,
        channel_id: props.id,
        myRole: props.myRole,
      });
    };
    if (
      props.id !== adminChannelElementInfo.channel_id ||
      props.myRole !== adminChannelElementInfo.myRole
    ) {
      updateChannelIdAndRole();
    }
  }, [
    props.id,
    props.myRole,
    adminChannelElementInfo,
    setAdminChannelElementInfo,
  ]);

  // useEffect(() => {
  //   const test = () => {
  //     // setAdminChannelElementInfo({
  //     //   ...adminChannelElementInfo,
  //     // })
  //   }
  //   test()
  // }, [adminChannelElementInfo.channelRelationshipsList])

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const updateOneRelationship = async (
    channel_id: number,
    user_id: number,
    newType: ChannelRelationshipType
  ) => {
    let a = adminChannelElementInfo.channelRelationshipsList.slice();
    let index = a.findIndex((relation: ChannelRelationship) => {
      return (
        Number(relation.channel_id) === channel_id &&
        Number(relation.user_id === user_id)
      );
    });
    if (index !== -1) {
      a[index].type = newType;
    }
    setAdminChannelElementInfo({
      ...adminChannelElementInfo,
      channelRelationshipsList: a,
    });
  };

  const setRole = async (
    channel_id: number,
    user_id: number,
    type: ChannelRelationshipType,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) => {
    contextValue.channelSocket?.emit("updateChannelRelationship-front", {
      channel_id: channel_id,
      user_id: user_id,
      type: type,
    });
    updateOneRelationship(channel_id, user_id, type);
  };

  const banUserFromChannel = async (
    user_id: number,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) =>
    setRole(
      props.id,
      user_id,
      ChannelRelationshipType.Banned,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );

  const unbanUserFromChannel = async (
    user_id: number,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) =>
    setRole(
      props.id,
      user_id,
      ChannelRelationshipType.Member,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );

  const setAdminFromChannel = async (
    user_id: number,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) =>
    setRole(
      props.id,
      user_id,
      ChannelRelationshipType.Admin,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );

  const unsetAdminFromChannel = async (
    user_id: number,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) =>
    setRole(
      props.id,
      user_id,
      ChannelRelationshipType.Member,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );

  const muteUserFromChannel = async (
    user_id: number,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) =>
    setRole(
      props.id,
      user_id,
      ChannelRelationshipType.Muted,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );

  const unmuteUserFromChannel = async (
    user_id: number,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) =>
    setRole(
      props.id,
      user_id,
      ChannelRelationshipType.Member,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );

  const kickUserFromChannel = async (
    user_id: number,
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) =>
    setRole(
      props.id,
      user_id,
      ChannelRelationshipType.Null,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );

  const displayUsersList = (
    adminChannelElementInfo: ChannelElementStates,
    setAdminChannelElementInfo: any
  ) => {
    if (adminChannelElementInfo.showUsersList) {
      return (
        <div>
          <ul className="relative w-auto pt-4 pl-4">
            {adminChannelElementInfo.channelRelationshipsList.map(
              (relation) => {
                let translatedRole = translateRelationTypeToRole(relation.type);

                if (!(relation.type & ChannelRelationshipType.Null)) {
                  return (
                    <li key={relation.user_id.toFixed()} className="">
                      <AdminUserElement
                        id={relation.user_id}
                        name={relation.user.name}
                        role={translatedRole}
                        myRole={adminChannelElementInfo.myRole}
                        banUser={banUserFromChannel}
                        unbanUser={unbanUserFromChannel}
                        setAdmin={setAdminFromChannel}
                        unsetAdmin={unsetAdminFromChannel}
                        muteUser={muteUserFromChannel}
                        unmuteUser={unmuteUserFromChannel}
                        kickUser={kickUserFromChannel}
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
              }
            )}
          </ul>
        </div>
      );
    }
  };

  if (!adminChannelElementInfo.channelRelationshipsList.length) {
    setchannelRelationshipsList(
      props.id,
      adminChannelElementInfo,
      setAdminChannelElementInfo
    );
  }

  const localChangeUsersListButtonState = () => {
    if (!props.isChannelSettings) {
      changeUsersListButtonState(
        adminChannelElementInfo,
        setAdminChannelElementInfo
      );
    }
  };

  const displayChannelInformation = () => {
    if (!props.isChannelSettings) {
      return (
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
            {displayDestroyButton(
              adminChannelElementInfo,
              setAdminChannelElementInfo
            )}
            {displayDestroyValidationButton(
              props,
              adminChannelElementInfo,
              setAdminChannelElementInfo
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className={
        adminChannelElementInfo.showUsersList && !props.isChannelSettings
          ? "bg-blue-200 rounded-md py-1"
          : "py-1"
      }
    >
      {displayChannelInformation()}
      {displayUsersList(adminChannelElementInfo, setAdminChannelElementInfo)}
    </div>
  );
}

export default AdminChannelElement;
