import { Channel } from "../../models/channel/Channel";

type ChatTitleProps = {
  chat: Channel;
};

export function ChatTitle({ chat }: ChatTitleProps) {
  const imgPath =
    "https://st.depositphotos.com/2101611/3925/v/950/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg";

  return (
    <div className="flex items-center">
      <img className="h-16 sm:h-8" alt="chat" src={imgPath} />
      <div className="pl-2">{chat.name}</div>
    </div>
  );
}
