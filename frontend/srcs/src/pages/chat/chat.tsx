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

const getSocket = () => {
  console.log("Initiating socket connection...");

  return io("", {
    path: "/api/socket.io/channels",
    rejectUnauthorized: false, // This disables certificate authority verification
    withCredentials: true,
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
  //currentChatId: undefined, // TODO: Replace with currentChat id
  //socket: undefined, // TODO: Disconnect on logout, connect on login
});

type ChatPageParams = {
  id: string;
};

/* async function fetchChannelMessages(chat: Channel) {
  //localStorage.getItem(`chat-meta`);
  //if (chat)
}
 */

export default function ChatPage({
  match,
}: RouteComponentProps<ChatPageParams>) {
  const { user } = useContext(AppContext);

  const [channels, setChannels] = useState(
    new Map(user?.channels.map((c) => [c.channel.id, c.channel]))
  );

  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const chatIdParam = Number(match.params.id);

  const [currentChatId, setCurrentChatId] = useState<number | undefined>(
    !channels.get(chatIdParam) ? undefined : chatIdParam
  );

  // We do not want to do this in the frontend
  // Join initial unreadMessageCount on backend request
  /*  useEffect(() => {
    // TODO: Add before after and iterate over all channel relations
    ///axios.get(`/api/channels/`, )
  }); */

  // If the user state changes we need to reconnect the socket
  useEffect(() => {
    const newSocket = user?.id !== undefined ? getSocket() : undefined;

    setSocket(newSocket);
    return () => {
      newSocket?.close();
    };
  }, [user?.id]);

  useEffect(() => {
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
          socket: socket,
        }}
      >
        {/*
          <Route exact path='/chat/create'>
              { <ChannelCreate /> }
                  <div>Channel Create</div>
          </Route>
          */}
          <Route exact path='/chat/find'>
            <ChannelSearch/>
          </Route>
          <Route path="/chat/:id/settings" component={ChannelSettings} />
        <ChatNavBar></ChatNavBar>
        <ChatView className="flex-col flex-grow"></ChatView>
      </ChatPageContext.Provider>
  );
}