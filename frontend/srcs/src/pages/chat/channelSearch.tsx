import React, { useState } from "react";

// import Button from '../../components/utilities/Button';
import ChannelSearchForm from "../../components/Forms/channelSearchForm";
import axios from "axios";
import ChannelSearchDto from "../../models/channel/ChannelSearch.dto";
import ChatInformation from "../../components/chat/ChatInformation";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import AppContext from "../../AppContext";
import ChannelSearchState, { ChannelSearchListElement } from "../../models/channel/ChannelSearchState";
import { IAppContext } from "../../IAppContext";
import { Channel } from "../../models/channel/Channel";

const getRelationshipType = async (id: Number, contextValue: IAppContext) => {
  try {
    const data = await axios.get(`/api/channels/${id}`);

    let indexData = data.data.users.findIndex(
      (channelRelation: any) =>
        Number(channelRelation.user_id) === Number(contextValue.user?.id) // Number ?
    );
    if (indexData !== -1) {
      return data.data.users[indexData].type;
    } else {
      return ChannelRelationshipType.Member;
    }
  } catch (error) {
    return ChannelRelationshipType.Null;
  }
};

// const setJoinBoolean = async (searchInfo: ChannelSearchState, setSearchInfo: any, contextValue: IAppContext) => {

//   searchInfo.list.map(async (elem, index) => {
//     let channel = elem.channel
//     try {
//       const data = await axios.get(
//         `/api/channels/${channel.id}`
//       ); // TODO: A CHANGER a remettre quand ca marchera

//       let a = searchInfo.list.slice();
//       let indexData = data.data.users.findIndex(
//         (channelRelation: any) => Number(channelRelation.user_id) === Number(contextValue.user?.id) // Number ?
//       );
//       if (indexData !== -1) {
//         a[index].relationType = data.data.users[indexData].type;
//       } else {
//         a[index].relationType = ChannelRelationshipType.null;
//       }

//       if (Number(data.data.users[indexData].type) !== Number(elem.relationType)) {
//         // if (this.state.list[index].type !== a[index].type) {
//         setSearchInfo({
//           ...searchInfo,
//           list: a
//         });
//         // }
//       }
//     } catch (error) {  }
//   });
// }

const onSubmit = async (
  values: ChannelSearchDto,
  searchInfo: ChannelSearchState,
  setSearchInfo: any,
  contextValue: IAppContext
) => {
  try {
    const data = await axios.get("/api/channels?name=" + values.channelName);
    let a = data.data.slice();
    a.sort((channel1: Channel, channel2: Channel) =>
      channel1.name.localeCompare(channel2.name)
    );
    await a.map(async (elem: any, index: number) => {
      let relationshipType = await getRelationshipType(elem.id, contextValue);
      a[index] = {
        channel: elem,
        relationType: relationshipType,
      };
      setSearchInfo({
        list: a,
        channelName: values.channelName,
      });
    });
  } catch (error) {}
};

// const updateRelationshipState = (
//   id: number,
//   newType: ChannelRelationshipType,
//   searchInfo: ChannelSearchState,
//   setSearchInfo: any
// ) => {
//   let a = searchInfo.list.slice();
//   let index = a.findIndex((elem) => Number(elem.channel.id) === Number(id));
//   if (index !== -1) {
//     a[index].relationType = newType;
//   }
//   setSearchInfo({
//     list: a,
//     channelName: searchInfo.channelName,
//   });
// };





// const banUserFromChannel = async (channel_id: number, user_id: number, searchInfo: ChannelSearchState, setSearchInfo: any, contextValue: IAppContext) => {
//   try {
//     const data = await axios.get(`/api/channels/${channel_id}/relationships`);
//     let index = data.data.findIndex(
//       (channelRelation: any) => channelRelation.user_id === user_id
//     );
//     if (index !== -1) {
//       await axios.patch(`/api/channels/${channel_id}/update/${user_id}`, {
//         type: ChannelRelationshipType.banned,
//       });
//       updateRelationshipState(channel_id, ChannelRelationshipType.banned, searchInfo, setSearchInfo);
//     }
//   } catch (error) { }
// }

// const unbanUserFromChannel = async (channel_id: number, user_id: number, searchInfo: ChannelSearchState, setSearchInfo: any, contextValue: IAppContext) => {
//   try {
//     const data = await axios.get(`/api/channels/${channel_id}/relationships`);
//     let index = data.data.findIndex(
//       (channelRelation: any) => channelRelation.user_id === user_id
//     );
//     if (index !== -1) {
//       await axios.patch(`/api/channels/${channel_id}/update/${user_id}`, {
//         type: ChannelRelationshipType.member,
//       });
//       updateRelationshipState(channel_id, ChannelRelationshipType.member, searchInfo, setSearchInfo);
//     }
//   } catch (error) { }
// }

// const setAdminUserFromChannel = async (channel_id: number, user_id: number, searchInfo: ChannelSearchState, setSearchInfo: any, contextValue: IAppContext) => {
//   try {
//     const data = await axios.get(`/api/channels/${channel_id}/relationships`);
//     let index = data.data.findIndex(
//       (channelRelation: any) => channelRelation.user_id === user_id
//     );
//     if (index !== -1) {
//       await axios.patch(`/api/channels/${channel_id}/update/${user_id}`, {
//         type: ChannelRelationshipType.admin,
//       });
//       updateRelationshipState(channel_id, ChannelRelationshipType.admin, searchInfo, setSearchInfo);
//     }
//   } catch (error) { }
// }

