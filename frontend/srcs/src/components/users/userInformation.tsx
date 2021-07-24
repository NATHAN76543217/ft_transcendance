import CustomButton from "../utilities/CustomButton";
import { NavLink } from "react-router-dom";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import ChangeNameUserForm from "../Forms/userChangeNameForm";
import IUserChangeNameFormValues from "../../models/user/ChangeUserName.dto";
import React, { useEffect, useState } from "react";
import AppContext from "../../AppContext";
import UserPageState from "../../models/user/UserPageState";
import { UserStatus } from "../../models/user/IUser";
import { IAppContext } from "../../IAppContext";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";

type UserProps = {
  id: number; // optional ?
  name: string;
  status: UserStatus;
  nbWin?: number;
  nbLoss?: number;
  imgPath: string;
  twoFactorAuth?: boolean | false;
  isMe?: boolean | false;
  relationshipsList: AppUserRelationship[];
  idInf: boolean;
  isInSearch?: boolean | false;
  usernameErrorMessage?: string;
  handleClickTwoFactorAuth?: (
    userInfo: UserPageState,
    setUserInfo: any
  ) => void;
  onFileChange?: (
    fileChangeEvent: any,
    userInfo: UserPageState,
    setUserInfo: any,
    setUser: any
  ) => void;
  addFriend: any;
  removeFriend: any;
  blockUser: any;
  unblockUser: any;
  changeUsername?: (
    values: IUserChangeNameFormValues,
    userInfo: UserPageState,
    setUserInfo: any,
    setUser: any
  ) => void;
  userInfo: any;
  setUserInfo?: any;
};

function getStatusColor(param: UserStatus) {
  switch (param) {
    case UserStatus.Online:
      return " text-green-600";
    case UserStatus.Offline:
      return " text-red-600";
    case UserStatus.InGame:
      return " text-yellow-600";
    default:
      return "";
  }
}

function getStatus(param: UserStatus) {
  switch (param) {
    case UserStatus.Online:
      return "Online";
    case UserStatus.Offline:
      return "Offline";
    case UserStatus.InGame:
      return "In Game";
    default:
      return "";
  }
}

function displayWinAndLose(user: UserProps) {
  if (user.isInSearch) {
    return (
      <div className="w-24 mx-4 text-center">
        <div className="relative font-bold text-md">Win / Lose</div>
        <h1 className={"relative font-bold text-md "}>
          <span className="text-green-700">{user.nbWin}</span> /{" "}
          <span className="text-red-700">{user.nbLoss}</span>
        </h1>
      </div>
    );
  }
}

function displayProfilePicture(user: UserProps) {
  let path =
    user.imgPath === ""
      ? "/api/uploads/default-profile-picture.png"
      : "/api/uploads/" + user.imgPath;
  if (user.isInSearch) {
    return (
      <NavLink to={"/users/" + user.id}>
        <img
          className="object-contain w-32 h-full"
          src={path}
          alt="user profile"
        />
      </NavLink>
    );
  } else {
    return (
      <img
        className="object-contain w-32 h-full"
        src={path}
        alt="user profile"
      />
    );
  }
}

function onFileChangeTrigger(user: UserProps, ev: any, setUser: any) {
  if (user.onFileChange !== undefined) {
    return user.onFileChange(ev, user.userInfo, user.setUserInfo, setUser);
  } else {
    return;
  }
}

function displayFileChange(user: UserProps, setUser: any) {
  if (user.onFileChange !== undefined && user.isMe) {
    return (
      <div className="mt-1 align-center">
        <label className="cursor-pointer custom-file-upload">
          <input
            type="file"
            name="file"
            className="hidden"
            onChange={(ev) => onFileChangeTrigger(user, ev, setUser)}
          />
          <i className="fa fa-cloud-upload" />
          <span className="pl-1 ml-1 text-sm italic">Change picture</span>
        </label>
      </div>
    );
  }
}

function displayFriendButton(user: UserProps, type: UserRelationshipType, contextValue: IAppContext) {
  const addFriend = async (id: number) => {
    await user.addFriend(id, user.userInfo, user.setUserInfo, contextValue);
  };

  const removeFriend = async (id: number) => {
    await user.removeFriend(id, user.userInfo, user.setUserInfo, contextValue);
  };

  let isPending = user.idInf
    ? type & UserRelationshipType.pending_first_second
    : type & UserRelationshipType.pending_second_first;
  let isFriend =
    type & UserRelationshipType.pending_first_second &&
    type & UserRelationshipType.pending_second_first;
  let isAccept = user.idInf
    ? type & UserRelationshipType.pending_second_first
    : type & UserRelationshipType.pending_first_second;
  return (
    <div className="w-48 my-4 text-center">
      {!user.isMe ? (
        isFriend ? (
          <CustomButton
            content="Remove friend"
            // url="/users/unfriend"
            onClickFunctionId={removeFriend}
            argId={user.id}
            bg_color="bg-unset"
            // bg_hover_color="bg-pending"
            dark_text
          />
        ) : isPending ? (
          <CustomButton
            content="Pending request"
            // url="/users/pending"
            onClickFunctionId={removeFriend}
            argId={user.id}
            bg_color="bg-pending"
            // bg_hover_color="bg-secondary-dark"
            dark_text
          />
        ) : isAccept ? (
          <CustomButton
            content="Accept friend request"
            // url="/users/friend"
            onClickFunctionId={addFriend}
            argId={user.id}
            bg_color="bg-accept"
            // bg_hover_color="bg-secondary-dark"
            dark_text
          />
        ) : (
          <CustomButton
            content="Add friend"
            // url="/users/friend"
            onClickFunctionId={addFriend}
            argId={user.id}
            bg_color="bg-secondary"
            // bg_hover_color="bg-secondary-dark"
            dark_text
          />
        )
      ) : null}
    </div>
  );
}

