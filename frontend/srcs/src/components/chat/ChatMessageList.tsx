import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { Message } from "../../models/channel/Channel";
import chatContext from "../../pages/chat/chatContext";
import { ChatMessage } from "./ChatMessage";

async function fetchMessages(
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

function useChatMessages() {
  //channelId?: number
  const { socket } = useContext(AppContext);
  const { currentChannelRel } = useContext(chatContext);
  const [messages, setMessages] = useState<Message[]>([]);

  // This will be used to fetch more past messages
  /*   const oldestMessageId = messages.length
    ? messages[messages.length - 1].id
    : undefined; */

  useEffect(() => {
    socket?.on("message", (data) => {
      console.log("Incoming message:", data);
      setMessages((olderMessages) => [...olderMessages, JSON.parse(data)]);
    });
    return () => {
      socket?.off("message");
    };
  }, [socket]);

  // This fetches previous messages
  useEffect(() => {
    async function appendOlderMessages() {
      if (currentChannelRel) {
        const olderMessages = await fetchMessages(currentChannelRel.channel.id);
        if (olderMessages.length) setMessages(olderMessages);
      }
    }

    appendOlderMessages();
  }, [currentChannelRel]);

  return messages;
}

export type ChatMessageListProps = {
  className: string;
};

export function ChatMessageList({ className }: ChatMessageListProps) {
  const messages = useChatMessages();

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

ChatMessageList.defaultProps = {
  className: "",
};
