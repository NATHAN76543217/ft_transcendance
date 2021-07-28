import { useContext } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../utilities/TextInput";
import { Socket } from "socket.io-client";
import AppContext from "../../AppContext";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";

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


export type ChatInputProps = {
  id: string;
  myRole: ChannelRelationshipType;
};

export function ChatInput(props: ChatInputProps) {
  const { socket } = useContext(AppContext);
  // const chatContextValue = useContext(chatContext);

  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors },
    reset,
  } = useForm<IMessageFormValues>();

  const className = "bg-gray-100 border-t-2 border-gray-400"

  const isChannel = props.id && props.id[0] === 'c' ? true : false;

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

  if (
    props.myRole &
    (ChannelRelationshipType.Owner | ChannelRelationshipType.Admin | ChannelRelationshipType.Member)
  ) {
    return (
      <form
        className={`${className}`}
        onSubmit={handleSubmit((values) => {
          if (socket && isChannel) {
            sendMessageChannel(
              socket,
              Number(props.id.substring(1)),
              values.message
            );
            reset();
          } else if (socket && !isNaN(Number(props.id))) {
            sendMessageUser(
              socket,
              Number(props.id),
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
  } else {
    return <div></div>;
  }
}
