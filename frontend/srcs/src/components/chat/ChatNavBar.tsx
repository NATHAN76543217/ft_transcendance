import { NavLink } from "react-router-dom";
import { Chat } from "../../models/Chat";

type IconButtonProps = {
    name: string;
    icon: string;
    href: string;
}

export function IconLinkButton({name, icon, href}: IconButtonProps)
{
    return (
        <NavLink className="" to={href}>
            <div className="m-2"><i className={`pr-2 fas ${icon}`}></i>{name}</div>
        </NavLink>
    );
}

type ImageButtonProps = {
    className: string;
    name: string;
    imagePath: string;
    href: string;
}

export function ImageLinkButton({className, name, imagePath, href}: ImageButtonProps) {
    return (<div className={className}><img src={imagePath}></img><a href={href}>{name}</a></div>);
}

ImageLinkButton.defaultProps = {
    className: "",
}

type ChatBarProps = {
    chats: Chat[];
    activeIndex: number;
}

type ChatBarItemProps = {
    chat: Chat;
    active: boolean;
}

type ChatTitleProps = {
    chat: Chat;
}

export function ChatTitle({ chat }: ChatTitleProps) {
    const imgPath = "https://st.depositphotos.com/2101611/3925/v/950/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg";

    return (
        <div className="flex items-center">
            <img className="h-16 sm:h-8" src={imgPath}/>
            <div className="pl-2">{chat.name}</div>
        </div>
    )
}

type ChatNotificationCounterProps = {
    count: number;
}

export function ChatNotificationCounter( { count }: ChatNotificationCounterProps) {
    if (count === 0)
        return (<div></div>);
    return (<div className="absolute h-auto px-2 text-center text-white bg-red-600 rounded-full ring-2 ring-white top-2 right-2">{count}</div>)
}

ChatNotificationCounter.defaultProps = {
    count: 0
}

export function ChatBarItem({ chat, active }: ChatBarItemProps) {
    const imgPath = "https://st.depositphotos.com/2101611/3925/v/950/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg";

    // TODO: Chat image, public chat, user chat
    return (
        <div>
            <NavLink className="relative flex bg-gray-200 border-l-4 hover:border-blue-400"
                    activeClassName="border-red-500 hover:border-red-500 text-red-500" to={`/chat/${chat.id}`}>
                    <ChatNotificationCounter count={5} />
                    <ChatTitle chat={chat}></ChatTitle>
            </NavLink>
        </div>
    );
}

export function ChatNavBar({ chats, activeIndex }: ChatBarProps) {
    return (
        <nav className="flex flex-col w-1/4 h-full bg-white divide-y-4 divide-black divide-double md:w-1/5 p2">
            <div>
                <IconLinkButton name="Find..." icon="fa-search" href="/chat/find"/>
                <IconLinkButton name="Create..." icon="fa-plus-circle" href="/chat/create"/>
            </div>
            <div>
                {chats.map((c, i) => ChatBarItem({ chat: c, active: i === activeIndex }))}
            </div>
        </nav>
    );
}

ChatNavBar.defaultProps = {
    chatList: []
};