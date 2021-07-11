import { useContext } from "react";
import { ChatPageContext } from "../../pages/chat/chat";
import { ChatTitle } from "./ChatTitle";

type ChatHeaderProps = {
  children: JSX.Element | JSX.Element[];
};

export function ChatHeader({ children }: ChatHeaderProps) {
  const chatContext = useContext(ChatPageContext);

  if (chatContext.currentChatId) {
    const currentChat = chatContext.chats[chatContext.currentChatId];

    return (
      <header className="flex justify-between w-full h-10 p-2 bg-gray-200">
        <ChatTitle chat={currentChat}></ChatTitle>
        <div className="flex items-center space-x-2">{children}</div>
      </header>
    );
  } else {
    return <header className="w-full h-10 bg-gray-200"></header>;
  }
}

ChatHeader.defaultProps = {
  children: <div />,
};
