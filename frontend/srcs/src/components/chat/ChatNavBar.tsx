import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ChatPageContext } from "../../pages/chat/chat";
import { Channel } from "../../models/channel/Channel";
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
    <NavLink
      className="relative flex bg-gray-200 border-l-4 hover:border-blue-400"
      activeClassName="border-red-500 hover:border-red-500 text-red-500"
      to={`/chat/${chat.id}`}
    >
      <ChatNotificationCounter count={5} />
      <ChatTitle chat={chat}></ChatTitle>
    </NavLink>
  );
}

export function ChatNavBar() {
  const chatContext = useContext(ChatPageContext);

  return (
    <nav className="flex flex-col w-1/4 h-full bg-white divide-y-4 divide-black divide-double md:w-1/5 p2">
      <div>
        <IconLinkButton name="Find..." icon="fa-search" href="/chat/find" />
        <IconLinkButton
          name="Create..."
          icon="fa-plus-circle"
          href="/chat/create"
        />
      </div>
      <ul>
        {chatContext.chats.map((c) => (
          <li key={c.id}>{ChatBarItem({ chat: c })}</li>
        ))}
      </ul>
    </nav>
  );
}

ChatNavBar.defaultProps = {
  chatList: [],
};
