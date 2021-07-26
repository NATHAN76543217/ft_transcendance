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

enum MessageType {
  text,
  gameInvite,
  gameSpectate,
}

type MessageEventDto = {
  channel_id: number;
  // Ommitted in client:
  //sender_id: number;
  type: MessageType;
  data: string;
};

interface IMessageFormValues {
  message: string;
}

type ChatInputProps = {
  className: string;
};

const sendMessage = (socket: Socket, channelId: number, data: string) => {
  const message: MessageEventDto = {
    channel_id: channelId,
    type: MessageType.text,
    data,
  };

  console.log(message);

  socket.emit("message", message);
};

export function ChatInput({ className }: ChatInputProps) {
  const { socket } = useContext(AppContext);
  const chatContextValue = useContext(chatContext);

  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors },
    reset,
  } = useForm<IMessageFormValues>();

  return (
    <form
      className={`${className}`}
      onSubmit={handleSubmit((values) => {
        if (
          socket !== undefined &&
          chatContextValue.currentChannelRel !== undefined
        ) {
          sendMessage(
            socket,
            chatContextValue.currentChannelRel.channel.id,
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
    history.push(`/chat/${channel_id}/refresh`);
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
        href={`/chat/${channelId}/settings`}
      />
    </>
  );
}

type ChatActionsProps = {
  // userRole?: UserRole;
  relation?: UserChannelRelationship;
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

function ChatActions({ relation }: ChatActionsProps) {
  const nbUsers = relation ? getNbUsers(relation) : 0;
  const userRole = relation ? relation.type : UserRole.User;
  if (userRole === undefined || relation === undefined) {
    return <></>;
  }
  switch (userRole) {
    case UserRole.Admin:
      return <AdminActions
        channelId={relation.channel.id}
        nbUsers={nbUsers}
      />;
    case UserRole.Owner:
      return <AdminActions
        channelId={relation.channel.id}
        nbUsers={nbUsers}
      />;
    default:
      return <UserActions
        channelId={relation.channel.id}
        nbUsers={nbUsers}
      />;
  }
}

type ChatPageParams = {
  id: string;
};

export function ChatView({ match }: RouteComponentProps<ChatPageParams>,
) {
  // const appContext = useContext(AppContext);
  const { currentChannelRel } = useContext(chatContext);

  // const channelId = match.params.id !== undefined ? match.params.id : currentChannelRel;

  console.log(currentChannelRel);

  const redirPath = `/chat/${currentChannelRel?.channel.id}/settings`
  
  return (

    <div className={`flex flex-col flex-grow `}>
      <ChatHeader>
        <ChatActions
          // userRole={appContext.user?.role}
          relation={currentChannelRel}
        />
      </ChatHeader>
      <Switch>
        <Route path="/chat/:id/settings" component={ChannelSettings} />
        <Route exact path="/chat/:id/refresh">
          {/* <Redirect to="/chat/:id/settings" /> */}
          <Redirect to={redirPath} />
        </Route>
        <Route path="/chat/:id">
          <ChatMessageList className="flex-grow overflow-y-scroll bg-gray-200" />
          <ChatInput className="bg-gray-100 border-t-2 border-gray-400" />
        </Route>
      </Switch>
    </div>
  );
}

ChatView.defaultProps = {
  className: "",
};
