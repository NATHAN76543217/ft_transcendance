import { useContext } from "react";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { ChatPageContext } from "../../pages/chat/chat";
import { TooltipIconButton } from "../utilities/TooltipIconButton";

export function ChatMessageList() {
  return <div></div>;
}

type ChatViewProps = {
  className: string;
};

export function ChatView({ className }: ChatViewProps) {
  const chatContext = useContext(ChatPageContext);
  const currentChatId = chatContext.currentChatId;

  return (
    <div className={className}>
      <ChatHeader>
        <span>40 users</span>
        <TooltipIconButton
          tooltip="Invite"
          icon="fa-user-plus"
          href={`/chat/${currentChatId}/invite`}
        />
        <TooltipIconButton
          tooltip="Settings"
          icon="fa-cog"
          href={`/chat/${currentChatId}/settings`}
        />
        <ChatMessageList />
      </ChatHeader>
      <ChatMessageList />
    </div>
  );
}

ChatView.defaultProps = {
  className: "",
};