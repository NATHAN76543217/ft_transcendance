import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useHistory } from "react-router";
import AppContext from "../../AppContext";
import ChannelInviteDto from "../../models/channel/ChannelInvite.dto";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
import { IUser, UserChannelRelationship, UserRole } from "../../models/user/IUser";
import chatContext from "../../pages/chat/chatContext";
import ChannelInviteForm from "../Forms/channelInviteForm";
import { TooltipIconButton } from "../utilities/TooltipIconButton";
import { ChatTitle } from "./ChatTitle";


type UserActionsProps = {
  channelId: number;
  nbUsers: number;
};

function UserActions({ channelId, nbUsers }: UserActionsProps) {
  const nbUsersSpan = nbUsers && nbUsers > 1 ? nbUsers + ' users' : '1 user'
  return (
    <>
      <span className='mr-2 font-semibold'>{nbUsersSpan}</span>
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

  const setRole = async (channel_id: number, user_id: number, type: ChannelRelationshipType) => {
    contextValue.socket?.emit('updateChannelRelationship-front', {
      channel_id: channel_id,
      user_id: user_id,
      type: type
    });

    console.log('setRole')
    history.push(`/chat/c${channel_id}/refresh`);
    // updateOneRelationship(channel_id, user_id, type);
  };

  const onSubmitInvite = async (values: ChannelInviteDto) => {
    console.log('invite - chatContextValue', values, chatContextValue)
    if (values.username && chatContextValue.currentChannelRel) {
      const index = chatContextValue.currentChannelRel?.channel.users.findIndex((relation) => {
        return relation.user.name === values.username;
      })
      if (index === -1) {
        try {
          let users = await axios.get<IUser[]>(`/api/users?name=${values.username}`);
          console.log('users query', users.data)
          if (users.data && users.data.length === 1 && users.data[0].name === values.username) {
            setRole(chatContextValue.currentChannelRel?.channel.id, users.data[0].id, ChannelRelationshipType.Invited)
          }
        } catch (error) { console.log(error) }
      }
    }
  };

  // const localOnSubmit = (values: ChannelInviteDto) => {
  //   onSubmitInvite(values, chatContextValue);
  // }

  return (
    <>
      <UserActions
        channelId={channelId}
        nbUsers={nbUsers}
      />
      <div className="flex h-10 px-4">
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
    if (user.type & (ChannelRelationshipType.Owner + ChannelRelationshipType.Admin +
      ChannelRelationshipType.Member + ChannelRelationshipType.Muted)) {
      nbUsers++;
    }
    return true
  })
  return nbUsers;
}

function ChatActions({ channelRelation, userRelation }: ChatActionsProps) {
  const nbUsers = channelRelation ? getNbUsers(channelRelation) : 0;
  const userRole = channelRelation ? channelRelation.type : UserRole.User;
  if (userRole === undefined || channelRelation === undefined) {
    return <></>;
  }
  switch (userRole) {
    case UserRole.Admin:
      return <AdminActions
        channelId={channelRelation.channel.id}
        nbUsers={nbUsers}
      />;
    case UserRole.Owner:
      return <AdminActions
        channelId={channelRelation.channel.id}
        nbUsers={nbUsers}
      />;
    default:
      return <UserActions
        channelId={channelRelation.channel.id}
        nbUsers={nbUsers}
      />;
  }
}






type ChatHeaderProps = {
  myRole: ChannelRelationshipType;
  isChannel: boolean;
};

export function ChatHeader({ myRole, isChannel }: ChatHeaderProps) {
  const chatContextValue = useContext(chatContext);
  const contextValue = useContext(AppContext);

  const currentChat =
    chatContextValue.currentChannelRel !== undefined
      ? chatContextValue.currentChannelRel.channel
      : undefined;

  console.log('isChannel', isChannel)
  console.log('myRole', myRole)

  if (isChannel &&
    (myRole &
      (ChannelRelationshipType.Owner | ChannelRelationshipType.Admin | ChannelRelationshipType.Member))) {
    return (
      <header className="flex justify-between w-full h-10 p-4 bg-gray-300 border-b-2 border-gray-300">
        <ChatTitle
          channel={currentChat}
          isInHeader
        />
        <div className="flex items-center space-x-2">
          <ChatActions
            channelRelation={chatContextValue.currentChannelRel}
          />
            {/* userRole={contextValue.user?.role} */}

        </div>
      </header>
    );
  } else {
    return <header className="w-full h-10 bg-gray-200"></header>;
  }
}

// ChatHeader.defaultProps = {
//   children: <div />,
// };
