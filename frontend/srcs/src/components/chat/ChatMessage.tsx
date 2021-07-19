import { useContext } from "react";
import { Link } from "react-router-dom";
import { Message } from "../../models/channel/Channel";
import { ChatPageContext } from "../../pages/chat/chat";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { channelRels: channels } = useContext(ChatPageContext);
  const sender = channels.get(message.channel_id)?.channel.users.find((rel) => {
    rel.user.id === message.author_id;
  })?.user; // TODO: Cleanup and premap this value

  const senderImgUrl = sender?.imgPath ?? "TODO: Insert standard img url";
  const senderProfileUrl = `/profile/${sender?.id ?? ""}`;

  return (
    <div className="flex">
      <Link className="flex flex-col" to={senderProfileUrl}>
        <image href={senderImgUrl}></image>
        {sender?.name ?? "Unknown"}
      </Link>
      {message.data}
    </div>
  );
}
