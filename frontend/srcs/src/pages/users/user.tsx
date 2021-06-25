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
                <Route exact path='/users/find'>
                    <UserSearch />
                </Route>
                {/* <Route exact path='/users'>
                    <UserPage />
                </Route> */}
                <Route exact path="/users/" component={UserPage} />

                {/* <Route path={'/users/:id'} render={props => <UserPage {...props}} /> */}
                <Route exact path="/users/:id" component={UserPage} />


                {/* <Route path="/users/:id" component={UserPage}/> */}


                {/* <Route
                    exact path="/users/:id"
                    render={(props) =>
                        <UserPage isMe={false} id={Number(props.match.params.id)} />

                    }
                /> */}

            </div>
        );
    }
}

export default User;