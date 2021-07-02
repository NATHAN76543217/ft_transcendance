import { NavLink } from "react-router-dom";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { Chat } from "../../models/Chat";

type TooltipIconButtonProps = {
    tooltip: string;
    icon: string;
    iconStyle: string;
    href: string;
}

export function TooltipIconButton({ icon, iconStyle, tooltip, href }: TooltipIconButtonProps) {
    return (
        <NavLink className="flex flex-col items-center has-tooltip" activeClassName="text-blue-600" to={href}>
            <i className={`${iconStyle} ${icon}`}/>
            <span className="p-1 mt-6 bg-gray-100 rounded shadow-lg tooltip">{tooltip}</span>
        </NavLink>
    );
}

TooltipIconButton.defaultProps = {
    iconStyle: "fas fa-lg"
}

export function ChatMessageList() {
    return (
        <div>
            
        </div>
    );
}

type ChatViewProps = {
    className: string;
    chat?: Chat;
}

export function ChatView( {className, chat}: ChatViewProps ) {
    return (
        <div className={className}>
            <ChatHeader chat={chat}>
                <span>40 users</span>
                <TooltipIconButton tooltip="Invite" icon="fa-user-plus" href={`/chat/${chat?.id}/invite`}></TooltipIconButton>
                <TooltipIconButton tooltip="Settings" icon="fa-cog" href={`/chat/${chat?.id}/settings`}></TooltipIconButton>
                <ChatMessageList></ChatMessageList>
            </ChatHeader>
            <ChatMessageList/>
        </div>
    );
}

ChatView.defaultProps = {
    className: ""
}