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

    componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
        // Typical usage (don't forget to compare props):
        console.log("Previous list: " + prevStates.list);
        console.log("Current list: " + this.state.list);
    }

    onSubmit = async (values: IUserCreateFormValues) => {

        // try {
        //     const data = await axios.post("/api/users", { name: values.username });
        //     console.log(data);
        // } catch (error) {
        //     console.log(error);
        // }

        try {
            const data = await axios.post("/api/users", values);
            console.log(data);
            // this.setState({ list: data.data });
        } catch (error) {
            console.log(error);
        }

        // this.setState({ username: values.username });

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
