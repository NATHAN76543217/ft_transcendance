import React, { useCallback } from 'react';

// import Button from '../../components/utilities/Button';
import UserInformation from '../../components/userInformation/userInformation';
import UserSearchForm from '../../components/Forms/userSearchForm';
import IUserSearchFormValues from '../../components/Forms/IUserSearchFormValues';
import axios from 'axios';

interface UserProps {
    id?: number,
    isMe?: boolean | false,
}

interface   UserStates {
    list: string,
    username: string
}

interface UserSearchFormData {
    username: string,
}

class UserSearch extends React.Component<UserProps, UserStates> {

    constructor(props: UserProps)
    {
        super(props);
        this.state = {
            list: "",
            username: ""
        };
    }

    componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
        // Typical usage (don't forget to compare props):
        console.log("Previous list: " + prevStates.list);
        console.log("Current list: " + this.state.list);
      }

    onSubmit = async (values: IUserSearchFormValues) => {

        const data = await axios.get("/api/users");

        // console.log(values.username);
        // console.log(this.state.list);
        this.setState({username: values.username});
        this.setState({list: data.data});
        // console.log('The list value is ' + list + '!!!');
        // console.log(data);
    };

    

    render() {
        return (
            <div className="">
                <UserSearchForm onSubmit={this.onSubmit}/>

                <ul>
                    <li className="relative w-full">
                        <UserInformation
                            name="Login"
                            status="Connected"
                            isFriend
                        />
                    </li>
                    <li className="relative w-full">
                        <UserInformation
                            name="Login2"
                            status="Offline"
                        />
                    </li>
                    <li className="relative w-full">
                        <UserInformation
                            name="Login3"
                            status="In game"
                            isFriend
                        />
                    </li>
                </ul>
            </div>
        );
    }
}

export default UserSearch;
