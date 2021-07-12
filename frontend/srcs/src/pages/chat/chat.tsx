import axios from "axios";
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
import ChannelSearch from "./channelSearch";
import { Channel } from "../../models/channel/Channel";
import ChannelSettings from "./channelSettings";
//import ChannelSearch from "./channelSearch";

// const getSocket = () => {
//   const token = Cookies.get("Authentication"); // get jwt token from local storage or cookie

//   console.debug("Authentication:", token);

//   if (token === undefined) return undefined;

//   console.log("Initiating socket connection...");

//   return io("", {
//     path: "/api/socket.io/channels",
//     extraHeaders: { token },
//     rejectUnauthorized: false, // This disables certificate authority verification
//   }).on("authenticated", () => {
//     console.log("Socket connection authenticated!");
//   });
// };

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

async function fetchChannelMessages(chat: Channel) {
  //localStorage.getItem(`chat-meta`);
  //if (chat)
}

export default function ChatPage({
  match,
}: RouteComponentProps<ChatPageParams>) {
  const { user } = useContext(AppContext);

  const [channels, setChannels] = useState(
    new Map(user?.channels.map((c) => [c.channel.id, c.channel]))
  );

  const chatIdParam = Number(match.params.id);

  const [currentChatId, setCurrentChatId] = useState<number | undefined>(
    !channels.get(chatIdParam) ? undefined : chatIdParam
  );

  useEffect(() => {
    // TODO: Add before after and iterate over all channel relations
    axios.get(`/api/channels/`, )
  });

  useEffect(() => {
    console.log("Setting new channels:", user?.channels);
    setChannels(new Map(user?.channels.map((c) => [c.channel.id, c.channel])));
  }, [user?.channels]);

  useEffect(() => {
    if (!isNaN(chatIdParam))
      setCurrentChatId(!channels.get(chatIdParam) ? NaN : chatIdParam);
  }, [channels, chatIdParam]);

  // TODO: Redirect or 404 for invalid id

  return (
    <ChatPageContext.Provider
      value={{
        channels: channels,
        currentChatId: currentChatId,
        //socket: getSocket(),
      }}
    >
      <div className="flex h-full">
        <ChatNavBar></ChatNavBar>
        <div className="flex-col w-full">
          <ChatView className="flex-1"></ChatView>
          <Route exact path='/chat/find'>
            <ChannelSearch/>
          </Route>
          <Route path="/chat/:id/settings" component={ChannelSettings} />
          <ChatNavBar></ChatNavBar>
          <ChatView className="flex-1"></ChatView>
        </div>
    </div>
    </ChatPageContext.Provider>
  );
}