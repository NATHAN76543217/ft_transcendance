import React from 'react';

// import Button from '../../components/utilities/Button';
import UserInformation from '../../components/userInformation/userInformation';
import UserStats from '../../components/userStats/userStats';
import MatchHistory from '../../components/matchHistory/matchHistory';

class Profile extends React.Component {
    render() {
        return (
            <div className="w-full">
                <section className="relative w-full">
                    <UserInformation
                        name="Login"
                        status="Connected"
                        isMe
                        // isFriend
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

export default Profile;