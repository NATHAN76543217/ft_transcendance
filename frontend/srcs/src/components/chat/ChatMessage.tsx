import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../AppContext";
import { ChannelUserRelationship, Message, MessageType } from "../../models/channel/Channel";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
import { UserChannelRelationship } from "../../models/user/IUser";
import chatContext from "../../pages/chat/chatContext";

type ChatMessageProps = {
  message: Message;
};



export function ChatMessage({ message }: ChatMessageProps) {
  const { currentChannelRel, channelRels } = useContext(chatContext);
  const { relationshipsList, user } = useContext(AppContext);

  console.log('ChatMessage', message, user, currentChannelRel)
  console.log('channelRels', channelRels)

  const isPrivate = message.type === MessageType.PrivateMessage;

  const getChannelSender = (channelRel: UserChannelRelationship | undefined, message: Message) => {
    return channelRel?.channel.users.find((rel) => {
      return rel.user?.id === message.sender_id;
    })?.user;
  }
  
  const getPrivateSender = (message: Message) => {
    if (message.sender_id === user?.id ) {
      return user;
    } else {

      return relationshipsList.find((rel) => {
        // return rel.user.id === userRel?.user.id
        return rel.user.id === message.sender_id
      })?.user;
    }
  }

  const sender = isPrivate ? getPrivateSender(message) : getChannelSender(currentChannelRel, message);

  // const sender = currentChannelRel?.channel.users.find((rel) => {
  //   return rel.user.id === message.sender_id;
  // })?.user;

  const senderImgUrl = "/api/uploads/" + sender?.imgPath
  const senderProfileUrl = `/users/${sender?.id ?? ""}`;

  const senderName = sender
    ? (sender.name.length <= 10 ? sender.name : sender.name.substring(0,10) + '...')
    : 'Unknown'
  return (
    <div className="flex">
      <Link className="flex items-center w-40 gap-2 m-2 border-r-2 border-gray-300" to={senderProfileUrl}>
        <img className="w-8" src={senderImgUrl} alt='sender-profile'></img>
        <span className="font-semibold">{senderName}</span>
      </Link>
      <span className="flex items-center">{message.data}</span>
    </div>
  );
}
