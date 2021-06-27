import React from 'react';

// import Button from '../../components/utilities/Button';
import UserPage from './userPage';
import UserSearch from './userSearch';
import UserCreate from './userCreate';
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
                <Route exact path='/users/find'>
                    <UserSearch />
                </Route>

                <Route exact path="/users/" component={UserPage} />

                <Route exact path="/users/:id" component={UserPage} />




                <Route exact path='/users/create'>
                    <UserCreate />
                </Route>

            </div>
        );
    }
}

export default User;