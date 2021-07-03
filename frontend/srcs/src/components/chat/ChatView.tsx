import { useContext } from "react";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { Chat } from "../../models/Chat";
import { ChatPageContext } from "../../pages/chat/chat";
import { TooltipIconButton } from "../utilities/TooltipIconButton";

export function ChatMessageList() {
	return (
		<div>

		</div>
	);
}

type ChatViewProps = {
	className: string;
}

export function ChatView({ className }: ChatViewProps) {
	const chatContext = useContext(ChatPageContext);
	const currentChatId = chatContext.currentChat?.id;

	return (
		<div className={className}>
			<ChatHeader>
				<span>40 users</span>
				<TooltipIconButton tooltip="Invite" icon="fa-user-plus" href={`/chat/${currentChatId}/invite`}></TooltipIconButton>
				<TooltipIconButton tooltip="Settings" icon="fa-cog" href={`/chat/${currentChatId}/settings`}></TooltipIconButton>
				<ChatMessageList></ChatMessageList>
			</ChatHeader>
			<ChatMessageList />
		</div>
	);
}

ChatView.defaultProps = {
	className: ""
}