function displayBlockButton(user: UserProps, type: UserRelationshipType, contextValue: IAppContext) {
  const blockUser = async (id: number) => {
    await user.blockUser(id, user.userInfo, user.setUserInfo, contextValue);
  };

  const unblockUser = async (id: number) => {
    await user.unblockUser(id, user.userInfo, user.setUserInfo, contextValue);
  };

  let isBlock = user.idInf
    ? type & UserRelationshipType.block_first_second
    : type & UserRelationshipType.block_second_first;

  return (
    <div className="w-48 my-4 text-center">
      {!user.isMe ? (
        !isBlock ? (
          <CustomButton
            content="Block user"
            // url="/users/block"
            onClickFunctionId={blockUser}
            argId={user.id}
            bg_color="bg-unset"
            // bg_hover_color="bg-secondary-dark"
            dark_text
          />
        ) : (
          <CustomButton
            content="Unblock user"
            // url="/users/unblock"
            onClickFunctionId={unblockUser}
            argId={user.id}
            bg_color="bg-secondary"
            // bg_hover_color="bg-unset-dark"
            dark_text
          />
        )
      ) : null}
    </div>
  );
}

function displayTwoFactorAuth(user: UserProps) {
  const localHandleClickTwoFactorAuth = async () => {
    if (user.handleClickTwoFactorAuth) {
      await user.handleClickTwoFactorAuth(user.userInfo, user.setUserInfo);
    }
  };

  return user.isMe && !user.isInSearch ? (
    <section className="relative flex items-center justify-center">
      <label className="font-bold text-gray-700">
        <input
          className="mr-2 leading-tight"
          type="checkbox"
          onChange={localHandleClickTwoFactorAuth}
          checked={user.twoFactorAuth}
        />
        <span className="text-sm">Activate 2 factor authentication</span>
      </label>
    </section>
  ) : null;
}

function displayChangeNameField(user: UserProps, setUser: any) {
  const localchangeUsername = async (values: IUserChangeNameFormValues) => {
    if (user.changeUsername) {
      await user.changeUsername(
        values,
        user.userInfo,
        user.setUserInfo,
        setUser
      );
    }
  };

  if (user.isMe && !user.isInSearch && user.changeUsername !== undefined) {
    return <ChangeNameUserForm onSubmit={localchangeUsername} />;
  } else {
    return <div></div>;
  }
}

function displayWrongUsernameMessage(user: UserProps) {
  if (user.usernameErrorMessage) {
    return (
      <div className="absolute bottom-0 w-48 font-bold text-red-600">
        {user.usernameErrorMessage}
      </div>
    );
  }
}

function displayUsername(user: UserProps) {
  if (user.isInSearch) {
    return (
      <NavLink to={"/users/" + user.id}>
        <span className="relative text-xl font-bold hover:underline">
          {user.name}
        </span>
      </NavLink>
    );
  } else {
    return <div className="relative text-xl font-bold">{user.name}</div>;
  }
}

function UserInformation(user: UserProps) {
  const contextValue = React.useContext(AppContext);

  const [userRelationshipType, setUserRelationshipType] = useState<UserRelationshipType>(
    UserRelationshipType.null
  )

  useEffect(() => {
    const setRelationshipType = async () => {
    let relation = user.relationshipsList.find((relationElem) => {
      return relationElem.user.id === user.id
    })
    const type = relation ? relation.relationshipType : UserRelationshipType.null
    if (type !== userRelationshipType) {
      setUserRelationshipType(type);
    }
  }
  setRelationshipType();
  }, [user.relationshipsList, setUserRelationshipType, userRelationshipType, user.id])

  
  return (
    <div className="py-4 px-8 h-42 bg-neutral">
      <section className="flex flex-wrap items-center justify-center py-2 my-2">
        <div className="w-32 mx-4">
          {displayProfilePicture(user)}
          {displayFileChange(user, contextValue.setUser)}
        </div>

        <div className="w-40 mx-2 text-center">
          {displayUsername(user)}
          <h1 className={"font-bold " + getStatusColor(user.status)}>
            {getStatus(user.status)}
          </h1>
          {displayWrongUsernameMessage(user)}
        </div>

        <div>{displayWinAndLose(user)}</div>
        <div>
          {displayFriendButton(user, userRelationshipType, contextValue)}
          {displayBlockButton(user, userRelationshipType, contextValue)}
        </div>
      </section>
      {displayChangeNameField(user, contextValue.setUser)}
      {displayTwoFactorAuth(user)}
    </div>
  );
}

export default UserInformation;
