import axios from "axios";
import { useCallback } from "react";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { Message, MessageType } from "../../models/channel/Channel";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import { ChatMessage } from "./ChatMessage";

export type ChatMessageListProps = {
  id: string;
};

export function ChatMessageList(props: ChatMessageListProps) {
  const {
    eventSocket: socket,
    user,
    relationshipsList,
    updateOneRelationshipGameInvite,
  } = useContext(AppContext);
  const [messages, setMessages] = useState<Message[]>([]);

  const isChannel = props.id && props.id[0] === "c" ? true : false;





  useEffect(() => {
    const deleteSubscribedListeners = () => {
      socket
      ?.off("message-channel", onChannelMessage)
      .off("message-user", onUserMessage);

    };

    const onChannelMessage = (data: Message) => {
      if (
        isChannel &&
        Number(props.id.substring(1)) === Number(data.channel_id)
      ) {
        setMessages((olderMessages) => [...olderMessages, data]);
      }
    }

    const onUserMessage = (data: Message) => {
      // console.log("Incoming private message:", data);
      if (
        !isNaN(Number(props.id)) &&
        (Number(props.id) === Number(data.receiver_id) ||
          Number(props.id) === Number(data.sender_id))
      ) {
        setMessages((olderMessages) => [...olderMessages, data]);
      }
      if (
        data.type === MessageType.GameInvite ||
        data.type === MessageType.GameCancel
      ) {
        // console.log(
        //   "Received invitation or cancel to",
        //   data.data,
        //   "from",
        //   data.sender_id
        // );
        updateOneRelationshipGameInvite(data);
      }
    }

    socket
      ?.on("message-channel", onChannelMessage)
      .on("message-user", onUserMessage);

    return deleteSubscribedListeners;
  }, [socket, isChannel, props.id, updateOneRelationshipGameInvite]);


  let previousSenderId = 0;
  let sameSender;

  const isUserBlocked = useCallback((user_id: number) => {
    const senderRelation = relationshipsList.find((relation) => {
      return relation.user.id === user_id;
    });
    if (senderRelation) {
      const isBlocked =
        user && user?.id < user_id
          ? senderRelation.relationshipType &
          UserRelationshipType.block_first_second
          : senderRelation.relationshipType &
          UserRelationshipType.block_second_first;
      return isBlocked;
    }
    return false;
  }
    , [relationshipsList, user]);


  // This fetches previous messages
  useEffect(() => {
    async function fetchChannelMessages(
      channelId: number,
      beforeId?: number
    ): Promise<Message[]> {
      try {
        const res = await axios.get<Message[]>(
          `/api/channels/${channelId}/messages/`,
          { params: { beforeId } }
        );
        res.data.sort((m1: Message, m2: Message) => {
          return m1.created_at.toString().localeCompare(m2.created_at.toString());
        });
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
      const friendId = user && user?.id === user1_id ? user2_id : user1_id;
      if (isUserBlocked(friendId)) {
        return [];
      }
      try {
        const res = await axios.get<Message[]>(
          `/api/users/${user1_id}/${user2_id}/messages/`,
          { params: { beforeId } }
        );
        res.data.sort((m1: Message, m2: Message) => {
          return m1.created_at.toString().localeCompare(m2.created_at.toString());
        });
        return res.data;
      } catch (e) {
        return [];
      }
    }

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
  }, [props.id, isChannel, user, isUserBlocked]);
  // }, [currentChannelRel, currentUserRel, convId]);

  // return messages;

  // const messages = useChatMessages();

  // console.log(`Rendering ${messages.length} messages!`);


  return (
    <div className="flex justify-center overflow-y-scroll h-5/6">
      <div className="grid justify-center w-full h-full rounded-md">
        <div className="flex-grow w-full max-w-2xl p-2 py-2 mt-4 overflow-y-scroll bg-gray-100 border-2 border-gray-500 rounded-md">
          <div className="inline-flex h-1">
            <div className="inline-flex w-32 sm:w-48 md:w-72 xl:w-96"></div>
            <div className="inline-flex w-40 "></div>
          </div>
          <ul>
            {messages.map((m) => {
              sameSender = previousSenderId === m.sender_id;
              previousSenderId = m.sender_id;
              if (!isUserBlocked(m.sender_id)) {
                return (
                  <li key={m.id} className="">
                    <ChatMessage message={m} sameSender={sameSender} />
                  </li>
                );
              } else {
                return <li key={m.id}></li>;
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
