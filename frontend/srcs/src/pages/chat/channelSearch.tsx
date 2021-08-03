import React, { useState } from "react";

// import Button from '../../components/utilities/Button';
import ChannelSearchForm from "../../components/Forms/channelSearchForm";
import axios from "axios";
import ChannelSearchDto from "../../models/channel/ChannelSearch.dto";
import ChatInformation from "../../components/chat/ChatInformation";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import AppContext from "../../AppContext";
import ChannelSearchState, {
  ChannelSearchListElement,
} from "../../models/channel/ChannelSearchState";
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

const onSubmit = async (
  values: ChannelSearchDto,
  searchInfo: ChannelSearchState,
  setSearchInfo: any,
  contextValue: IAppContext
) => {
  try {
    const data = await axios.get("/api/channels?name=" + values.channelName);
    console.log("ChannelSearch", data);
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

function ChannelSearch() {
  const contextValue = React.useContext(AppContext);

  const [searchInfo, setSearchInfo] = useState<ChannelSearchState>({
    list: [],
    channelName: "",
  });

  const localOnSubmit = (values: ChannelSearchDto) => {
    onSubmit(values, searchInfo, setSearchInfo, contextValue);
  };

  const updateOneRelationship = async (channel_id: number) => {
    let a = searchInfo.list.slice();
    let index = a.findIndex((relation: ChannelSearchListElement) => {
      return Number(relation.channel.id) === channel_id;
    });
    if (index !== -1) {
      let relationshipType = await getRelationshipType(
        channel_id,
        contextValue
      );
      a[index].relationType = relationshipType;
    }
    setSearchInfo({
      ...searchInfo,
      list: a,
    });
  };

  const joinChannel = async (id: number, password: string) => {
    contextValue.eventSocket?.emit("joinChannel-front", {
      channel_id: id,
      user_id: contextValue.user?.id,
      password: password,
    });
    updateOneRelationship(id);
  };

  const leaveChannel = async (id: number) => {
    contextValue.eventSocket?.emit("leaveChannel-front", {
      channel_id: id,
      user_id: contextValue.user?.id,
    });
    updateOneRelationship(id);
  };

  return (
    <div className="flex flex-col items-center flex-grow">
      <ChannelSearchForm onSubmit={localOnSubmit} />
      <ul>
        {searchInfo.list.map((elem) => {
          let channel = elem.channel;
          if (channel) {
            return (
              <li key={channel.id} className="max-w-xl my-4 ">
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
            return <div></div>;
          }
        })}
      </ul>
    </div>
  );
}

export default ChannelSearch;
