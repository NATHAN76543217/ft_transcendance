import { ChatHeader } from "../../components/chat/ChatHeader";
import { Chat } from "../../models/Chat";
import { TooltipIconButton } from "../utilities/TooltipIconButton";

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