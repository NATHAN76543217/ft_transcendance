import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Channel } from "../../models/channel/Channel";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import chatContext from "../../pages/chat/chatContext";
import { ChatTitle } from "./ChatTitle";

type IconButtonProps = {
  name: string;
  icon: string;
  href: string;
};

export function IconLinkButton({ name, icon, href }: IconButtonProps) {
  return (
    <NavLink className="" to={href}>
      <div className="m-2">
        <i className={`pr-2 fas ${icon}`}></i>
        {name}
      </div>
    </NavLink>
  );
}

type ImageButtonProps = {
  className: string;
  name: string;
  imagePath: string;
  href: string;
  alt: string;
};

// Check if we still use this
export function ImageLinkButton({
  className,
  name,
  imagePath,
  href,
  alt,
}: ImageButtonProps) {
  return (
    <div className={className}>
      <img alt={alt} src={imagePath}></img>
      <a href={href}>{name}</a>
    </div>
  );
}

ImageLinkButton.defaultProps = {
  className: "",
  alt: "",
};

type ChatBarItemProps = {
  chat: Channel;
};

type ChatNotificationCounterProps = {
  count: number;
};

export function ChatNotificationCounter({
  count,
}: ChatNotificationCounterProps) {
  if (count === 0) return <div></div>;
  return (
    <div className="absolute h-auto px-2 text-center text-white bg-red-600 rounded-full ring-2 ring-white top-2 right-2">
      {count}
    </div>
  );
}

ChatNotificationCounter.defaultProps = {
  count: 0,
};

export function ChatBarItem({ chat }: ChatBarItemProps) {
  // TODO: Chat image, public chat, user chat
  return (
    <div className="border-b-2 border-gray-300">

      <NavLink
        className="relative flex py-1 bg-gray-100 border-l-4 hover:border-blue-400"
        activeClassName="bg-gray-300 border-red-500 hover:border-red-500 text-red-500"
        to={`/chat/${chat.id}`}
      >
        <ChatNotificationCounter count={5} />
        <ChatTitle chat={chat}></ChatTitle>
      </NavLink>
    </div>
  );
}

export type ChatNavBarProps = {
  className: string;
};

export function ChatNavBar({ className }: ChatNavBarProps) {
  const chatContextValue = useContext(chatContext);

  return (
    <nav className={`flex flex-col divide-black divide-double p2 border-r-2 border-gray-300 ${className}`}>
      <div>
        <NavLink
          to="/chat/find"
          exact={true}
          className="relative flex py-1 bg-gray-100"
          activeClassName="bg-blue-300"
        >
          <div className="flex items-center py-1 pl-2">
            <i className="fas fa-search" />
            <div className="pl-2 font-semibold">Find channels</div>
          </div>
        </NavLink>
        <NavLink
          to="/chat/create"
          exact={true}
          className="relative flex py-1 bg-gray-100"
          activeClassName="bg-green-200"
        >
          <div className="flex items-center py-1 pl-2">
            <i className="fas fa-plus-circle" />
            <div className="pl-2 font-semibold">Create a channel</div>
          </div>
        </NavLink>
      </div>
      <ul>
        {Array.from(chatContextValue.channelRels.values()).map((rel) => {
          if (rel.type !== ChannelRelationshipType.Invited) {
            return <li key={rel.channel.id}>{ChatBarItem({ chat: rel.channel })}</li>
          } else {
            return <div></div>
          }
        })}
      </ul>
    </nav>
  );
}

ChatNavBar.defaultProps = {
  className: "",
};
// function ChatPageContext(ChatPageContext: any) {
//   throw new Error("Function not implemented.");
// }

