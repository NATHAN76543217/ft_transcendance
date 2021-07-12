import React from "react";
import { Route, RouteComponentProps } from "react-router";
import { io, Socket } from "socket.io-client";

import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { ChatView } from "../../components/chat/ChatView";
import { Chat, ChatType } from "../../models/Chat";
import ChannelCreate from "./channelCreate";
import ChannelSearch from "./channelSearch";
//import ChannelSearch from "./channelSearch";

const getSocket = () => {
  const token = "TODO"; // get jwt token from local storage or cookie

  console.log("Initiating socket connection...");
  return io("", {
    path: "/api/socket.io/channels",
    extraHeaders: { token },
    rejectUnauthorized: false,
  }).on("authenticated", () => {
    console.log("Socket connection authenticated!");
  });
};

type ChatPageContextProps = {
  chats: Chat[];
  currentChat?: Chat;
  socket?: Socket;
};

export const ChatPageContext = React.createContext<ChatPageContextProps>({
  chats: [],
  currentChat: undefined,
  socket: getSocket(),
});

type ChatPageParams = {
  id: string;
};

export default function ChatPage({
  match,
}: RouteComponentProps<ChatPageParams>) {
  const chats: Chat[] = [
    { name: "Chat 1", id: 0, type: ChatType.PUBLIC },
    { name: "Chat 2", id: 1, type: ChatType.PUBLIC },
    { name: "Chat 3", id: 2, type: ChatType.PUBLIC },
    { name: "Chat 4", id: 3, type: ChatType.PUBLIC },
  ];

  const chatId = Number(match.params.id);

  const currentChat = isNaN(chatId)
    ? undefined
    : chats[Number(match.params.id)];

  console.log("Current chat " + match.params.id);

  return (
    <ChatPageContext.Provider
      value={{
        chats: chats,
        currentChat: currentChat,
      }}
    >
      <div className="flex h-full">

          <ChatNavBar></ChatNavBar>

        <div className="flex-col w-full">
          <ChatView className="flex-1"></ChatView>

          <Route exact path='/chat/find'>
            <ChannelSearch
              myId="1"    // a changer
            />
          </Route>
          <Route exact path='/chat/create'>
            <ChannelCreate />
            {/* <div>Channel Create</div> */}
          </Route>

        </div>
      </div>
    </ChatPageContext.Provider>
  );
}
