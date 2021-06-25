import UserInformation from '../../components/userInformation/userInformation';
import UserStats from '../../components/userStats/userStats';
import MatchHistory from '../../components/matchHistory/matchHistory';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import IUserInterface from './IUserInterface';


import React from 'react';

type UserProps = {
    id?: string,
    isMe?: boolean | false
}

// interface ParamTypes {
//     id: string | undefined
// }

interface UserStates {
    id: string,
    user: IUserInterface,
}

class UserPage extends React.Component<UserProps  & RouteComponentProps, UserStates> {
    private params: any;

    constructor(props: UserProps  & RouteComponentProps) {
        super(props);
        this.state = {
            id: "",
            user: {
                id: 0,
                name: "",
                status: ""
            }
        };
    }
    

    componentDidMount()
    {
        this.getParams();
    }
    
    getParams = () => {
        this.params = this.props;
        
        if (this.state.id !== this.params.match.params.id) {
            this.setState({
                id: this.params.match.params.id
            });
        }
    };


    componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
        console.log("catched id is " + this.state.id);
        console.log("prev catched id is " + prevStates.id);
        console.log("user is " + this.state.user);
        this.getParams();
        if (prevStates.id !== this.state.id && this.state.id !== undefined) {
            this.onLoad(this.state.id);
        }
    }

    componentWillUnmount() {
        console.log("unmount - id = " + this.state.user);
    }
    
    onLoad = async (id: string) => {
        try {
            if (!isNaN(Number(id))) {
                const data = await axios.get("/api/users/" + this.state.id);
                console.log(data);
                this.setState({ user: data.data });
            }
        } catch (error) {
            console.log(error);
        }
    };

    render() {


    this.params = this.props;

    if (this.params.match.params.id === "find") {
        return <div></div>;
    }

        return (
            <div className="">
                <section className="relative w-full">
                    <UserInformation
                        id={Number(this.state.id)}
                        name={this.state.user.name}
                        status={this.state.user.status}
                        isMe={this.state.id === undefined}
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
        
    // catch (error) {
    //     return <div>This user does not exist</div>
    // }


}
}

export default UserPage;