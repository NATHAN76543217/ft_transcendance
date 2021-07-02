import React from 'react';
import UserInformation from '../../components/users/userInformation';
import UserStats from '../../components/users/userStats';
import MatchHistory from '../../components/matchHistory/matchHistory';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import IUserInterface from '../../components/interface/IUserInterface';
import { UserRelationshipTypes } from '../../components/users/userRelationshipTypes';
import IUserChangeNameFormValues from '../../components/interface/IUserChangeNameFormValues';
import { UserRoleTypes } from '../../components/users/userRoleTypes';


type UserProps = {
    id?: string,
    isMe?: boolean | false
}

interface UserStates {
    id: string,
    doesUserExist: boolean,
    user: IUserInterface,
    showWrongUsernameMessage: boolean,
}

class UserPage extends React.Component<UserProps & RouteComponentProps, UserStates> {
    private params: any;

    constructor(props: UserProps & RouteComponentProps) {
        super(props);
        this.state = {
            id: "",
            doesUserExist: true,
            user: {
                id: "",
                name: "",
                password: "",
                nbWin: 0,
                nbLoss: 0,
                stats: 0,
                imgPath: "",
                twoFactorAuth: false,
                status: "",
                role: UserRoleTypes.null,
                channels: [],
                relationshipType: UserRelationshipTypes.null,
                idInf: false,
            },
            showWrongUsernameMessage: false
        };
        this.handleClickTwoFactorAuth = this.handleClickTwoFactorAuth.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.addFriend = this.addFriend.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.blockUser = this.blockUser.bind(this);
        this.unblockUser = this.unblockUser.bind(this);
        this.onSubmitChangeUsername = this.onSubmitChangeUsername.bind(this);
    }

    componentDidMount() {
        this.getParams();
    }

    getParams = () => {
        this.params = this.props;
        let userId = this.params.match.params.id;

        if (this.params.match.params.id === undefined) {
            //---------------------------------------------
            // userId = app.state.userId;                           // A CHANGER a remettre quand ca marchera
            userId = "1";
            //---------------------------------------------
        }

        if (this.state.id !== this.params.match.params.id) {
            this.setState({
                id: this.params.match.params.id,
                user: {
                    ...this.state.user,
                    id: userId,
                    idInf: (userId < "1")              // A CHANGER a remettre quand ca marchera
                }
            });
        }
    };

    componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
        this.getParams();

