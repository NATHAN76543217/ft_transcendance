import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import AppContext from "../../AppContext";
import { Message } from "../../models/channel/Channel";
import chatContext from "../../pages/chat/chatContext";
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


type ChatMessageParams = {
  id: string;
};


export function ChatMessageList(props: ChatMessageListProps) {

  // let chatId = match.params.id !== undefined ? match.params.id : undefined;

  // let isChannel = false;
  // if (chatId && chatId[0] === 'c') {
  //   isChannel = true;
  // }

  const className = "flex-grow overflow-y-scroll bg-gray-200 "

  console.log('................ ChatMessageList', props)



  // const getOlderMessages = async () => {
  //   if (currentChannelRel) {
  //     return await fetchChannelMessages(currentChannelRel.channel.id);
  //   } else if (currentUserRel && user) {
  //     return await fetchUserMessages(user?.id, currentUserRel.user.id);
  //   } else {
  //     return [];
  //   }
  // }

  //channelId?: number
  const { socket, user } = useContext(AppContext);
  const { currentChannelRel, currentUserRel } = useContext(chatContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [convId, setConvId] = useState<string>('');
  
  const isChannel = props.id && props.id[0] === 'c' ? true : false;

  console.log('convId', convId)
  if (convId !== props.id) {
    console.log('set convId', props.id)
    setConvId(props.id)
  }
  // This will be used to fetch more past messages
  /*   const oldestMessageId = messages.length
    ? messages[messages.length - 1].id
    : undefined; */

  useEffect(() => {
    console.log(' --------------------------useEffect ---------------------------------------')

    socket?.on("message-channel", (data) => {
      console.log("Incoming message:", data);
      if (currentChannelRel && currentChannelRel.channel.id === Number(data.channel_id)) {
        setMessages((olderMessages) => [...olderMessages, JSON.parse(data)]);
      }
    });

    socket?.on("message-user", (data) => {
      console.log("Incoming message:", JSON.parse(data));
      console.log('currentUserRel', currentUserRel)
      const parsedData = JSON.parse(data)
      if (
        (currentUserRel && currentUserRel.user.id === Number(parsedData.receiver_id)) ||
        (currentUserRel && currentUserRel.user.id === Number(parsedData.sender_id))
      ) {
        console.log("message update:");
        setMessages((olderMessages) => [...olderMessages, parsedData]);
      }
    });

    return () => {
      socket?.off("message-channel");
      socket?.off("message-user");
    };

  }, [socket]);


  // This fetches previous messages
  useEffect(() => {
    console.log('useEffect currentChannelRel', currentChannelRel)
    console.log('useEffect currentUserRel', currentUserRel)

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
  }, [props.id]);
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
