import CustomButton from "../utilities/CustomButton";
import { NavLink } from "react-router-dom";
import { ChannelMode } from "../../models/channel/Channel";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { IAppContext } from "../../IAppContext";
import React, { useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { ChannelSearchListElement } from "../../models/channel/ChannelSearchState";

type ChannelProps = {
  id: number; // optional ?
  name: string;
  mode: ChannelMode;
  imgPath?: string;
  relationshipTypeList: ChannelSearchListElement[];
  isInSearch?: boolean | false;
  joinChannel: any;
  leaveChannel: any;
  channelInfo: any;
  setChannelInfo?: any;
};

function getModeColor(mode: ChannelMode) {
  switch (mode) {
    case ChannelMode.public:
      return " text-green-600";
    case ChannelMode.private:
      return " text-red-600";
    case ChannelMode.protected:
      return " text-yellow-600";
    default:
      return "";
  }
}

function getModeName(mode: ChannelMode) {
  switch (mode) {
    case ChannelMode.public:
      return "Public";
    case ChannelMode.private:
      return "Private";
    case ChannelMode.protected:
      return "Protected";
    default:
      return "";
  }
}

function displayChannelPicture(channel: ChannelProps) {
  let path =
    channel.imgPath === ""
      ? "/api/uploads/default-profile-picture.png"
      : "/api/uploads/" + channel.imgPath;
  return (
    <img
      className="object-contain w-32 h-full"
      src={path}
      alt="channel"
      onClick={() => { }}
    />
  );
}

// function onFileChangeTrigger(channel: ChannelProps, ev: any) {
//     if (channel.onFileChange !== undefined) {
//         return channel.onFileChange(ev);
//     } else {
//         return;
//     }
// }

// function displayFileChange(channel: ChannelProps) {
//     if (channel.onFileChange !== undefined && channel.isMe) {
//         return (
//             <div className="mt-1 align-center">
//                 <label className="custom-file-upload">
//                     <input
//                         type="file"
//                         name="file"
//                         className="hidden"
//                         onChange={(ev) => onFileChangeTrigger(channel, ev)} />
//                     <i className="fa fa-cloud-upload" />
//                     <span className="pl-1 ml-1 text-sm italic">Change picture</span>
//                 </label>
//             </div>

//         );
//     }
// }



// function DisplayChangeNameField(channel: ChannelProps) {
//     if (channel.isMe && !channel.isInSearch && channel.changeUsername !== undefined) {
//         return (
//             <ChangeNameChannelForm onSubmit={channel.changeUsername} />
//         )
//     } else {
//         return <div></div>
//     }
// }

function ChannelInformation(channel: ChannelProps) {
  const contextValue = React.useContext(AppContext);
  // const [relationState, setRelationState] = useState(channel.relationshipTypes)
  // useEffect(() => {
  // }, [relationState]);

  // const getRelationshipType = async () => {
  //   let relation = contextValue.user?.channels.find((relationElem) => {
  //     return relationElem.channel.id === channel.id
  //   })
  //   const type = relation ? relation.type : ChannelRelationshipType.Null
  //   return type;
  // }


  const [channelRelationshipType, setChannelRelationshipType] = useState<ChannelRelationshipType>(
    ChannelRelationshipType.Null
  )

  useEffect(() => {
    const setRelationshipType = async () => {
      let relation = contextValue.user?.channels.find((relationElem) => {
        return relationElem.channel.id === channel.id
      })
      const type = relation ? relation.type : ChannelRelationshipType.Null
      if (type !== channelRelationshipType) {
        setChannelRelationshipType(type);
      }
    }
    setRelationshipType();
  }, [contextValue.user?.channels, channelRelationshipType, setChannelRelationshipType, channel.relationshipTypeList, channel.id])

  const [password, setPassword] = useState("");
  const [showWrongPassword, setShowWrongPassword] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);


  const displayJoinButton = (channel: ChannelProps, relationshipType: ChannelRelationshipType, password: string, setPassword: any, showWrongPassword: boolean, setShowWrongPassword: any, showPassword: boolean, setShowPassword: any) => {
    // console.log('displayJoinButton - begin')
    // console.log('channel_id', channel.id)
    // console.log('type', relationshipType)
    
    let isInChannel = !(
      Number(relationshipType) === Number(ChannelRelationshipType.Null) ||
      Number(relationshipType) === Number(ChannelRelationshipType.Banned) ||
      Number(relationshipType) === Number(ChannelRelationshipType.Invited)
      );
      let isBan = relationshipType === ChannelRelationshipType.Banned;
  
    const joinChannel = async (channelPassword: string): Promise<boolean> => {
      const res = await channel.joinChannel(channel.id, channelPassword);
      return res;
    };
  
    const leaveChannel = async (id: number) => {
      await channel.leaveChannel(id);
    };
  
    const handleSubmit = (evt: any) => {
      evt.preventDefault();
      // alert(`Submitting Name ${password}`)
      joinChannel(password).then((res: boolean) => {
        if (!res) {
          setShowWrongPassword(true);
        } else {
          setShowWrongPassword(false);
        }
      })
    }
  
    const displayWrongPassword = (showWrongPassword: boolean) => {
      if (showWrongPassword) {
        return (
          <span className="font-semibold text-red-600">Wrong password</span>
        )
      }
    }
  
    const displayShowPasswordButton = (show: boolean, setShow: any) => {
      return (
        <div
          className="absolute right-0 items-center justify-between cursor-pointer top-1"
          onClick={() => setShow(!show)}
        >
          <i className={"fas " + (show ? "fa-eye" : "fa-eye-slash")} />
        </div>
      )
    }
  
    return (
      <div className="w-48 my-4 text-center">
        {!isInChannel ? (
          isBan ? (
            <div className="font-semibold text-red-600">You are banned from this channel </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <CustomButton
                content="Join channel"
                // url="/users/pending"
                // onClickFunctionId={joinChannel}
                argId={channel.id}
                bg_color="bg-secondary"
                // bg_hover_color="bg-secondary-dark"
                dark_text
              />
              {channel.mode === ChannelMode.protected ?
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      // value={password}
                      placeholder="Enter password..."
                      onChange={e => setPassword(e.target.value)}
                      className="flex justify-center h-auto px-2 py-1 mx-2 my-2 text-sm font-semibold bg-gray-200 rounded-sm w-36 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
                    />
                    {displayShowPasswordButton(showPassword, setShowPassword)}
                  </div>
                  {displayWrongPassword(showWrongPassword)}
                </div>
                : <div></div>}
            </form>
          )
        ) : (
          <CustomButton
            content="Leave channel"
            // url="/users/friend"
            onClickFunctionId={leaveChannel}
            argId={channel.id}
            bg_color="bg-unset"
            // bg_hover_color="bg-secondary-dark"
            dark_text
          />
        )}
      </div>
    );
  }

  return (
    <div className="py-4 h-42 bg-neutral">
      <section className="flex flex-wrap items-center justify-center py-2 my-2">
        <div className="relative w-32 mx-4">
          {displayChannelPicture(channel)}
        </div>

        <div className="w-40 mx-2 text-center">
          <NavLink
            to={"/chat/" + channel.id}
            className="relative text-xl font-bold"
          >
            {channel.name}
          </NavLink>
          <h1 className={"relative font-bold " + getModeColor(channel.mode)}>
            {getModeName(channel.mode)}
          </h1>
        </div>
        <div>{displayJoinButton(channel, channelRelationshipType, password, setPassword, showWrongPassword, setShowWrongPassword, showPassword, setShowPassword)}</div>
      </section>
    </div>
  );
}

export default ChannelInformation;
