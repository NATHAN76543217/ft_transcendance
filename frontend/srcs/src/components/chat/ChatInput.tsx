import { useContext } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../utilities/TextInput";
import { Socket } from "socket.io-client";
import AppContext from "../../AppContext";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import {
  MessageEventDto,
  MessageType,
} from "../../models/channel/MessageEvent.dto";
import { FriendState } from "./ChatView";
import { Events } from "../../models/channel/Events";
interface IMessageFormValues {
  message: string;
}

export type ChatInputProps = {
  id: string;
  myRole: ChannelRelationshipType;
  isChannel: boolean;
  friendInfo: FriendState;
};

export function ChatInput(props: ChatInputProps) {
  const { eventSocket: socket } = useContext(AppContext);
  // const chatContextValue = useContext(chatContext);

  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors },
    reset,
  } = useForm<IMessageFormValues>();

  const className =
    "w-full max-w-sm pt-2 pl-2 bg-gray-100 border-2 border-gray-500 rounded-md md:max-w-md xl:max-w-xl";

  // const isChannel = props.id && props.id[0] === "c" ? true : false;

  const sendMessageChannel = (
    socket: Socket,
    channelId: number,
    data: string
  ) => {
    const message: MessageEventDto = {
      channel_id: channelId,
      type: MessageType.Text,
      data,
    };

    console.log(message);

    socket.emit(Events.Server.ChannelMessage, message);
  };

  const sendMessageUser = (socket: Socket, user_id: number, data: string) => {
    const message: MessageEventDto = {
      receiver_id: user_id,
      type: MessageType.PrivateMessage,
      data,
    };

    console.log("sendMessageUser", message);

    socket.emit(Events.Server.UserMessage, message);
  };

  if (
    props.myRole &
      (ChannelRelationshipType.Owner |
        ChannelRelationshipType.Admin |
        ChannelRelationshipType.Member) ||
    props.friendInfo.id
  ) {
    return (
      <div className="">
        <div className="flex justify-center px-4 my-4 h-1/6">
          <form
            className={`${className}`}
            onSubmit={handleSubmit((values) => {
              if (socket && props.isChannel) {
                sendMessageChannel(
                  socket,
                  Number(props.id.substring(1)),
                  values.message
                );
                reset();
              } else if (socket && !isNaN(Number(props.id))) {
                sendMessageUser(socket, Number(props.id), values.message);
                reset();
              }
            })}
          >
            <TextInput
              name="message"
              register={register}
              required={true}
              error={errors.message}
              placeholder={"Enter a message..."}
            />
          </form>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
