import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import AppContext from "../../AppContext";
import { Channel } from "../../models/channel/Channel";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
import { IUser, UserChannelRelationship } from "../../models/user/IUser";
import { UserRelationshipType } from "../../models/user/UserRelationship";
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
  channel?: Channel;
  user?: IUser;
};

type ChatNotificationCounterProps = {
  count: number;
};

export function ChatNotificationCounter({
  count,
}: ChatNotificationCounterProps) {
  if (count === 0) return <div></div>;
  return (
    <div className="absolute h-auto px-2 text-center text-white bg-red-600 rounded-full ring-2 ring-white top-2 right-1">
      {count}
    </div>
  );
}

ChatNotificationCounter.defaultProps = {
  count: 0,
};

export function ChatBarItem({ channel, user }: ChatBarItemProps) {
  // TODO: Chat image, public chat, user chat
  const redirect = channel ? `/chat/c${channel.id}` : (user ? `/chat/${user.id}` : `/chat`)
  return (
    <div className="border-b-2 border-gray-300">

      <NavLink
        className="relative flex py-1 bg-gray-100 border-l-4 hover:border-blue-400"
        activeClassName="bg-gray-300 border-red-500 border-l-4 text-red-500 hover:border-red-500"
        to={redirect}
      >
        <ChatTitle channel={channel} user={user}></ChatTitle>
        <ChatNotificationCounter count={5} />
      </NavLink>
    </div>
  );
}



export type ChatNavBarProps = {
  className: string;
};



export function ChatNavBar({ className }: ChatNavBarProps) {
  const chatContextValue = useContext(chatContext);
  const contextValue = useContext(AppContext);

  const [displaySection, setDisplaySection] = useState({
    channels: true,
    friends: true,
  });

  const displayChannel = (rel: UserChannelRelationship, displayBoolean: boolean) => {
    if (displayBoolean && rel.type !== ChannelRelationshipType.Invited) {
      return <li key={rel.channel.id}>{ChatBarItem({ channel: rel.channel })}</li>
    } else {
      return <div></div>;
    }
  }

  const displayChannelList = () => {
    return (
      <div>

        <button
          className={`flex items-center justify-between w-full py-2 pr-4 bg-yellow-200`}
          onClick={() =>
            setDisplaySection({
              ...displaySection,
              channels: !displaySection.channels
            })
          }
        >
          <i
            className={
              "pl-4 fas " +
              (displaySection.channels
                ? "fa-chevron-down"
                : "fa-chevron-right")
            }
          ></i>
          <h3 className="w-full text-lg font-semibold text-center first-letter:uppercase">
            Channels
          </h3>
        </button>
        <ul>
          {Array.from(chatContextValue.channelRels.values()).map((rel) => {
            return displayChannel(rel, displaySection.channels)
          })}
        </ul>
      </div>
    )
  }

  const displayRelationList = () => {
    return (
      <div>

        <button
          className={`flex items-center justify-between w-full py-2 pr-4 bg-blue-200`}
          onClick={() =>
            setDisplaySection({
              ...displaySection,
              friends: !displaySection.friends
            })
          }
        >
          <i
            className={
              "pl-4 fas " +
              (displaySection.friends
                ? "fa-chevron-down"
                : "fa-chevron-right")
            }
          ></i>
          <h3 className="w-full text-lg font-semibold text-center first-letter:uppercase">
            Friends
          </h3>
        </button>
        <ul>
          {Array.from(contextValue.relationshipsList).map((rel: AppUserRelationship) => {
            return displayRelation(rel, displaySection.friends)
          })}
        </ul>
      </div>
    )
  }

  const displayRelation = (rel: AppUserRelationship, displayBoolean: boolean) => {
    if (displayBoolean &&
      rel.relationshipType & UserRelationshipType.pending_first_second &&
      rel.relationshipType & UserRelationshipType.pending_second_first) {
      return <li key={rel.user.id}>{ChatBarItem({ user: rel.user })}</li>
    } else {
      return <div></div>;
    }
  }

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
      {displayChannelList()}
      {displayRelationList()}
    </nav>
  );
}

ChatNavBar.defaultProps = {
  className: "",
};
// function ChatPageContext(ChatPageContext: any) {
//   throw new Error("Function not implemented.");
// }

