
import axios from 'axios';
import React from 'react';
import { NavLink } from 'react-router-dom';
import IUserInterface from '../../components/interface/IUserInterface';
import User from '../../pages/users/user';
import { ChannelModeTypes } from '../channels/channelModeTypes';
import { ChannelRelationshipTypes } from '../channels/channelRelationshipTypes';
import IChannelRelationship from '../interface/IChannelRelationshipInterface';
import { UserRoleTypes } from '../users/userRoleTypes';
import CustomButton from '../utilities/CustomButton';
import AdminUserElement from './adminUserElement';


type ChannelElementProps = {
    id: string,
    name: string,
    mode: ChannelModeTypes,
    destroyChannel: (id: string) => void,
}

type ChannelElementStates = {
    channelRelationshipsList: IChannelRelationship[],
    showDestroyValidation: boolean,
    showUsersList: boolean,
}

class AdminChannelElement extends React.Component<ChannelElementProps, ChannelElementStates> {
    constructor(props: ChannelElementProps) {
        super(props);
        this.state = {
            channelRelationshipsList: [],
            showDestroyValidation: false,
            showUsersList: false
        }
        this.changeDestroyValidationButtonState = this.changeDestroyValidationButtonState.bind(this);
        this.changeUsersListButtonState = this.changeUsersListButtonState.bind(this);
        this.banUserFromChannel = this.banUserFromChannel.bind(this);
        this.unbanUserFromChannel = this.unbanUserFromChannel.bind(this);
        this.setAdminFromChannel = this.setAdminFromChannel.bind(this);
        this.unsetAdminFromChannel = this.unsetAdminFromChannel.bind(this);
    }

    componentDidMount() {
        this.setchannelRelationshipsList();
    }

    componentDidUpdate() {

    }

    async setchannelRelationshipsList() {
        try {
            const dataChannelRelationships = await axios.get("/api/channels/relationships/" + this.props.id);
            let a = dataChannelRelationships.data.slice();
            a.sort((relation1: IChannelRelationship, relation2: IChannelRelationship) => relation1.user_name.localeCompare(relation2.user_name))
            this.setState({ channelRelationshipsList: a });
        } catch (error) {

        }
    }

    displayMode() {
        const divClass = "italic text-sm ";
        switch (this.props.mode) {
            case ChannelModeTypes.public:
                return <div className={divClass + " text-green-600"}>Public</div>;
            case ChannelModeTypes.protected:
                return <div className={divClass + "text-yellow-600"}>Protected</div>;
            case ChannelModeTypes.private:
                return <div className={divClass + "text-red-600"}>Private</div>;
            default:
                return <div className={divClass + "text-gray-700"}></div>
        }
    }

    changeDestroyValidationButtonState() {
        this.setState({ "showDestroyValidation": !this.state.showDestroyValidation })
    }

    changeUsersListButtonState() {
        this.setState({ "showUsersList": !this.state.showUsersList })
    }

    displayDestroyButton() {
        if (!this.state.showDestroyValidation) {
            return (
                <div className="relative inline-block w-auto h-6 text-center">
                    <button className="inline-block w-full px-2 font-semibold text-gray-900 rounded-md justify-centerw-full bg-unset text-md focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
                        onClick={this.changeDestroyValidationButtonState}
                    >
                        Destroy channel
                </button>
                </div>
            )
        }
    }

    displayDestroyValidationButton() {
        if (this.state.showDestroyValidation) {
            return (
                <div className="inline-flex items-center justify-center h-6 text-center rrelative w-54">
                    <CustomButton
                        content="Confirm destruction?"
                        // url="/users/block"
                        onClickFunctionId={this.props.destroyChannel}
                        argId={this.props.id}
                        bg_color="bg-unset"
                        // bg_hover_color="bg-secondary-dark"
                        dark_text
                        text_size="text-sm"
                    />
                    <CustomButton
                        content="No"
                        // url="/users/block"
                        onClickFunctionId={this.changeDestroyValidationButtonState}
                        argId={this.props.id}
                        bg_color="bg-secondary"
                        // bg_hover_color="bg-secondary-dark"
                        dark_text
                        text_size="text-sm"
                    />
                </div>
            )
        }
    }

