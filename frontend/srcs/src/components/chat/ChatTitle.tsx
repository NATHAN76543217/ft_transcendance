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
  const imgPath = channel ? `/api/uploads/${getImgPath(channel.mode)}`
                          : `/api/uploads/${user?.imgPath}`

  let name = channel ? channel.name : (user ? user.name : "")
  name = isInHeader || name.length <= 10 ? name : name.substring(0,10) + '...'
  return (
    <div className="flex items-center">
      <img className="h-8" alt="chat" src={imgPath} />
      <div className="pl-2 font-semibold">{name}</div>
    </div>
  );
}
