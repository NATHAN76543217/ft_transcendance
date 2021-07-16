import { useContext } from "react";
import { ChatMessageList } from "../../components/chat/ChatMessageList";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { ChatPageContext } from "../../pages/chat/chat";
import { TooltipIconButton } from "../utilities/TooltipIconButton";
import { useForm } from "react-hook-form";
import { TextInput } from "../utilities/TextInput";
import axios from "axios";
import { Socket } from "socket.io-client";

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

type ChatInputProps = {
  onSubmit: (message: string) => void;
};

export function ChatInput({ onSubmit }: ChatInputProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IMessageFormValues>();

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values.message))}>
      <TextInput
        name="message"
        register={register}
        required={true}
        error={errors.message}
      ></TextInput>
    </form>
  );
}

const sendMessage = (socket: Socket, currentChatId: number, data: string) => {
  const message: MessageEventDto = {
    channel_id: currentChatId,
    type: MessageType.text,
    data,
  };

  console.log(message);

  socket.emit("message", message);
};

export function ChatView({ className }: ChatViewProps) {
  const chatContext = useContext(ChatPageContext);
  const currentChatId = chatContext.currentChatId!;

  return (
    <div className={className}>
      <ChatHeader>
        <span>40 users</span>
        <TooltipIconButton
          tooltip="Invite"
          icon="fa-user-plus"
          href={`/chat/${currentChatId}/invite`}
        />
        <TooltipIconButton
          tooltip="Settings"
          icon="fa-cog"
          href={`/chat/${currentChatId}/settings`}
        />
      </ChatHeader>
      <ChatMessageList />
      <ChatInput
        onSubmit={(data) => {
          if (chatContext.socket !== undefined && currentChatId !== undefined)
            sendMessage(chatContext.socket, currentChatId, data);
        }}
      ></ChatInput>
    </div>
  );
}

ChatView.defaultProps = {
  className: "",
};
