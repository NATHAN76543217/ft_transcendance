import React from 'react';

// import Button from '../../components/utilities/Button';
import UserPage from './userPage';
import UserSearch from './userSearch';
import { Route } from 'react-router';

class User extends React.Component {
    // constructor(props) 
    // {
    //     super(props);
    //     this.props.isMe = false;
    // }

    // const isMe: boolean;

    render() {
        return (
            <div className="">
                <Route path='/users/find'>
                    <UserSearch />
                </Route>
                <Route exact path='/users'>
                    <UserPage isMe={true}/>
                </Route>
            </div>
        );
    }
}

export default User;