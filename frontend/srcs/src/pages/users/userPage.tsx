import React from 'react';

// import Button from '../../components/utilities/Button';
import UserInformation from '../../components/userInformation/userInformation';
import UserStats from '../../components/userStats/userStats';
import MatchHistory from '../../components/matchHistory/matchHistory';

type UserProps = {
    id?: number,
    isMe?: boolean | false
}

class UserPage extends React.Component<UserProps,{}> {
    // constructor(props) 
    // {
    //     super(props);
    //     this.props.isMe = false;
    // }

    // const isMe: boolean;

    render() {
        return (
            <div className="">
                <section className="relative w-full">
                    <UserInformation
                        name="Login"
                        status="Connected"
                        isMe={this.props.isMe}
                        isFriend
                    />
                </section>
                <div className="relative flex flex-wrap justify-center w-full">
                    <section className="relative">
                        <UserStats
                        nbWin={15}
                        nbLoss={5}
                        />
                    </section>
                    <section className="relative">
                        <MatchHistory />
                    </section>
                </div>
            </div>
        );
    }
}

export default UserPage;