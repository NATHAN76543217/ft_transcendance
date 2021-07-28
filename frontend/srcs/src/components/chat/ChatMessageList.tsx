import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { Message } from "../../models/channel/Channel";
import { ChatMessage } from "./ChatMessage";

async function fetchChannelMessages(
  channelId: number,
  beforeId?: number
): Promise<Message[]> {
  try {
    const res = await axios.get<Message[]>(
      `/api/channels/${channelId}/messages/`,
      { params: { beforeId } }
    );

    return res.data;
  } catch (e) {
    // TODO: Handle error
  }

  return [];
}

async function fetchUserMessages(
  user1_id: number,
  user2_id: number,
  beforeId?: number
): Promise<Message[]> {
  try {
    const res = await axios.get<Message[]>(
      `/api/users/${user1_id}/${user2_id}/messages/`,
      { params: { beforeId } }
    );

    return res.data;
  } catch (e) {
    // TODO: Handle error
  }

  return [];
}




export type ChatMessageListProps = {
  id: string;
};

export function ChatMessageList(props: ChatMessageListProps) {

  const className = "flex-grow overflow-y-scroll bg-gray-200 "

  const { socket, user } = useContext(AppContext);
  // const { currentChannelRel, currentUserRel } = useContext(chatContext);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const isChannel = props.id && props.id[0] === 'c' ? true : false;

  // This will be used to fetch more past messages
  /*   const oldestMessageId = messages.length
    ? messages[messages.length - 1].id
    : undefined; */

  useEffect(() => {
    console.log('---- useEffect - socket ----')

    socket?.on("message-channel", (data) => {
      const parsedData = JSON.parse(data)
      // console.log("Incoming channel message:", parsedData);
      if (isChannel && Number(props.id.substring(1)) === Number(parsedData.channel_id)) {
        setMessages((olderMessages) => [...olderMessages, parsedData]);
      }
    });

    socket?.on("message-user", (data) => {
      const parsedData = JSON.parse(data)
      // console.log("Incoming private message:", parsedData);
      if (!isNaN(Number(props.id)) &&
        ((Number(props.id) === Number(parsedData.receiver_id)) ||
        (Number(props.id) === Number(parsedData.sender_id)))
      ) {
        setMessages((olderMessages) => [...olderMessages, parsedData]);
      }
    });

    return () => {
      socket?.off("message-channel");
      socket?.off("message-user");
    };

  }, [socket, isChannel, props.id]);


  // This fetches previous messages
  useEffect(() => {
    console.log('---- useEffect - props.id ----')

    async function appendOlderMessages() {
      if (isChannel) {
        const olderMessages = await fetchChannelMessages(Number(props.id.substring(1)));
        setMessages(olderMessages);
      } else if (user && !isNaN(Number(props.id))) {
        const olderMessages = await fetchUserMessages(user?.id, Number(props.id));
        setMessages(olderMessages);
      } else {
        setMessages([])
      }
    }
    appendOlderMessages();

  }, [props.id, isChannel, user]);
  // }, [currentChannelRel, currentUserRel, convId]);

  // return messages;


  // const messages = useChatMessages();

  console.log(`Rendering ${messages.length} messages!`);

  return (
    <div className={className}>
      <ul>
        {messages.map((m) => {
          return (
            <li key={m.id}>
              <ChatMessage message={m} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ChatMessageList.defaultProps = {
//   className: "",
// };
