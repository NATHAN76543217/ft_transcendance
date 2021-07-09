import Cookies from "js-cookie";
import React from "react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { io, Socket } from "socket.io-client";
import AppContext from "../../AppContext";

import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { ChatView } from "../../components/chat/ChatView";
import Channel from "../../components/interface/IChannelInterface";
//import ChannelSearch from "./channelSearch";

const getSocket = () => {
  const token = Cookies.get("Authentication"); // get jwt token from local storage or cookie

  console.debug("Authentication:", token);

  if (token === undefined) return undefined;

  console.log("Initiating socket connection...");

  return io("", {
    path: "/api/socket.io/channels",
    extraHeaders: { token },
    rejectUnauthorized: false, // This disables certificate authority verification
  }).on("authenticated", () => {
    console.log("Socket connection authenticated!");
  });
};

type ChatPageContextProps = {
  chats: Channel[];
  currentChat?: Channel;
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
  const { user } = useContext(AppContext);
  const chats = user?.channels || [];

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
        {/*<Route exact path='/chat/find'>
              <ChannelSearch
                  myId="1"    // a changer
              />
          </Route>
          <Route exact path='/chat/create'>
              { <ChannelCreate /> }
                  <div>Channel Create</div>
          </Route>
          */}
        <ChatNavBar></ChatNavBar>
        <ChatView className="flex-1"></ChatView>
      </div>
    </ChatPageContext.Provider>
  );
}
