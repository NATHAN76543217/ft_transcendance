import CustomButton from '../utilities/CustomButton';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { ChannelModeTypes } from './channelModeTypes';
import { ChannelRelationshipTypes } from './channelRelationshipTypes';

type ChannelProps = {
    id: string,        // optional ?
    name: string,
    mode: ChannelModeTypes,
    imgPath?: string,
    relationshipTypes: ChannelRelationshipTypes,
    isInSearch?: boolean | false,
    joinChannel: (id: string) => void,
    leaveChannel: (id: string) => void,
}

function getModeColor(mode: ChannelModeTypes) {
    switch (mode) {
        case ChannelModeTypes.public:
            return ' text-green-600';
        case ChannelModeTypes.private:
            return ' text-red-600';
        case ChannelModeTypes.protected:
            return ' text-yellow-600';
        default:
            return '';
    }
}

function getModeName(mode: ChannelModeTypes) {
    switch (mode) {
        case ChannelModeTypes.public:
            return 'Public';
        case ChannelModeTypes.private:
            return 'Private';
        case ChannelModeTypes.protected:
            return 'Protected';
        default:
            return '';
    }
}


function displayChannelPicture(channel: ChannelProps) {
    let path = (channel.imgPath === "") ? "/api/uploads/default-profile-picture.png" : "/api/uploads/" + channel.imgPath;
    return (
        <img className="object-contain w-32 h-full"
            src={path}
            alt="channel"
            onClick={() => {}} />
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

function displayJoinButton(channel: ChannelProps) {
    let isInChannel = !(channel.relationshipTypes === ChannelRelationshipTypes.null || channel.relationshipTypes === ChannelRelationshipTypes.ban);
    let isBan = channel.relationshipTypes === ChannelRelationshipTypes.ban;

    return (
        <div className="w-48 my-4 text-center">
            {!isInChannel ?
                (isBan ?
                    <div>You are banned fron this channel </div>
                    :
                        <CustomButton
                            content="Join channel"
                            // url="/users/pending"
                            onClickFunctionId={channel.joinChannel}
                            argId={channel.id}

                            bg_color="bg-secondary"
                            // bg_hover_color="bg-secondary-dark"
                            dark_text
                        />
                )
                :
                            <CustomButton
                                content="Leave channel"
                                // url="/users/friend"
                                onClickFunctionId={channel.leaveChannel}
                                argId={channel.id}

                                bg_color="bg-unset"
                                // bg_hover_color="bg-secondary-dark"
                                dark_text
                            />
            }
        </div>
    )
}



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
    return (
        <div className="py-4 h-42">
            <section className="relative flex flex-wrap items-center justify-center py-2 my-2">
                <div className="relative w-32 mx-4">
                    {displayChannelPicture(channel)}
                </div>

                <div className="w-40 mx-2 text-center">
                    <NavLink to={"/channels/" + channel.id} className="relative text-xl font-bold">
                        {channel.name}
                    </NavLink>
                    <h1 className={"relative font-bold " + getModeColor(channel.mode)}>
                        {getModeName(channel.mode)}
                    </h1>
                </div>
                <div>
                    {displayJoinButton(channel)}
                </div>
            </section>
        </div>
    );
}

export default ChannelInformation;