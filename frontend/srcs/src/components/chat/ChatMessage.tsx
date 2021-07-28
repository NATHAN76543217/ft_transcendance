import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../AppContext";
import { Message, MessageType } from "../../models/channel/Channel";
import { UserChannelRelationship } from "../../models/user/IUser";
import chatContext from "../../pages/chat/chatContext";

type ChatMessageProps = {
  message: Message;
};



export function ChatMessage({ message }: ChatMessageProps) {
  const { currentChannelRel } = useContext(chatContext);
  const { relationshipsList, user } = useContext(AppContext);

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
  
  
  const sender = isPrivate ? getPrivateSender(message) : getChannelSender(currentChannelRel, message);
  
  const senderImgUrl = sender ? "/api/uploads/" + sender?.imgPath : "/api/uploads/default-profile-picture.png"
  const senderProfileUrl = `/users/${sender?.id ?? ""}`;
  const senderName = sender ? sender.name : 'Unknown user'
  
  // console.log('message', message)
  // console.log('sender', sender)
  
  const displaySenderName = () => {
    if (!isMe) {
      return (
        <div className='flex-none'>
            <div className='flex items-center pl-12 '>
              <span className="font-semibold ">{senderName}</span>
            </div>
        </div>
      );
    } else {
      return (<div></div>)
    }
  }

  const displaySenderImage = () => {
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

  const classMe = 'ml-16'
  const classOthers = 'border-gray-400 mr-16'
  // const className = 
  const classMessageMe = 'px-4 py-1 bg-blue-300 rounded-md '
  const classMessageOthers = 'px-4 py-1 bg-gray-300 rounded-md '

  return (
    <div className={`items-center py-2 px-2 ${isMe ? classMe : classOthers}`}>
      {displaySenderName()}
      <div className='flex items-center w-full'>
        {displaySenderImage()}
        <span className={`flex items-center w-full ${isMe ? classMessageMe : classMessageOthers}`}>
          {message.data}
        </span>
      </div>
    </div>
  );
}
