import React, { useContext } from "react";
import { ChatMessageList } from "../../components/chat/ChatMessageList";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { TooltipIconButton } from "../utilities/TooltipIconButton";
import { useForm } from "react-hook-form";
import { TextInput } from "../utilities/TextInput";
import { Socket } from "socket.io-client";
import AppContext from "../../AppContext";
import { IUser, UserChannelRelationship, UserRole } from "../../models/user/IUser";
import chatContext from "../../pages/chat/chatContext";
import { Route, RouteComponentProps, Switch, useHistory, Redirect } from "react-router-dom";
import ChannelInviteForm from "../Forms/channelInviteForm";
import ChannelInviteDto from "../../models/channel/ChannelInvite.dto";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import axios from "axios";
import ChannelSettings from "../../pages/chat/channelSettings";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";

enum MessageType {
  Text,
  GameInvite,
  GameSpectate,
  FriendInvite,
  RoleUpdate,
  PrivateMessage
}

type MessageEventDto = {
  channel_id?: number;
  receiver_id?: number;
  // Ommitted in client:
  //sender_id: number;
  type: MessageType;
  data: string;
};

interface IMessageFormValues {
  message: string;
}

const sendMessageChannel = (socket: Socket, channelId: number, data: string) => {
  const message: MessageEventDto = {
    channel_id: channelId,
    type: MessageType.Text,
    data,
  };

  console.log(message);

  socket.emit("message-channel", message);
};

const sendMessageUser = (socket: Socket, user_id: number, data: string) => {
  const message: MessageEventDto = {
    receiver_id: user_id,
    type: MessageType.PrivateMessage,
    data,
  };

  console.log('sendMessageUser', message);

  socket.emit("message-user", message);
};

export function ChatInput() {
  const { socket } = useContext(AppContext);
  const chatContextValue = useContext(chatContext);

  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors },
    reset,
  } = useForm<IMessageFormValues>();

  const className="bg-gray-100 border-t-2 border-gray-400"

  return (
    <form
      className={`${className}`}
      onSubmit={handleSubmit((values) => {
        if (socket && chatContextValue.currentChannelRel)
         {
          sendMessageChannel(
            socket,
            chatContextValue.currentChannelRel.channel.id,
            values.message
          );
          reset();
        } else if (socket && chatContextValue.currentUserRel)
        {
          sendMessageUser(
           socket,
           chatContextValue.currentUserRel.user.id,
           values.message
         );
         reset();
       }
      })}
    >
      <TextInput
        name="message"
        register={register}
        required={true}
        error={errors.message}
      />
    </form>
  );
}

ChatInput.defaultProps = {
  className: "",
};

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


  // const updateOneChannelRelationship = async (channel_id: number) => {
  //   let a = searchInfo.list.slice();
  //   let index = a.findIndex((relation: ChannelSearchListElement) => {
  //     return (Number(relation.channel.id) === channel_id);
  //   })
  //   if (index !== -1) {
  //     let relationshipType = await getRelationshipType(channel_id, contextValue);
  //     a[index].relationType = relationshipType
  //   }
  //   setSearchInfo({
  //     ...searchInfo,
  //     list: a
  //   });
  // }

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

type ChatPageParams = {
  id: string;
};

// function ChatMessageListAndInput({ match }: RouteComponentProps<ChatPageParams>) {
//   return (
//     <div className={className}>
//       <ul>
//         {messages.map((m) => {
//           return (
//             <li key={m.id}>
//               <ChatMessage message={m} />
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

export function ChatView({ match }: RouteComponentProps<ChatPageParams>,
) {
  // const appContext = useContext(AppContext);
  const { currentChannelRel } = useContext(chatContext);

  const chatId = match.params.id !== undefined ? match.params.id : undefined;

  let isChannel = false;
  if (chatId && chatId[0] === 'c') {
    isChannel = true;
  }

  // console.log('isChannel', isChannel)
  // console.log('currentChannelRel', currentChannelRel);

  // const redirPath = `/chat/${currentChannelRel?.channel.id}/settings`
  const redirPath = `/chat/${chatId}/settings`

  const displaySettings = () => {
    if (isChannel) {
      return (
          <Route exact path="/chat/:id/settings" component={ChannelSettings} />
      )
    }
  }

  const displaySettingsRefresh = () => {
    if (isChannel) {
      return (
          <Route exact path="/chat/:id/refresh">
            <Redirect to={redirPath} />
          </Route>
      )
    }
  }

  return (

    <div className={`flex flex-col flex-grow `}>
      <ChatHeader>
        <ChatActions
          // userRole={appContext.user?.role}
          channelRelation={currentChannelRel}
        />
      </ChatHeader>
      <Switch>
        {/* <Route path="/chat/:id/settings" component={ChannelSettings} />
        <Route exact path="/chat/:id/refresh">
          <Redirect to={redirPath} />
        </Route> */}
        {displaySettings()}
        {displaySettingsRefresh()}
        <Route path="/chat/:id">
          <ChatMessageList/>
          <ChatInput />
        </Route>
      </Switch>
    </div>
  );
}

ChatView.defaultProps = {
  className: "",
};
