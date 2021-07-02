import React from 'react';

import UserCreateForm from '../../components/Forms/userCreateForm';
import axios from 'axios';
import UserInterface from '../../components/interface/IUserInterface';
import IUserCreateFormValues from '../../components/interface/IUserCreateFormValues';

interface UserProps {
    id?: number,
    isMe?: boolean | false,
}

interface UserStates {
    list: UserInterface[],
    username: string
}

// interface UserCreateFormData {
//     username: string,
// }

class UserCreate extends React.Component<UserProps, UserStates> {

    constructor(props: UserProps) {
        super(props);
        this.state = {
            list: [],
            username: ""
        };
    }

    onSubmit = async (values: IUserCreateFormValues) => {
        try {
            const data = await axios.post("/api/users", values);
            console.log(data);
        } catch (error) { }
    };

    render() {
        return (
            <div className="">
                <UserCreateForm onSubmit={this.onSubmit} />
            </div>
        );
    }
}

export default UserCreate;