    translateRelationTypeToRole(type: ChannelRelationshipTypes) {
        switch (type) {
            case ChannelRelationshipTypes.owner:
                return UserRoleTypes.owner;
            case ChannelRelationshipTypes.admin:
                return UserRoleTypes.admin;
            case ChannelRelationshipTypes.ban:
                return UserRoleTypes.ban;
            default:
                return UserRoleTypes.null
        }
    }

    async banUserFromChannel(id: string) {
        try {
            let a = this.state.channelRelationshipsList.slice();
            let index = a.findIndex((relation) => Number(relation.user_id) === Number(id))
            if (index !== -1) {
                let relationId = a[index].id;
                const data = await axios.patch("/api/channels/update/" + relationId, { "type": ChannelRelationshipTypes.ban });
                a[index].type = ChannelRelationshipTypes.ban;
                this.setState({ channelRelationshipsList: a });

                // const dataTry = await axios.get("/api/users/" + id);
                // console.log(dataTry.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async unbanUserFromChannel(id: string) {
        try {
            let a = this.state.channelRelationshipsList.slice();
            let index = a.findIndex((relation) => Number(relation.user_id) === Number(id))
            if (index !== -1) {
                let relationId = a[index].id;
                const data = await axios.patch("/api/channels/update/" + relationId, { "type": ChannelRelationshipTypes.standard });
                a[index].type = ChannelRelationshipTypes.standard;
                this.setState({ channelRelationshipsList: a });

                // const dataTry = await axios.get("/api/users/" + id);
                // console.log(dataTry.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async setAdminFromChannel(id: string) {
        try {
            let a = this.state.channelRelationshipsList.slice();
            let index = a.findIndex((relation) => Number(relation.user_id) === Number(id))
            if (index !== -1) {
                let relationId = a[index].id;
                const data = await axios.patch("/api/channels/update/" + relationId, { "type": ChannelRelationshipTypes.admin });
                a[index].type = ChannelRelationshipTypes.admin;
                this.setState({ channelRelationshipsList: a });

                // const dataTry = await axios.get("/api/users/" + id);
                // console.log(dataTry.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async unsetAdminFromChannel(id: string) {
        try {
            let a = this.state.channelRelationshipsList.slice();
            let index = a.findIndex((relation) => Number(relation.user_id) === Number(id))
            if (index !== -1) {
                let relationId = a[index].id;
                const data = await axios.patch("/api/channels/update/" + relationId, { "type": ChannelRelationshipTypes.standard });
                a[index].type = ChannelRelationshipTypes.standard;
                this.setState({ channelRelationshipsList: a });

                // const dataTry = await axios.get("/api/users/" + id);
                // console.log(dataTry.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    displayUsersList() {
        if (this.state.showUsersList) {
            return (
                <div>
                    <ul className="relative w-auto pt-4 pl-4">
                    {this.state.channelRelationshipsList.map((relation) => {
                        let translatedRole = this.translateRelationTypeToRole(relation.type)

                        if (!(relation.type & ChannelRelationshipTypes.null)) {
                            return (
                                <li key={relation.user_name} className="">
                                    <AdminUserElement
                                        id={relation.user_id}
                                        name={relation.user_name}
                                        role={translatedRole}
                                        myRole={UserRoleTypes.owner}
                                        banUser={this.banUserFromChannel}
                                        unbanUser={this.unbanUserFromChannel}
                                        setAdmin={this.setAdminFromChannel}
                                        unsetAdmin={this.unsetAdminFromChannel}
                                        isChannelUserElement
                                    />
                                </li>
                            )
                        }
                    }
                    )
                    }
                    </ul>
                </div>
            )
        }
    }


    render() {

        return (
            <div>
                <div className="flex items-center h-8 mt-2 group">
                    <div className="flex">
                        <div className="flex justify-center w-24 mr-2">
                            {this.displayMode()}
                        </div>
                        <div className="w-48 font-bold text-md" onClick={this.changeUsersListButtonState}>
                            {this.props.name}
                        </div>
                    </div>
                    <div className="block w-48">
                        {this.displayDestroyButton()}
                        {this.displayDestroyValidationButton()}
                    </div>
                </div>
                <div>
                    {this.displayUsersList()}
                </div>
            </div>

        );
    }
}

export default AdminChannelElement;