import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import { io, Socket } from "socket.io-client";
import AppContext from "../../AppContext";

import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { ChatView } from "../../components/chat/ChatView";
import ChannelSearch from "./channelSearch";
import ChannelSettings from "./channelSettings";
import { ChannelRelationship } from "../../models/channel/ChannelRelationship";
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
  channelRels: Map<number, ChannelRelationship>;
  currentChannelRel?: ChannelRelationship;
  socket?: Socket;
};

export const ChatPageContext = React.createContext<ChatPageContextProps>({
  channelRels: new Map(), // TODO: Use local storage
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

  const [channelRels, setChannelRels] = useState(
    new Map(user?.channels.map((rel) => [rel.channel.id, rel]))
  );

  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const chatIdParam = Number(match.params.id);

  const [currentChannelRel, setCurrentChannelRel] = useState<
    ChannelRelationship | undefined
  >(channelRels.get(chatIdParam));

  useEffect(() => {
    const newSocket = user?.id !== undefined ? getSocket() : undefined;

    setSocket(newSocket);
    return () => {
      newSocket?.close();
    };
  }, [user?.id]);

  useEffect(() => {
    setChannelRels(new Map(user?.channels.map((rel) => [rel.channel.id, rel])));
  }, [user?.channels]);

  useEffect(() => {
    if (!isNaN(chatIdParam)) setCurrentChannelRel(channelRels.get(chatIdParam));
  }, [channelRels, chatIdParam]);
  // TODO: Redirect or 404 for invalid id

  return (
    <ChatPageContext.Provider
      value={{
        channelRels,
        currentChannelRel,
        socket,
      }}
    >
      <div className="flex h-full">
        <ChatNavBar className="w-1/4 bg-white divide-y-4 md:w-1/5" />
        <Switch>
          <Route exact path="/chat/find">
            <ChannelSearch />
          </Route>
          <Route path="/chat/:id/settings" component={ChannelSettings} />
          <Route exact path="/chat/create"></Route>
          <Route>
            <ChatView />
          </Route>
        </Switch>
      </div>
    </ChatPageContext.Provider>
  );
}