// const unsetAdminUserFromChannel = async (channel_id: number, user_id: number, searchInfo: ChannelSearchState, setSearchInfo: any, contextValue: IAppContext) => {
//   try {
//     const data = await axios.get(`/api/channels/${channel_id}/relationships`);
//     let index = data.data.findIndex(
//       (channelRelation: any) => channelRelation.user_id === user_id
//     );
//     if (index !== -1) {
//       await axios.patch(`/api/channels/${channel_id}/update/${user_id}`, {
//         type: ChannelRelationshipType.member,
//       });
//       updateRelationshipState(channel_id, ChannelRelationshipType.member, searchInfo, setSearchInfo);
//     }
//   } catch (error) { }
// }

// type ChannelInfoForSearch = {
//   // doesUserExist: boolean,
//   channel: ChannelSearchState,
//   relationshipType: ChannelRelationshipType,
// }


function ChannelSearch() {
  const contextValue = React.useContext(AppContext);

  const [searchInfo, setSearchInfo] = useState<ChannelSearchState>({
    list: [],
    channelName: "",
  });

  // useEffect(() => {
  //   setJoinBoolean(searchInfo, setSearchInfo, contextValue);
  // }, [searchInfo]);

  const localOnSubmit = (values: ChannelSearchDto) => {
    onSubmit(values, searchInfo, setSearchInfo, contextValue);
  };

  const updateOneRelationship = async (channel_id: number) => {
    let a = searchInfo.list.slice();
    let index = a.findIndex((relation: ChannelSearchListElement) => {
      return (Number(relation.channel.id) === channel_id);
    })
    if (index !== -1) {
      let relationshipType = await getRelationshipType(channel_id, contextValue);
      a[index].relationType = relationshipType
    }
    setSearchInfo({
      ...searchInfo,
      list: a
    });
  }

  const joinChannel = async (
    id: number,
    searchInfo: ChannelSearchState,
    setSearchInfo: any,
    contextValue: IAppContext,
    password: string
  ) => {
  
    contextValue.socket?.emit('joinChannel-front', {
      channel_id: id,
      user_id: contextValue.user?.id,
      password: password
    });
    updateOneRelationship(id);
  
    // try {
    //   const data = await axios.get(`/api/channels/${id}`);
    //   let index = data.data.users.findIndex(
    //     (channelRelation: any) =>
    //       channelRelation.user_id === contextValue.user?.id
    //   );
  
    //   if (index === -1) {
    //     await axios.post(`/api/channels/${id}/join`, {
    //       type: ChannelRelationshipType.Member,
    //       password: password,
    //     });
    //     updateRelationshipState(
    //       id,
    //       ChannelRelationshipType.Member,
    //       searchInfo,
    //       setSearchInfo
    //     );
    //   }
    //   return true;
    // } catch (error) {
      // if (error.response) {
      //   console.log(error.response.data);
      //   console.log(error.response.status);
      //   console.log(error.response.headers);
      // }
      // return false;
      // const joinValues: JoinChannelDto = {
      //   type: ChannelRelationshipType.member
      // }
      // axios.post(`/api/channels/${id}/join`, {
      //   // joinValues
      //   //TODO - add password and joinValues
      // });
      // updateRelationshipState(id, ChannelRelationshipType.member, searchInfo, setSearchInfo);
    // }
  };

  const leaveChannel = async (
    id: number,
    searchInfo: ChannelSearchState,
    setSearchInfo: any,
    contextValue: IAppContext
  ) => {

    contextValue.socket?.emit('leaveChannel-front', {
      channel_id: id,
      user_id: contextValue.user?.id,
    });
    updateOneRelationship(id);

    // try {
    //   const data = await axios.get(`/api/channels/${id}`);
    //   let index = data.data.users.findIndex(
    //     (channelRelation: any) =>
    //       channelRelation.user_id === contextValue.user?.id
    //   );
    //   if (
    //     index !== -1 &&
    //     data.data.users[index].type !== ChannelRelationshipType.Banned
    //   ) {
    //     await axios.delete(`/api/channels/${id}/leave`);
    //     updateRelationshipState(
    //       id,
    //       ChannelRelationshipType.Member,
    //       searchInfo,
    //       setSearchInfo
    //     );
    //   }
    // } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center flex-grow">
      <ChannelSearchForm onSubmit={localOnSubmit} />
      <ul >
        {searchInfo.list.map((elem) => {
          let channel = elem.channel;
          if (channel !== undefined) {
            return (
              <li key={channel?.id} className="max-w-xl my-4 ">
                <ChatInformation
                  id={channel.id}
                  name={channel.name}
                  mode={channel.mode}
                  // imgPath="",
                  relationshipTypeList={searchInfo.list}
                  // isInSearch={true}
                  joinChannel={joinChannel}
                  leaveChannel={leaveChannel}
                  channelInfo={searchInfo}
                  setChannelInfo={setSearchInfo}
                />
              </li>
            );
          } else {
            return <div></div>
          }
        })}
      </ul>
    </div>
  );
}

export default ChannelSearch;
