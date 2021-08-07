import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import AppContext from "../../AppContext";
import ChannelInviteDto from "../../models/channel/ChannelInvite.dto";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { Events } from "../../models/channel/Events";
import { CreateGameDto } from "../../models/game/CreateGame.dto";
import { Match } from "../../models/game/Match";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
import {
  IUser,
  UserChannelRelationship,
  UserRole,
  UserStatus,
} from "../../models/user/IUser";
import chatContext from "../../pages/chat/chatContext";
import ChannelInviteForm from "../Forms/channelInviteForm";
import { TooltipIconButton } from "../utilities/TooltipIconButton";
import { ChatTitle } from "./ChatTitle";
import { FriendState } from "./ChatView";

type UserActionsProps = {
  channelId: number;
  nbUsers: number;
};

function UserActions({ nbUsers }: UserActionsProps) {
  const nbUsersSpan = nbUsers && nbUsers > 1 ? nbUsers + " users" : "1 user";
  return (
    <>
      <span className="flex-no-wrap hidden w-16 font-semibold lg:flex ">
        {nbUsersSpan}
      </span>
    </>
  );
}

type AdminActionsProps = {
  channelId: number;
  nbUsers: number;
};

function AdminActions({ channelId, nbUsers }: AdminActionsProps) {
  const contextValue = React.useContext(AppContext);
  const chatContextValue = useContext(chatContext);

  const history = useHistory();

  const setRole = async (
    channel_id: number,
    user_id: number,
    type: ChannelRelationshipType
  ) => {
    contextValue.eventSocket?.emit(Events.Server.UpdateChannelRelation, {
      channel_id: channel_id,
      user_id: user_id,
      type: type,
    });

    console.log("setRole");
    history.push(`/chat/c${channel_id}/refresh`);
    // updateOneRelationship(channel_id, user_id, type);
  };

  const onSubmitInvite = async (values: ChannelInviteDto) => {
    console.log("invite - chatContextValue", values, chatContextValue);
    if (values.username && chatContextValue.currentChannelRel) {
      const index = chatContextValue.currentChannelRel?.channel.users.findIndex(
        (relation) => {
          return relation.user.name === values.username;
        }
      );
      if (index === -1) {
        try {
          let users = await axios.get<IUser[]>(
            `/api/users?name=${values.username}`
          );
          console.log("users query", users.data);
          if (
            users.data &&
            users.data.length === 1 &&
            users.data[0].name === values.username
          ) {
            setRole(
              chatContextValue.currentChannelRel?.channel.id,
              users.data[0].id,
              ChannelRelationshipType.Invited
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // const localOnSubmit = (values: ChannelInviteDto) => {
  //   onSubmitInvite(values, chatContextValue);
  // }

  return (
    <>
      <UserActions channelId={channelId} nbUsers={nbUsers} />
      <div className="flex h-10 md:px-2">
        <ChannelInviteForm onSubmit={onSubmitInvite} />
      </div>
      <TooltipIconButton
        tooltip="Settings"
        icon="fa-cog"
        href={`/chat/c${channelId}/settings`}
      />
    </>
  );
}

type ChatActionsProps = {
  // userRole?: UserRole;
  channelRelation?: UserChannelRelationship;
  userRelation?: AppUserRelationship;
};

const getNbUsers = (relation: UserChannelRelationship) => {
  let nbUsers = 0;
  relation.channel.users.map((user) => {
    if (
      user.type &
      (ChannelRelationshipType.Owner +
        ChannelRelationshipType.Admin +
        ChannelRelationshipType.Member +
        ChannelRelationshipType.Muted)
    ) {
      nbUsers++;
    }
    return true;
  });
  return nbUsers;
};

function ChatActions({ channelRelation, userRelation }: ChatActionsProps) {
  const nbUsers = channelRelation ? getNbUsers(channelRelation) : 0;
  const userRole = channelRelation ? channelRelation.type : UserRole.User;
  if (userRole === undefined || channelRelation === undefined) {
    return <></>;
  }
  switch (userRole) {
    case UserRole.Admin:
      return (
        <AdminActions
          channelId={channelRelation.channel.id}
          nbUsers={nbUsers}
        />
      );
    case UserRole.Owner:
      return (
        <AdminActions
          channelId={channelRelation.channel.id}
          nbUsers={nbUsers}
        />
      );
    default:
      return (
        <UserActions channelId={channelRelation.channel.id} nbUsers={nbUsers} />
      );
  }
}

type ChatHeaderProps = {
  myRole: ChannelRelationshipType;
  isChannel: boolean;
  isPrivateConv: boolean;
  friendInfo: FriendState;
};

export function ChatHeader({
  myRole,
  isChannel,
  isPrivateConv,
  friendInfo,
}: ChatHeaderProps) {
  const chatContextValue = useContext(chatContext);
  const contextValue = useContext(AppContext);

  const history = useHistory();

  const currentChat =
    chatContextValue.currentChannelRel !== undefined
      ? chatContextValue.currentChannelRel.channel
      : undefined;

  const getPrivateSenderName = () => {
    if (isPrivateConv) {
      const sender = contextValue.relationshipsList.find((rel) => {
        // return rel.user.id === userRel?.user.id
        return rel.user.id === friendInfo.id;
      })?.user;
      if (sender) {
        return sender.name;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const inviteFriendToPlay = async () => {
    const gameData: CreateGameDto = { guests: [friendInfo.id], ruleset: {} };

    console.log("Creating new game", gameData);

    try {
      const response = await axios.post<Match>("/api/matches", gameData);
      console.log("Game created, redirecting to:", response.data);
      history.push(`/game/${response.data.id}`);
    } catch (e) {
      console.error("TODO: inviteFriend:", e);
    }
  };

  const acceptGameRequest = async () => {
    console.log("[chat header] Accepting game invitation");
    if (friendInfo.gameInvite) {
      //matchSocket?.emit(ServerMessages.ACCEPT_INVITATION, { id: friendInfo.gameInvite.id });
      history.push(`/game/${friendInfo.gameInvite.data}`);
    }
  };

  const cancelGameRequest = async () => {
    try {
      if (friendInfo.gameInvite) {
        await axios.delete(`/api/matches/${friendInfo.gameInvite.data}`);
        await axios.delete(`/api/messages/${friendInfo.gameInvite.id}`);
        console.log("Game invitation deleted");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displayInviteButton = () => {
    if (friendInfo.status === UserStatus.Online) {
      if (!friendInfo.gameInvite) {
        return (
          <button
            className={
              "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
              " bg-purple-300 hover:bg-purple-400" +
              " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
            }
            onClick={() => inviteFriendToPlay()}
          >
            Invite to play
          </button>
        );
      } else {
        if (friendInfo.gameInvite.sender_id === friendInfo.id) {
          return (
            <button
              className={
                "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
                " bg-green-300 hover:bg-green-400 text-xs" +
                " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
              }
              onClick={() => acceptGameRequest()}
            >
              Accept game request
            </button>
          );
        } else {
          return (
            <button
              className={
                "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
                " bg-red-400 hover:bg-red-500" +
                " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
              }
              onClick={() => cancelGameRequest()}
            >
              Cancel game request
            </button>
          );
        }
      }
    }
  };

  const displayWatchButton = () => {
    if (friendInfo.status === UserStatus.InGame) {
      return (
        <NavLink
          className={
            "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
            " bg-yellow-300 hover:bg-yellow-400" +
            " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
          }
          to={`/game/${friendInfo.roomId}`}
        >
          {"Watch the game"}
        </NavLink>
      );
    }
  };

  const displayPrivateConvHeader = () => {
    return (
      <header className="flex justify-between w-full h-10 p-2 bg-gray-300 border-b-2 border-gray-300">
        <span className="font-semibold pl-4">{getPrivateSenderName()}</span>
        <div className="flex items-center ">
          {displayInviteButton()}
          {displayWatchButton()}
        </div>
      </header>
    );
  };

  if (
    isChannel &&
    myRole &
      (ChannelRelationshipType.Owner |
        ChannelRelationshipType.Admin |
        ChannelRelationshipType.Member)
  ) {
    return (
      <header className="flex justify-between w-full h-10 p-2 bg-gray-300 border-b-2 border-gray-300">
        <ChatTitle channel={currentChat} isInHeader />
        <div className="flex items-center ">
          <ChatActions channelRelation={chatContextValue.currentChannelRel} />
        </div>
      </header>
    );
  } else if (isPrivateConv) {
    return displayPrivateConvHeader();
  } else {
    return <header className="w-full h-10 bg-gray-200"></header>;
  }
}
