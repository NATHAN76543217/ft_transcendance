import Cookies from "js-cookie";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Route, RouteComponentProps } from "react-router";
import { io, Socket } from "socket.io-client";
import AppContext from "../../AppContext";

import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { ChatView } from "../../components/chat/ChatView";
import ChannelCreate from "./channelCreate";
import ChannelSearch from "./channelSearch";
import { Channel } from "../../models/channel/Channel";
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
  channels: Map<number, Channel>;
  currentChatId?: number;
  socket?: Socket;
};

export const ChatPageContext = React.createContext<ChatPageContextProps>({
  channels: new Map(), // TODO: Use local storage
  currentChatId: undefined, // TODO: Replace with currentChat id
  socket: undefined, // TODO: Disconnect on logout, connect on login
});

type ChatPageParams = {
  id: string;
};

export default function ChatPage({
  match,
}: RouteComponentProps<ChatPageParams>) {
  const { user } = useContext(AppContext);

  const [channels, setChannels] = useState(
    new Map(user?.channels.map((c) => [c.channel_id, c.channel]))
  );

  const chatId = Number(match.params.id);

  useEffect(() => {
    setChannels(new Map(user?.channels.map((c) => [c.channel_id, c.channel])));
  }, [user?.channels]);

  // TODO: Ensure that currentChat exists before using its value
  const currentChat: Channel | undefined =
    isNaN(chatId) || !channels.has(chatId) ? undefined : channels.get(chatId);

  console.log(`Current chat id: ${match.params.id}`);

  return (
    <ChatPageContext.Provider
      value={{
        channels: channels,
        currentChatId: currentChat?.id,
        socket: getSocket(),
      }}
    >
      <div className="flex h-full">

          <ChatNavBar></ChatNavBar>

        <div className="flex-col w-full">
          <ChatView className="flex-1"></ChatView>

          <Route exact path='/chat/find'>
            {/* <ChannelSearch
            /> */}
            <div>Channel Search</div>
          </Route>
          <Route exact path='/chat/create'>
            {/* <ChannelCreate /> */}
            <div>Channel Create</div>
          </Route>
        </div>
        <ChatNavBar></ChatNavBar>
        <ChatView className="flex-1"></ChatView>
      </div>
    </ChatPageContext.Provider>
  );
}