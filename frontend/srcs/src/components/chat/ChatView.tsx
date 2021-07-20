import { useContext } from "react";
import { ChatMessageList } from "../../components/chat/ChatMessageList";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { ChatPageContext } from "../../pages/chat/chat";
import { TooltipIconButton } from "../utilities/TooltipIconButton";
import { useForm } from "react-hook-form";
import { TextInput } from "../utilities/TextInput";
import { Socket } from "socket.io-client";
import AppContext from "../../AppContext";
import { UserRole } from "../../models/user/IUser";
import { ChannelRelationship } from "../../models/channel/ChannelRelationship";

type ChatViewProps = {
  className: string;
};

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

type ChatInputProps = {};
const sendMessage = (socket: Socket, channelId: number, data: string) => {
  const message: MessageEventDto = {
    channel_id: channelId,
    type: MessageType.text,
    data,
  };

  console.log(message);

  socket.emit("message", message);
};

export function ChatInput({}: ChatInputProps) {
  const chatContext = useContext(ChatPageContext);

  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors },
    reset,
  } = useForm<IMessageFormValues>();

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (
          chatContext.socket !== undefined &&
          chatContext.currentChannelRel !== undefined
        ) {
          sendMessage(
            chatContext.socket,
            chatContext.currentChannelRel.channel.id,
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
      ></TextInput>
    </form>
  );
}

type UserActionsProps = {
  channelId: number;
};

function UserActions({ channelId }: UserActionsProps) {
  return (
    <>
      <span>40 users</span>
      <TooltipIconButton
        tooltip="Invite"
        icon="fa-user-plus"
        href={`/chat/${channelId}/invite`}
      />
      <TooltipIconButton
        tooltip="Settings"
        icon="fa-cog"
        href={`/chat/${channelId}/settings`}
      />
    </>
  );
}

type AdminActionsProps = {
  channelId: number;
};

function AdminActions({ channelId }: AdminActionsProps) {
  return (
    <>
      <UserActions channelId={channelId}></UserActions>
    </>
  );
}

type ChatActionsProps = {
  userRole?: UserRole;
  relation?: ChannelRelationship;
};

function ChatActions({ userRole, relation }: ChatActionsProps) {
  if (userRole === undefined || relation === undefined) return <></>;
  switch (userRole) {
    case UserRole.admin || UserRole.owner:
      return <AdminActions channelId={relation.channel.id}></AdminActions>;
    default:
      return <UserActions channelId={relation.channel.id}></UserActions>;
  }
}

export function ChatView({ className }: ChatViewProps) {
  const appContext = useContext(AppContext);
  const { currentChannelRel } = useContext(ChatPageContext);

  return (
    <div className={className}>
      <ChatHeader>
        <ChatActions
          userRole={appContext.user?.role}
          relation={currentChannelRel}
        />
      </ChatHeader>
      <ChatMessageList className="flex-grow overflow-scroll bg-gray-300" />
      <ChatInput />
    </div>
  );
}

ChatView.defaultProps = {
  className: "",
};
