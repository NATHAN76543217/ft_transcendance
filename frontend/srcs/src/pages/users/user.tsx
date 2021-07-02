import React from 'react';

// import Button from '../../components/utilities/Button';
import UserPage from './userPage';
import UserSearch from './userSearch';
import UserCreate from './userCreate';
import { Route } from 'react-router';
import UserDelete from './userDelete';

interface UserProps {
    updateAllRelationships: () => void,
    myId: string,
}

interface UserStates {

}

class User extends React.Component<UserProps, UserStates> {
    constructor(props: UserProps)
    {
        super(props);
    }

    // const isMe: boolean;

    render() {
        return (
            <div className="">
                <Route exact path='/users/find'>
                    <UserSearch
                        updateAllRelationships={this.props.updateAllRelationships}
                        myId={this.props.myId}
                    />
                </Route>

                {/* <Route exact path="/users" component={UserPage}/> */}
                <Route exact path="/users" render={(props) => <UserPage
                            myId={this.props.myId}
                            updateAllRelationships={this.props.updateAllRelationships}
                            {...props} />
                        } />

                {/* <Route exact path="/users/:id" component={UserPage} /> */}
                <Route exact path="/users/:id" render={(props) => <UserPage
                            myId={this.props.myId}
                            updateAllRelationships={this.props.updateAllRelationships}
                            {...props} />
                        } />



    {/* --------- TEST --------- */}
                <Route exact path='/users/create'>
                    <UserCreate />
                </Route>

                <Route exact path='/users/delete'>
                    <UserDelete />
                </Route>
    {/* ------------------------ */}


            </div>
        );
    }
}

export default User;