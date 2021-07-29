import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../AppContext";
import { Message, MessageType } from "../../models/channel/Channel";
import { UserChannelRelationship } from "../../models/user/IUser";
import chatContext from "../../pages/chat/chatContext";

type ChatMessageProps = {
  message: Message;
  sameSender: boolean;
};



export function ChatMessage({ message, sameSender }: ChatMessageProps) {
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
  
  const displaySenderName = () => {
    if (!isMe && !sameSender) {
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
    if (!isMe && !sameSender) {
      return (
        <Link className="flex w-8 mr-2 " to={senderProfileUrl}>
          <div className='flex items-center '>
            <img className="w-8 mr-2" src={senderImgUrl} alt='sender-profile'></img>
          </div>
        </Link>
      );
    } else {
      return (
        <div className='w-8 mr-2'></div>
      )
    }
  }

  const classMe = ''
  const classOthers = ''

  const classBlockMe = 'justify-end'
  const classBlockOthers = ''
  
  const classMessageMe = 'bg-blue-300 '
  const classMessageOthers = 'bg-gray-300 '

  return (
    <div className={` w-full object-right pb-2 px-2 ${isMe ? classMe : classOthers}`}>
      {displaySenderName()}
      <div className={`flex flex-shrink   ${isMe ? classBlockMe : classBlockOthers}`}>
        {displaySenderImage()}
        <span className={`px-2 break-words py-1 w-auto lg:max-w-lg md:max-w-sm max-w-sm rounded-md ${isMe ? classMessageMe : classMessageOthers}`}>
          {message.data}
        </span>
      </div>
    </div>
  );
}
