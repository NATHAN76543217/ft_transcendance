import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import AppContext from "../../AppContext";

import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { ChatView } from "../../components/chat/ChatView";
import ChannelSearch from "./channelSearch";
import ChannelSettings from "./channelSettings";
import ChannelCreate from "./channelCreate";
import { UserChannelRelationship } from "../../models/user/IUser";
//import ChannelSearch from "./channelSearch";

type ChatPageContextProps = {
  channelRels: Map<number, UserChannelRelationship>;
  currentChannelRel?: UserChannelRelationship;
  //socket?: Socket;
};

export const ChatPageContext = React.createContext<ChatPageContextProps>({
  channelRels: new Map(), // TODO: Use local storage
});

type ChatPageParams = {
  id: string;
};

export default function ChatPage({
  match,
}: RouteComponentProps<ChatPageParams>) {
  const { user } = useContext(AppContext);

  const [channelRels, setChannelRels] = useState(
    new Map(user?.channels.map((rel) => [rel.channel.id, rel]))
  );

  // const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const chatIdParam = Number(match.params.id);

  const [currentChannelRel, setCurrentChannelRel] = useState<
    UserChannelRelationship | undefined
    >(channelRels.get(chatIdParam));
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
      }}
    >
      <div className="flex h-full">
        <ChatNavBar className="w-1/4 bg-white divide-y-4 md:w-1/5" />
        <Switch>
          <Route exact path="/chat/find">
            <ChannelSearch />
          </Route>
          <Route exact path="/chat/create">
            <ChannelCreate />
          </Route>
          <Route path="/chat/:id/settings" component={ChannelSettings} />
          <Route>
            <ChatView />
          </Route>
        </Switch>
      </div>
    </ChatPageContext.Provider>
  );
}
