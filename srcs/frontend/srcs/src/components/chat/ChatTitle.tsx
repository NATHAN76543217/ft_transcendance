import { Channel, ChannelMode } from "../../models/channel/Channel";
import { IUser } from "../../models/user/IUser";

type ChatTitleProps = {
  channel?: Channel;
  user?: IUser;
  isInHeader?: boolean | undefined
};

export function ChatTitle({ channel, user, isInHeader }: ChatTitleProps) {

  const getImgPath = (mode: ChannelMode) => {
    switch (mode) {
      case ChannelMode.public:
        return "public-channel.png";
      case ChannelMode.private:
        return "private-channel.png";
      case ChannelMode.protected:
        return "protected-channel.png";
      default:
        return "";
    }
  }
  const imgPath = channel ? getImgPath(channel.mode) : user?.imgPath
  
  const path = `/api/uploads/${imgPath}`
  
  let name = channel ? channel.name : (user ? user.name : "")
  name = isInHeader || name.length <= 10 ? name : name.substring(0, 10) + '...'
  if (imgPath?.length) {
    return (
      <div className="flex items-center pl-1">
        <img className="w-8 h-8 rounded-full" alt="chat" src={path} />
        <div className="pl-2 font-semibold truncate w-30">{name}</div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center pl-1">
        <div className="pl-2 font-semibold truncate w-30">{name}</div>
      </div>
    )
  }
}
