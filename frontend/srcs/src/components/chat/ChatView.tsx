import { useCallback, useContext, useEffect, useState } from "react";
import { ChatMessageList } from "../../components/chat/ChatMessageList";
import { ChatHeader } from "../../components/chat/ChatHeader";
import AppContext from "../../AppContext";
import { Route, RouteComponentProps, Switch, Redirect } from "react-router-dom";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import ChannelSettings from "../../pages/chat/channelSettings";
import { ChatInput } from "./ChatInput";
import { Channel, ChannelMode } from "../../models/channel/Channel";


type ChatPageParams = {
  id: string;
};

export function ChatView({ match }: RouteComponentProps<ChatPageParams>,
) {
  const contextValue = useContext(AppContext);
  // const { currentChannelRel } = useContext(chatContext);

  const chatId = match.params.id !== undefined ? match.params.id : undefined;

  let isChannel = false;
  if (chatId && chatId[0] === 'c') {
    isChannel = true;
  }

  let channelId: number;
  if (match.params.id && match.params.id[0] === 'c') {
    channelId = Number(match.params.id.substring(1));
  } else {
    channelId = Number('c');
  }

  const redirPath = `/chat/${chatId}/settings`


  const [channelInfo, setChannelInfo] = useState<Channel>({
    id: 0,
    name: "",
    mode: ChannelMode.public,
    myRole: ChannelRelationshipType.Null,
    messages: [],
    users: [],
  });

  const setChannel = useCallback(() => {
      const channel = contextValue.user?.channels.find((channel) => {
        return channel.channel.id === channelId;
      })
      setChannelInfo({
        id: channelId,
        name: channel ? channel.channel.name : '',
        mode: channel ? channel.channel.mode : ChannelMode.public,
        myRole: channel ? channel.type : ChannelRelationshipType.Null,
        messages: channel ? channel.channel.messages : [],
        users: channel ? channel.channel.users : [],
      });
  }, [channelId, contextValue.user?.channels])

  const displaySettings = () => {
    if (isChannel) {
      return (
        <Route exact path="/chat/:id/settings">
          <ChannelSettings
            id={channelInfo.id}
            name={channelInfo.name}
            mode={channelInfo.mode}
            messages={channelInfo.messages}
            myRole={channelInfo.myRole}
            users={channelInfo.users}
            paramId={match.params.id}
          />

        </Route>
      )
    }
  }

  const displaySettingsRefresh = () => {
    if (isChannel) {
      return (
        <Route exact path="/chat/:id/refresh">
          <Redirect to={redirPath} />
        </Route>
      )
    }
  }

  if (isChannel && channelInfo.id !== channelId) {
    // console.log('-------- TRY Set Channel begin --------', channelId)
    setChannel();
  }

  // useEffect(() => {
  //   console.log('useEffect - channelInfo', channelInfo)
  // }, [channelInfo])

  useEffect(() => {
    // console.log('-------- useEffect - TRY Set Channel --------', channelInfo)
    // console.log('channelInfo.id', channelInfo.id)
    // console.log('channelId', channelId)
    // console.log('isChannel', isChannel)
    if (isChannel && channelInfo.id !== channelId) {
      // console.log('setChannel')
      setChannel();
    }
  }, [match.params.id, isChannel, channelId, channelInfo.id, setChannel])

  return (
    <div className={`flex flex-col flex-grow `}>
      <ChatHeader
        myRole={channelInfo.myRole}
        isChannel={isChannel}
      />
      <Switch>
        {displaySettings()}
        {displaySettingsRefresh()}
        <Route path="/chat/:id">
          <ChatMessageList id={match.params.id} />
          <ChatInput id={match.params.id} myRole={channelInfo.myRole} />
        </Route>
      </Switch>
    </div>
  );
}

