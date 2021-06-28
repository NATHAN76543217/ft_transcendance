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

// interface UserCreateFormData {
//     username: string,
// }


class UserDelete extends React.Component<UserProps, UserStates> {

    constructor(props: UserProps) {
        super(props);
        this.state = {
            list: [],
            username: ""
        };
    }

    // componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
    //     // Typical usage (don't forget to compare props):
    //     console.log("Previous list: " + prevStates.list);
    //     console.log("Current list: " + this.state.list);
    // }

    onSubmit = async (values: IUserDeleteFormValues) => {

        // try {
        //     const data = await axios.post("/api/users", { name: values.username });
        //     console.log(data);
        // } catch (error) {
        //     console.log(error);
        // }

        try {
            const data = await axios.delete("/api/users/" + values.id);
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
                <UserDeleteForm onSubmit={this.onSubmit} />
            </div>
        );
    }
}

export default UserDelete;