        if (prevStates.id !== this.state.id) {
            this.onLoad(this.state.user.id);
        }
    }

    componentWillUnmount() {
    }

    onLoad = async (userId: string) => {
        try {
            if (!isNaN(Number(userId))) {
                const data = await axios.get("/api/users/" + this.state.user.id);
                this.setState({
                    doesUserExist: true,
                    user: data.data
                });
                if (this.state.id !== undefined) {
                    this.setFriendAndBlockBoolean(this.state.user);
                }
            }
            else {
                this.setState({ doesUserExist: false })
            }
        } catch (error) {
            this.setState({ doesUserExist: false })
        }
    };


    async handleClickTwoFactorAuth() {
        let newTwoFactorAuth = !this.state.user.twoFactorAuth;
        try {
            await axios.patch("/api/users/" + this.state.user.id, { "twoFactorAuth": newTwoFactorAuth })
            console.log("two factor auth changed to: " + !this.state.user.twoFactorAuth)
            this.setState({
                user: {
                    ...this.state.user,
                    twoFactorAuth: newTwoFactorAuth
                }
            });
        } catch (error) { }
    }

    async handleClickProfilePicture() {
    }


    async getProfilePicture(pictureId: string) {
        try {
            const data = await axios.get("/uploads/" + pictureId)
            return data.request.responseURL
        } catch (error) { }
    }

    onFileChange(fileChangeEvent: any) {
        this.submitForm(fileChangeEvent.target.files[0]);
    }

    async submitForm(valuesCurrentFile: any) {
        if (!valuesCurrentFile) {
            return false;
        }

        let formData = new FormData();

        formData.append("photo", valuesCurrentFile, valuesCurrentFile.name);

        try {
            const data = await axios.post("/api/photos/upload", formData);
            let oldImgPath = this.state.user.imgPath;
            let newImgPath = data.data.path.replace("uploads/", "");
            this.setState({
                user: {
                    ...this.state.user,
                    imgPath: newImgPath
                }
            })
            await axios.patch("/api/users/" + this.state.user.id, { "imgPath": newImgPath })
            await axios.delete("/api/photos/" + oldImgPath);
        } catch (error) { }
    }

    async setFriendAndBlockBoolean(user: IUserInterface) {
        try {
            const data = await axios.get("/api/users/relationships/" + user.id + "/" + "1") // A CHANGER a remettre quand ca marchera
            if (data.data.type !== this.state.user.relationshipType) {
                let a = { ...this.state.user }
                a.relationshipType = data.data.type;
                this.setState({ user: a });
            }
        } catch (error) {
            let a = { ...this.state.user }
            a.relationshipType = UserRelationshipTypes.null;
            this.setState({ user: a });
        }
    }

    updateRelationshipState(newType: UserRelationshipTypes) {
        this.setState({
            user: {
                ...this.state.user,
                relationshipType: newType
            }
        })
    }

    async addFriend(id: string) {
        let inf = (Number("1") < Number(id));
        try {
            const currentRel = await axios.get("/api/users/relationships/" + id + "/" + "1");
            if (!(inf && currentRel.data.type & UserRelationshipTypes.pending_first_second) &&
                !(!inf && currentRel.data.type & UserRelationshipTypes.pending_second_first)) {
                let newType: UserRelationshipTypes = currentRel.data.type;
                newType |= inf ?
                    UserRelationshipTypes.pending_first_second :
                    UserRelationshipTypes.pending_second_first
                try {
                    await axios.patch("/api/users/relationships/" + currentRel.data.id, { type: newType })
                    this.updateRelationshipState(newType);
                } catch (error) { }
            }
        } catch (error) {
            let newType: UserRelationshipTypes = inf ?
                UserRelationshipTypes.pending_first_second :
                UserRelationshipTypes.pending_second_first
            try {
                await axios.post("/api/users/relationships", {
                    user1_id: id + "",
                    user2_id: "1",
                    type: newType
                })
                this.updateRelationshipState(newType);
            } catch (error) { }
        }
    }

    async removeFriend(id: string) {
        try {
            const currentRel = await axios.get("/api/users/relationships/" + id + "/" + "1");
            if (currentRel.data.type & UserRelationshipTypes.friends) {
                let newType: UserRelationshipTypes = currentRel.data.type & ~UserRelationshipTypes.friends;
                try {
                    if (newType === UserRelationshipTypes.null) {
                        await axios.delete("/api/users/relationships/" + currentRel.data.id)
                        this.setState({
                            user: {
                                ...this.state.user,
                                relationshipType: newType
                            }
                        })
                    } else {
                        await axios.patch("/api/users/relationships/" + currentRel.data.id, { type: newType })
                        this.updateRelationshipState(newType);
                    }
                } catch (error) { }
            }
        } catch (error) { }
    }

    async blockUser(id: string) {
        let inf = (Number("1") < Number(id));
        try {
            const currentRel = await axios.get("/api/users/relationships/" + id + "/" + "1");
            console.log("currentRel : " + currentRel.data);
            if (!(inf && currentRel.data.type & UserRelationshipTypes.block_first_second) &&
                !(!inf && currentRel.data.type & UserRelationshipTypes.block_second_first)) {
                let newType: UserRelationshipTypes = currentRel.data.type;
                newType |= inf ?
                    UserRelationshipTypes.block_first_second :
                    UserRelationshipTypes.block_second_first
                try {
                    await axios.patch("/api/users/relationships/" + currentRel.data.id, { type: newType })
                    this.updateRelationshipState(newType);
                } catch (error) { }
            }
        } catch (error) {
            let newType: UserRelationshipTypes = inf ?
                UserRelationshipTypes.block_first_second :
                UserRelationshipTypes.block_second_first
            try {
                await axios.post("/api/users/relationships", {
                    user1_id: id + "",
                    user2_id: "1",
                    type: newType
                })
                this.updateRelationshipState(newType);
            } catch (error) { }
        }
    }

    async unblockUser(id: string) {
        let inf = (Number("1") < Number(id));
        try {
            const currentRel = await axios.get("/api/users/relationships/" + id + "/" + "1");
            if (!(inf && !(currentRel.data.type & UserRelationshipTypes.block_first_second)) &&
                !(!inf && !(currentRel.data.type & UserRelationshipTypes.block_second_first))) {
                let newType: UserRelationshipTypes = currentRel.data.type;
                newType &= inf ?
                    ~UserRelationshipTypes.block_first_second :
                    ~UserRelationshipTypes.block_second_first
                try {
                    if (newType === UserRelationshipTypes.null) {
                        await axios.delete("/api/users/relationships/" + currentRel.data.id)
                        this.updateRelationshipState(newType);
                    } else {
                        await axios.patch("/api/users/relationships/" + currentRel.data.id, { type: newType })
                        this.updateRelationshipState(newType);
                    }
                } catch (error) { }
            }
        } catch (error) { }
    }

    onSubmitChangeUsername = async (values: IUserChangeNameFormValues) => {
        try {
            await axios.patch("/api/users/" + this.state.user.id, { "name": values.username });
            this.setState({
                user: {
                    ...this.state.user,
                    name: values.username
                },
                showWrongUsernameMessage: false
            });
            return true;
        } catch (error) {
            this.setState({
                showWrongUsernameMessage: true
            });
        }

    };

    render() {

        this.params = this.props;

        if (this.params.match.params.id === "find") {
            return <div></div>;
        }

        if (this.params.match.params.id === "create") {
            return <div></div>;
        }

        if (!this.state.doesUserExist) {
            return <div className="px-2 py-2 font-bold">This user does not exist</div>
        }

        let isMe = (this.state.id === undefined || Number(this.state.id) === Number("1"));

        return (
            <div className="">
                <section className="relative w-full">
                    <UserInformation
                        id={this.state.user.id}
                        name={this.state.user.name}
                        status={this.state.user.status}
                        nbWin={this.state.user.nbWin}
                        nbLoss={this.state.user.nbLoss}
                        imgPath={this.state.user.imgPath}
                        // --------------------------------------------------
                        isMe={isMe} // A CHANGER AVEC app.state.user.id !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        // --------------------------------------------------
                        relationshipTypes={this.state.user.relationshipType}    // A Gerer au niveau de l'update
                        idInf={Number("1") < Number(this.state.user.id)}
                        // isFriend
                        twoFactorAuth={this.state.user.twoFactorAuth}
                        handleClickTwoFactorAuth={this.handleClickTwoFactorAuth}
                        handleClickProfilePicture={this.handleClickProfilePicture}
                        onFileChange={this.onFileChange}
                        addFriend={this.addFriend}
                        removeFriend={this.removeFriend}
                        blockUser={this.blockUser}
                        unblockUser={this.unblockUser}
                        changeUsername={this.onSubmitChangeUsername}
                        showWrongUsernameMessage={this.state.showWrongUsernameMessage}
                    />
                </section>
                <div className="relative flex flex-wrap justify-center w-full">
                    <section className="relative">
                        <UserStats
                            nbWin={this.state.user.nbWin}
                            nbLoss={this.state.user.nbLoss}
                        />
                    </section>
                    <section className="relative">
                        <MatchHistory />
                    </section>
                </div>
            </div>
        );

    }
}

export default UserPage;