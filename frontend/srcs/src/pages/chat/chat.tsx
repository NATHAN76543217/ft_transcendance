import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import AppContext from "../../AppContext";
import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { ChatView } from "../../components/chat/ChatView";
import ChannelSearch from "./channelSearch";
import ChannelCreate from "./channelCreate";
import { UserChannelRelationship } from "../../models/user/IUser";
import chatContext from "./chatContext";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
//import ChannelSearch from "./channelSearch";

// type ChatPageContextProps = {
//   channelRels: Map<number, UserChannelRelationship>;
//   currentChannelRel?: UserChannelRelationship;
//   setChannelRels: any
//   //socket?: Socket;
// };

type ChatPageParams = {
  id: string;
};

export default function ChatPage({
  match,
}: RouteComponentProps<ChatPageParams>) {
  const { user, relationshipsList } = useContext(AppContext);

  const [channelRels, setChannelRels] = useState(
    new Map(user?.channels.map((rel) => [rel.channel.id, rel]))
  );

  // console.log('match.params.id ', match.params)

  // const [socket, setSocket] = useState<Socket | undefined>(undefined);
  let channelIdParam =
    match.params.id && match.params.id[0] === "c"
      ? Number(match.params.id.substring(1))
      : Number("c");
  let userIdParam = match.params.id ? Number(match.params.id) : Number("c");
  // if (match.params.id) {
  //   userIdParam = Number(match.params.id)
  //   if (match.params.id[0] === 'c') {
  //     channelIdParam = Number(match.params.id.substring(1));
  //   } else {
  //     channelIdParam = Number('c');
  //   }
  // }

  const getUserRel = (userId: number) => {
    const index = relationshipsList.findIndex((rel) => {
      return rel.user.id === userId;
    });
    if (index !== -1) {
      return relationshipsList[index];
    } else {
      return undefined;
    }
  };

  const [currentChannelRel, setCurrentChannelRel] = useState<
    UserChannelRelationship | undefined
  >(channelRels.get(channelIdParam));

  const [currentUserRel, setCurrentUserRel] = useState<
    AppUserRelationship | undefined
  >(getUserRel(userIdParam));

  useEffect(() => {
    setChannelRels(new Map(user?.channels.map((rel) => [rel.channel.id, rel])));
  }, [user?.channels]);

  useEffect(() => {
    const getUserRelEffect = (userId: number) => {
      const index = relationshipsList.findIndex((rel) => {
        return rel.user.id === userId;
      });
      if (index !== -1) {
        return relationshipsList[index];
      } else {
        return undefined;
      }
    };

    // console.log('--- useEffect --- match.params.id', match.params.id)
    // console.log('channelIdParam', channelIdParam)
    // console.log('userIdParam', userIdParam)
    // console.log('currentUserRel', currentUserRel)
    let paramChannel = undefined;
    let paramUser = undefined;
    if (!isNaN(channelIdParam)) {
      paramChannel = channelRels.get(channelIdParam);
    }
    if (!isNaN(userIdParam)) {
      paramUser = getUserRelEffect(userIdParam);
    }
    setCurrentChannelRel(paramChannel);
    setCurrentUserRel(paramUser);
  }, [
    channelRels,
    currentUserRel,
    channelIdParam,
    userIdParam,
    match.params.id,
    relationshipsList,
  ]);
  // TODO: Redirect or 404 for invalid id

  return (
    <chatContext.Provider
      value={{
        channelRels,
        currentChannelRel,
        setChannelRels,
        setCurrentChannelRel,
        currentUserRel,
        setCurrentUserRel,
      }}
    >
      <div className="flex h-full">
        <ChatNavBar className="flex-none w-48 h-full bg-white divide-y-4 md:block " />
        <Switch>
          <Route exact path="/chat/find">
            <ChannelSearch />
          </Route>
          <Route exact path="/chat/create">
            <ChannelCreate />
          </Route>
          <Route path="/chat/:id" component={ChatView} />
        </Switch>
      </div>
    </chatContext.Provider>
  );
}
