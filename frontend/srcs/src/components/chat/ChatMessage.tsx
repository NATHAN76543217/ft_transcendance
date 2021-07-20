import { useContext } from "react";
import { Link } from "react-router-dom";
import { Message } from "../../models/channel/Channel";
import { ChatPageContext } from "../../pages/chat/chat";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { currentChannelRel } = useContext(ChatPageContext);

  const sender = currentChannelRel?.channel.users.find((rel) => {
    return rel.user.id === message.sender_id;
  })?.user;

  const senderImgUrl =
    sender?.imgPath ??
    "https://st.depositphotos.com/2101611/3925/v/950/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg";
  const senderProfileUrl = `/profile/${sender?.id ?? ""}`;

  return (
    <div className="flex">
      <Link className="flex gap-2 m-2" to={senderProfileUrl}>
        <img className="w-8" src={senderImgUrl}></img>
        <span>{sender?.name ?? "Unknown"}</span>
      </Link>
      <span className="">{message.data}</span>
    </div>
  );
}
