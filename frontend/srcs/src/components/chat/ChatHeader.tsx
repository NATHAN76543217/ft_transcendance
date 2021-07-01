import { ReactComponent } from "*.svg"
import { Chat } from "../../models/Chat"

type ChatHeaderProps = {
    chat: Chat
}

export function ChatHeader({}: ChatHeaderProps) {
    return (
    <header className="flex w-full h-10 bg-gray-200 justify-evenly">
       <div>Hello</div>
       <div>Hello</div>
    </header>)
}