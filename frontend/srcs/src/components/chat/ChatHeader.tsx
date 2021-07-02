import { Chat } from "../../models/Chat"
import { ChatTitle } from "./ChatTitle"

type ChatHeaderProps = {
    children: JSX.Element | JSX.Element[];
    chat?: Chat;
}

export function ChatHeader({chat, children}: ChatHeaderProps) {
    if (chat) {
        return (
            <header className="flex justify-between w-full h-10 p-2 bg-gray-200">
                <ChatTitle chat={chat}></ChatTitle>
                <div className="flex items-center space-x-2">
                    {children}
                </div>
            </header>
        )
    }
    else {
        return (
            <header className="w-full h-10 bg-gray-200"></header>
        )
    }
}

ChatHeader.defaultProps = {
    children: (<div/>)
}