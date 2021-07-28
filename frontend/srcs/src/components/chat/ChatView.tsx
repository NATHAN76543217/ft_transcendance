import React, { useContext, useEffect, useState } from "react";
import { ChatMessageList } from "../../components/chat/ChatMessageList";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { TooltipIconButton } from "../utilities/TooltipIconButton";
import AppContext from "../../AppContext";
import { IUser, UserChannelRelationship, UserRole } from "../../models/user/IUser";
import chatContext from "../../pages/chat/chatContext";
import { Route, RouteComponentProps, Switch, useHistory, Redirect } from "react-router-dom";
import ChannelInviteForm from "../Forms/channelInviteForm";
import ChannelInviteDto from "../../models/channel/ChannelInvite.dto";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import axios from "axios";
import ChannelSettings from "../../pages/chat/channelSettings";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
import { ChatInput } from "./ChatInput";
import { Channel, ChannelMode } from "../../models/channel/Channel";

// type UserActionsProps = {
//   channelId: number;
//   nbUsers: number;
// };

// function UserActions({ channelId, nbUsers }: UserActionsProps) {
//   const nbUsersSpan = nbUsers && nbUsers > 1 ? nbUsers + ' users' : '1 user'
//   return (
//     <>
//       <span className='mr-2 font-semibold'>{nbUsersSpan}</span>
//     </>
//   );
// }

// type AdminActionsProps = {
//   channelId: number;
//   nbUsers: number;
// };

// function AdminActions({ channelId, nbUsers }: AdminActionsProps) {
//   const contextValue = React.useContext(AppContext);
//   const chatContextValue = useContext(chatContext);

//   const history = useHistory();

//   const setRole = async (channel_id: number, user_id: number, type: ChannelRelationshipType) => {
//     contextValue.socket?.emit('updateChannelRelationship-front', {
//       channel_id: channel_id,
//       user_id: user_id,
//       type: type
//     });

//     console.log('setRole')
//     history.push(`/chat/c${channel_id}/refresh`);
//     // updateOneRelationship(channel_id, user_id, type);
//   };

//   const onSubmitInvite = async (values: ChannelInviteDto) => {
//     console.log('invite - chatContextValue', values, chatContextValue)
//     if (values.username && chatContextValue.currentChannelRel) {
//       const index = chatContextValue.currentChannelRel?.channel.users.findIndex((relation) => {
//         return relation.user.name === values.username;
//       })
//       if (index === -1) {
//         try {
//           let users = await axios.get<IUser[]>(`/api/users?name=${values.username}`);
//           console.log('users query', users.data)
//           if (users.data && users.data.length === 1 && users.data[0].name === values.username) {
//             setRole(chatContextValue.currentChannelRel?.channel.id, users.data[0].id, ChannelRelationshipType.Invited)
//           }
//         } catch (error) { console.log(error) }
//       }
//     }
//   };

//   // const localOnSubmit = (values: ChannelInviteDto) => {
//   //   onSubmitInvite(values, chatContextValue);
//   // }

//   return (
//     <>
//       <UserActions
//         channelId={channelId}
//         nbUsers={nbUsers}
//       />
//       <div className="flex h-10 px-4">
//         <ChannelInviteForm onSubmit={onSubmitInvite} />
//       </div>
//       <TooltipIconButton
//         tooltip="Settings"
//         icon="fa-cog"
//         href={`/chat/c${channelId}/settings`}
//       />
//     </>
//   );
// }

// type ChatActionsProps = {
//   // userRole?: UserRole;
//   channelRelation?: UserChannelRelationship;
//   userRelation?: AppUserRelationship;
// };

// const getNbUsers = (relation: UserChannelRelationship) => {
//   let nbUsers = 0;
//   relation.channel.users.map((user) => {
//     if (user.type & (ChannelRelationshipType.Owner + ChannelRelationshipType.Admin +
//       ChannelRelationshipType.Member + ChannelRelationshipType.Muted)) {
//       nbUsers++;
//     }
//     return true
//   })
//   return nbUsers;
// }

// function ChatActions({ channelRelation, userRelation }: ChatActionsProps) {
//   const nbUsers = channelRelation ? getNbUsers(channelRelation) : 0;
//   const userRole = channelRelation ? channelRelation.type : UserRole.User;
//   if (userRole === undefined || channelRelation === undefined) {
//     return <></>;
//   }
//   switch (userRole) {
//     case UserRole.Admin:
//       return <AdminActions
//         channelId={channelRelation.channel.id}
//         nbUsers={nbUsers}
//       />;
//     case UserRole.Owner:
//       return <AdminActions
//         channelId={channelRelation.channel.id}
//         nbUsers={nbUsers}
//       />;
//     default:
//       return <UserActions
//         channelId={channelRelation.channel.id}
//         nbUsers={nbUsers}
//       />;
//   }
// }

type ChatPageParams = {
  id: string;
};

export function ChatView({ match }: RouteComponentProps<ChatPageParams>,
) {
  const contextValue = useContext(AppContext);
  const { currentChannelRel } = useContext(chatContext);

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

  // const setChannel = async () => {
  //   try {
  //     const channel = contextValue.user?.channels.find((channel) => {
  //       return channel.channel.id === channelId;
  //     })
  //     // const dataChannel = await axios.get(`/api/channels/${channelId}`, {
  //     // const dataChannel = await axios.get(`/api/channels/` + channelId, {
  //     //   withCredentials: true,
  //     // });
  //     // // let a = dataChannel.data.slice();
  //     // dataChannel.data.users.sort(
  //     //   (user1: { user: any }, user2: { user: any }) =>
  //     //     user1.user.name.localeCompare(user2.user.name)
  //     // );
  //     // const myRelationship = dataChannel.data.users.find((user: any) => {
  //     //   return user.user_id === contextValue.user?.id;
  //     // });
  //     const myRole =
  //       myRelationship !== undefined
  //         ? myRelationship.type
  //         : ChannelRelationshipType.Member;
  //     setChannelInfo({
  //       id: dataChannel.data.id,
  //       name: dataChannel.data.name,
  //       mode: dataChannel.data.mode,
  //       myRole: myRole,
  //       messages: [],
  //       users: dataChannel.data.users,
  //     });
  //   } catch (error) {
  //     setChannelInfo({
  //       id: channelId,
  //       name: "",
  //       mode: ChannelMode.public,
  //       myRole: ChannelRelationshipType.Null,
  //       messages: [],
  //       users: [],
  //     });
  //   }
  // };
  
  const setChannel = async () => {
  
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
  };

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
    console.log('-------- TRY Set Channel begin --------', channelId)
    setChannel();
  }

  useEffect(() => {
    console.log('useEffect - channelInfo', channelInfo)
  }, [channelInfo])

  useEffect(() => {
    console.log('-------- useEffect - TRY Set Channel --------', channelInfo)
    console.log('channelInfo.id', channelInfo.id)
    console.log('channelId', channelId)
    console.log('isChannel', isChannel)
    if (isChannel && channelInfo.id !== channelId) {
      console.log('setChannel')
      setChannel();
    }
  }, [match.params.id])

  return (
    <div className={`flex flex-col flex-grow `}>
      <ChatHeader
        myRole={channelInfo.myRole}
        isChannel={isChannel}
      />
      {/* <ChatActions
          // userRole={appContext.user?.role}
          channelRelation={currentChannelRel}
          /> */}
      <Switch>
        {/* <Route path="/chat/:id/settings" component={ChannelSettings} />
        <Route exact path="/chat/:id/refresh">
          <Redirect to={redirPath} />
        </Route> */}
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

