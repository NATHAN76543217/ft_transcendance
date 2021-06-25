import UserInformation from '../../components/userInformation/userInformation';
import UserStats from '../../components/userStats/userStats';
import MatchHistory from '../../components/matchHistory/matchHistory';
import { useParams } from 'react-router-dom';

// type UserProps = {
//     id?: number,
//     isMe?: boolean | false
// }

interface ParamTypes {
    id: string | undefined
}

function UserPage() {

        const { id } = useParams<ParamTypes>();

        if (id === "find") {
            return <div></div>;
        }

        return (
            <div className="">
                <section className="relative w-full">
                    <UserInformation
                        id={Number(id)}
                        name="Login"
                        status="Connected"
                        isMe={id === undefined}
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
    // }
}

export default UserPage;