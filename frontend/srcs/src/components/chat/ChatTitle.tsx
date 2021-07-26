import { Channel, ChannelMode } from "../../models/channel/Channel";

type ChatTitleProps = {
  chat: Channel;
  isInHeader?: boolean | undefined
};

export function ChatTitle({ chat, isInHeader }: ChatTitleProps) {

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
  const imgPath =
  "/api/uploads/" + getImgPath(chat.mode);

  const name = isInHeader || chat.name.length <= 10 ? chat.name : chat.name.substring(0,10) + '...'
  return (
    <div className="flex items-center">
      <img className="h-8" alt="chat" src={imgPath} />
      <div className="pl-2 font-semibold">{name}</div>
    </div>
  );
}
