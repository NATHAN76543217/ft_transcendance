import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { Message } from "../../models/channel/Channel";
import { UserRelationshipType } from "../../models/user/UserRelationship";
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
    return [];
  }
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
    return [];
  }
}

export type ChatMessageListProps = {
  id: string;
};

export function ChatMessageList(props: ChatMessageListProps) {
  // const className = "flex-grow overflow-y-scroll bg-gray-200 "

  const {
    channelSocket: socket,
    user,
    relationshipsList,
  } = useContext(AppContext);
  // const { currentChannelRel, currentUserRel } = useContext(chatContext);
  const [messages, setMessages] = useState<Message[]>([]);

  const isChannel = props.id && props.id[0] === "c" ? true : false;

  // This will be used to fetch more past messages
  /*   const oldestMessageId = messages.length
    ? messages[messages.length - 1].id
    : undefined; */

  useEffect(() => {
    // console.log('---- useEffect - socket ----')

    socket?.on("message-channel", (data: Message) => {
      // console.log("Incoming channel message:", data);
      if (
        isChannel &&
        Number(props.id.substring(1)) === Number(data.channel_id)
      ) {
        setMessages((olderMessages) => [...olderMessages, data]);
      }
    });

    socket?.on("message-user", (data: Message) => {
      // console.log("Incoming private message:", data);
      if (
        !isNaN(Number(props.id)) &&
        (Number(props.id) === Number(data.receiver_id) ||
          Number(props.id) === Number(data.sender_id))
      ) {
        setMessages((olderMessages) => [...olderMessages, data]);
      }
    });

    return () => {
      socket?.off("message-channel");
      socket?.off("message-user");
    };
  }, [socket, isChannel, props.id]);

  // This fetches previous messages
  useEffect(() => {
    // console.log('---- useEffect - props.id ----')

    async function appendOlderMessages() {
      if (isChannel) {
        const olderMessages = await fetchChannelMessages(
          Number(props.id.substring(1))
        );
        setMessages(olderMessages);
      } else if (user && !isNaN(Number(props.id))) {
        const olderMessages = await fetchUserMessages(
          user?.id,
          Number(props.id)
        );
        setMessages(olderMessages);
      } else {
        setMessages([]);
      }
    }
    appendOlderMessages();
  }, [props.id, isChannel, user]);
  // }, [currentChannelRel, currentUserRel, convId]);

  // return messages;

  // const messages = useChatMessages();

  // console.log(`Rendering ${messages.length} messages!`);

  let previousSenderId = 0;
  let sameSender;

  const isSenderBlocked = (message: Message) => {
    const senderRelation = relationshipsList.find((relation) => {
      return relation.user.id === message.sender_id;
    });
    if (senderRelation) {
      const isBlocked =
        user && user?.id < message.sender_id
          ? senderRelation.relationshipType &
            UserRelationshipType.block_first_second
          : senderRelation.relationshipType &
            UserRelationshipType.block_second_first;
      return isBlocked;
    }
    return false;
  };

  return (
<div className='flex justify-center mt-4 h-5/6'>

    <div className='grid justify-center w-full h-full rounded-md'>
      <div className='flex-grow w-full max-w-2xl p-2 py-2 mt-4 overflow-y-scroll bg-gray-100 border-2 border-gray-500 rounded-md'>
        <div className='inline-flex h-1'>
          <div className='inline-flex w-32 sm:w-48 md:w-72 xl:w-96'></div>
          <div className='inline-flex w-40 '></div>
          </div>
        <ul>
          {messages.map((m) => {
            sameSender = previousSenderId === m.sender_id;
            previousSenderId = m.sender_id;
            if (!isSenderBlocked(m)) {
              return (
                <li key={m.id} className=''>
                  <ChatMessage
                    message={m}
                    sameSender={sameSender}
                    />
                </li>
              );
            } else {
              return <div></div>;
            }
          })}
        </ul>
      </div>
    </div>
          </div>
  );
}

// ChatMessageList.defaultProps = {
//   className: "",
// };
