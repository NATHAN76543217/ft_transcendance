import React from 'react';

import UserDeleteForm from '../../components/Forms/userDeleteForm';
import axios from 'axios';
import UserInterface from '../../components/interface/IUserInterface';
import IUserDeleteFormValues from '../../components/interface/IUserDeleteFormValues';

interface UserProps {
    id?: number,
    isMe?: boolean | false,
}

interface UserStates {
    list: UserInterface[],
    username: string
}

class UserDelete extends React.Component<UserProps, UserStates> {

    constructor(props: UserProps) {
        super(props);
        this.state = {
            list: [],
            username: ""
        };
    }

    onSubmit = async (values: IUserDeleteFormValues) => {
        try {
            const data = await axios.delete("/api/users/" + values.id);
            console.log(data);
        } catch (error) { }
    };

    render() {
        return (
            <div className="">
                <UserDeleteForm onSubmit={this.onSubmit} />
            </div>
        );
    }
}

export default UserDelete;
