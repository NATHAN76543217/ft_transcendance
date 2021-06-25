import React, { useCallback } from 'react';

// import Button from '../../components/utilities/Button';
import UserInformation from '../../components/userInformation/userInformation';
import UserSearchForm from '../../components/Forms/userSearchForm';
import IUserSearchFormValues from '../../components/Forms/IUserSearchFormValues';
import axios from 'axios';
import User from './IUserInterface';

interface UserProps {
    id?: number,
    isMe?: boolean | false,
}

interface UserStates {
    list: User[],
    username: string
}

interface UserSearchFormData {
    username: string,
}

class UserSearch extends React.Component<UserProps, UserStates> {

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

    onSubmit = async (values: IUserSearchFormValues) => {

        // try {
        //     const data = await axios.post("/api/users", { name: values.username });
        //     console.log(data);
        // } catch (error) {
        //     console.log(error);
        // }

        try {
            const data = await axios.get("/api/users");
            console.log(data);
            this.setState({ list: data.data });
        } catch (error) {
            console.log(error);
        }

        this.setState({ username: values.username });

    };



    render() {
        return (
            <div className="">
                <UserSearchForm onSubmit={this.onSubmit} />

                <ul>
                    {this.state.list.map((user) => (
                        <li key={user.id} className="relative w-full">
                            <UserInformation
                                name={user.name}
                                status="Connected"
                                isFriend
                            />
                        </li>
                    ))}

                    {/* <li className="relative w-full">
                        <UserInformation
                            name="Login"
                            status="Connected"
                            isFriend
                        />
                    </li> */}
                </ul>
            </div>
        );
    }
}

export default UserSearch;
