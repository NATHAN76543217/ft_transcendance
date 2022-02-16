import { useCallback, useContext, useEffect, useState } from "react";
import { ChatMessageList } from "../../components/chat/ChatMessageList";
import { ChatHeader } from "../../components/chat/ChatHeader";
import AppContext from "../../AppContext";
import { Route, RouteComponentProps, Switch, Redirect } from "react-router-dom";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import ChannelSettings from "../../pages/chat/channelSettings";
import { ChatInput } from "./ChatInput";
import { Channel, ChannelMode, Message } from "../../models/channel/Channel";
import { UserStatus } from "../../models/user/IUser";
import { UserRelationshipType } from "../../models/user/UserRelationship";

type ChatPageParams = {
  id: string;
};

export type FriendState = {
  id: number;
  name: string;
  status: UserStatus;
  roomId?: number;
  relationshipType: UserRelationshipType;
  gameInvite?: Message;
};

export function ChatView({ match }: RouteComponentProps<ChatPageParams>) {
  const contextValue = useContext(AppContext);
  // const { currentChannelRel } = useContext(chatContext);

  const chatId = match.params.id !== undefined ? match.params.id : undefined;

  let isChannel = false;
  if (chatId && chatId[0] === "c") {
    isChannel = true;
  }

  let channelId: number;
  if (match.params.id && match.params.id[0] === "c") {
    channelId = Number(match.params.id.substring(1));
  } else {
    channelId = Number("c");
  }

  let isPrivateConv = false;
  if (chatId && !isNaN(Number(chatId))) {
    isPrivateConv = true;
  }

  let privateConvId: number;
  if (isPrivateConv) {
    privateConvId = Number(match.params.id);
  } else {
    privateConvId = Number("c");
  }

  const [friendInfo, setFriendInfo] = useState<FriendState>({
    id: 0,
    name: "",
    status: UserStatus.Offline,
    roomId: undefined,
    relationshipType: UserRelationshipType.null,
    gameInvite: undefined,
  });

  const setFriend = useCallback(() => {
    const friend = contextValue.relationshipsList.find((relation) => {
      return relation.user.id === privateConvId;
    });
    if (friend) {
      if (friendInfo.id !== privateConvId ||
          friend?.relationshipType !== friendInfo.relationshipType ||
          friend?.user.status !== friendInfo.status) {
        setFriendInfo({
          id: privateConvId,
          name: friend ? friend.user.name : "",
          status: friend ? friend.user.status : UserStatus.Offline,
          roomId: friend ? friend.user.roomId : undefined,
          relationshipType: friend
          ? friend.relationshipType
          : UserRelationshipType.null,
          gameInvite: friend ? friend.gameInvite : undefined,
        });
      }
    } else if (friendInfo.id) {
      setFriendInfo({
        ...friendInfo,
        id: 0,
      });
    }
  }, [privateConvId, friendInfo, contextValue.relationshipsList]);

  const redirPath = `/chat/${chatId}/settings`;

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
    });

    setChannelInfo({
      id: channelId,
      name: channel ? channel.channel.name : "",
      mode: channel ? channel.channel.mode : ChannelMode.public,
      myRole: channel ? channel.type : ChannelRelationshipType.Null,
      messages: channel ? channel.channel.messages : [],
      users: channel ? channel.channel.users : [],
    });
  }, [channelId, contextValue.user?.channels]);

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
      );
    }
  };

  const displaySettingsRefresh = () => {
    if (isChannel) {
      return (
        <Route exact path="/chat/:id/refresh">
          <Redirect to={redirPath} />
        </Route>
      );
    }
  };

  if (isChannel && channelInfo.id !== channelId) {
    setChannel();
  }

  if (isPrivateConv && friendInfo.id !== privateConvId) {
    setFriend();
  }

  useEffect(() => {
    if (isChannel) {
      setChannel();
    }
  }, [match.params.id, isChannel, channelId, channelInfo.id, setChannel, contextValue.user?.channels]);
  
  useEffect(() => {
    if (isPrivateConv) {
      setFriend();
    }
  }, [
    match.params.id,
    isPrivateConv,
    privateConvId,
    friendInfo.id,
    setFriend,
    contextValue.relationshipsList,
  ]);

  return (
    <div className="flex flex-col flex-grow h-full ">
      <ChatHeader
        myRole={channelInfo.myRole}
        isChannel={isChannel}
        isPrivateConv={isPrivateConv}
        friendInfo={friendInfo}
      />
      <Switch>
        {displaySettings()}
        {displaySettingsRefresh()}
        <Route path="/chat/:id">
          <div className="justify-center h-full">
            <ChatMessageList id={match.params.id} />
            <ChatInput
              id={match.params.id}
              myRole={channelInfo.myRole}
              isChannel={isChannel}
              friendInfo={friendInfo}
            />
          </div>
        </Route>
      </Switch>
    </div>
  );
}
