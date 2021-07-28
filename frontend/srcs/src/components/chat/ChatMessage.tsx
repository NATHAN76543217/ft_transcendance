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
  const isMe = message.sender_id === user?.id;

  const getChannelSender = (channelRel: UserChannelRelationship | undefined, message: Message) => {
    return channelRel?.channel.users.find((rel) => {
      return rel.user?.id === message.sender_id;
    })?.user;
  }

  const getPrivateSender = (message: Message) => {
    if (isMe) {
      return user;
    } else {
      return relationshipsList.find((rel) => {
        // return rel.user.id === userRel?.user.id
        return rel.user.id === message.sender_id
      })?.user;
    }
  }

  const displaySenderName = (sender: any) => {
    if (!isMe) {
      return (
        <Link className="flex-none w-32 " to={senderProfileUrl}>
          <div className='flex items-center pl-12 '>
            <span className="font-semibold ">{senderName}</span>
          </div>
        </Link>
      );
    } else {
      return (<div></div>)
    }
  }

  const displaySenderImage = (sender: any) => {
    if (!isMe) {
      return (
        <Link className="flex w-8 mr-2 " to={senderProfileUrl}>
          <div className='flex items-center '>
            <img className="w-8 mr-2" src={senderImgUrl} alt='sender-profile'></img>
          </div>
        </Link>
      );
    }
  }

  const sender = isPrivate ? getPrivateSender(message) : getChannelSender(currentChannelRel, message);

  const senderImgUrl = "/api/uploads/" + sender?.imgPath
  const senderProfileUrl = `/users/${sender?.id ?? ""}`;
  const senderName = sender ? sender.name : 'Unknown'

  const classMe = 'pl-2 ml-16'
  const classOthers = 'pl-2 border-gray-400 mr-16'
  // const className = 
  const classMessageMe = 'px-4 py-1 bg-blue-300 rounded-md '
  const classMessageOthers = 'px-4 py-1 bg-gray-300 rounded-md '

  return (
    <div className={`items-center mx-2 py-2 ${isMe ? classMe : classOthers}`}>
      {displaySenderName(sender)}
      <div className='flex items-center w-full'>
        {displaySenderImage(sender)}
        <span className={`flex items-center w-full ${isMe ? classMessageMe : classMessageOthers}`}>
          {message.data}
        </span>
      </div>
    </div>
  );
}
