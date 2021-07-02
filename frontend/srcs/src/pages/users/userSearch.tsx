import React from 'react';

// import Button from '../../components/utilities/Button';
import UserInformation from '../../components/users/userInformation';
import UserSearchForm from '../../components/Forms/userSearchForm';
import IUserSearchFormValues from '../../components/interface/IUserSearchFormValues';
import axios from 'axios';
import IUserInterface from '../../components/interface/IUserInterface';
import { UserRelationshipTypes } from '../../components/users/userRelationshipTypes';


interface UserProps {
    id?: string,
    isMe?: boolean | false,
}

interface UserStates {
    list: IUserInterface[],
    username: string
}

class UserSearch extends React.Component<UserProps, UserStates> {

    constructor(props: UserProps) {
        super(props);
        this.state = {
            list: [],
            username: ""
        };
        this.addFriend = this.addFriend.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.blockUser = this.blockUser.bind(this);
        this.unblockUser = this.unblockUser.bind(this);
    }

    componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
        // Typical usage (don't forget to compare props):
        // console.log("Previous list: " + prevStates.list);
        // console.log("Current list: " + this.state.list);
        // if (JSON.stringify(prevStates.list) !== JSON.stringify(this.state.list)) {
        //     this.setFriendAndBlockBoolean(this.state.list); // infinite loop ?
        // }
    }

    async setFriendAndBlockBoolean(list: IUserInterface[]) {
        list.map(async (user, index) => {
            try {
                const data = await axios.get("/api/users/relationships/" + user.id + "/" + "1") // A CHANGER a remettre quand ca marchera
                if (data.data.type !== this.state.list[index].relationshipType) {
                    let a = this.state.list.slice()
                    a[index].relationshipType = data.data.type;
                    this.setState({ list: a });
                }
            } catch (error) {
                let a = this.state.list.slice()
                a[index].relationshipType = UserRelationshipTypes.null;
                this.setState({ list: a });
            }
        })
    }

    onSubmit = async (values: IUserSearchFormValues) => {
        try {
            const data = await axios.get("/api/users?name=" + values.username);
            let a = data.data.slice()
            a.sort((user1: IUserInterface, user2: IUserInterface) => user1.name.localeCompare(user2.name))
            this.setFriendAndBlockBoolean(a);
            this.setState({ list: a });
        } catch (error) { }
        this.setState({ username: values.username });
    };

    updateRelationshipState(id: string, newType: UserRelationshipTypes) {
        let a = this.state.list.slice()
        let index = a.findIndex((userId) => userId.id === id)
        a[index].relationshipType = newType;
        this.setState({ list: a });
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
                    this.updateRelationshipState(id, newType);
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
                this.updateRelationshipState(id, newType);
            } catch (error) {
                console.log(error);
            }
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
                        this.updateRelationshipState(id, newType);
                    } else {
                        await axios.patch("/api/users/relationships/" + currentRel.data.id, { type: newType })
                        this.updateRelationshipState(id, newType);
                    }
                } catch (error) { }
            }
        } catch (error) { }
    }

    async blockUser(id: string) {
        let inf = (Number("1") < Number(id));
        try {
            const currentRel = await axios.get("/api/users/relationships/" + id + "/" + "1");
            if (!(inf && currentRel.data.type & UserRelationshipTypes.block_first_second) &&
                !(!inf && currentRel.data.type & UserRelationshipTypes.block_second_first)) {
                let newType: UserRelationshipTypes = currentRel.data.type;
                newType |= inf ?
                    UserRelationshipTypes.block_first_second :
                    UserRelationshipTypes.block_second_first
                try {
                    await axios.patch("/api/users/relationships/" + currentRel.data.id, { type: newType })
                    this.updateRelationshipState(id, newType);
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
                this.updateRelationshipState(id, newType);
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
                        this.updateRelationshipState(id, newType);
                    } else {
                        await axios.patch("/api/users/relationships/" + currentRel.data.id, { type: newType })
                        this.updateRelationshipState(id, newType);
                    }
                } catch (error) { }
            }
        } catch (error) { }
    }

    render() {
        return (
            <div className="">
                <UserSearchForm onSubmit={this.onSubmit} />

                <ul>
                    {this.state.list.map((user) => (

                        <li key={user.id} className="relative w-full">
                            <UserInformation
                                id={user.id}
                                name={user.name}
                                status={user.status}
                                nbWin={user.nbWin}
                                nbLoss={user.nbLoss}
                                imgPath={user.imgPath}
                                relationshipTypes={user.relationshipType}
                                idInf={Number("1") < Number(user.id)}
                                addFriend={this.addFriend}
                                removeFriend={this.removeFriend}
                                blockUser={this.blockUser}
                                unblockUser={this.unblockUser}
                                // --------------------------------------------------
                                // isFriend={user.relationshipType === UserRelationshipTypes.friends}    // A CHANGER QUAND ON SAURA
                                // --------------------------------------------------
                                // --------------------------------------------------
                                // isBlocked={
                                //     (Number("1") < Number(user.id) && user.relationshipType === UserRelationshipTypes.block_first_second) ||
                                //     (Number("1") > Number(user.id) && user.relationshipType === UserRelationshipTypes.block_second_first)
                                // }    // A CHANGER QUAND ON SAURA
                                // --------------------------------------------------
                                isInSearch
                                // --------------------------------------------------
                                isMe={Number(user.id) === Number("1")} // A CHANGER AVEC app.state.user.id !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            // --------------------------------------------------
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default UserSearch;
