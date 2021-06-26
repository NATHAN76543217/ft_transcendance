import UserInformation from '../../components/userInformation/userInformation';
import UserStats from '../../components/userStats/userStats';
import MatchHistory from '../../components/matchHistory/matchHistory';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import IUserInterface from '../../components/interface/IUserInterface';


import React, { useRef } from 'react';

type UserProps = {
    id?: string,
    isMe?: boolean | false
}

// interface ParamTypes {
//     id: string | undefined
// }

interface UserStates {
    id: string,
    doesUserExist: boolean,
    user: IUserInterface,
}

interface InternalValues {
    file: any
}

class UserPage extends React.Component<UserProps & RouteComponentProps, UserStates> {
    private params: any;

    constructor(props: UserProps & RouteComponentProps) {
        super(props);
        this.state = {
            id: "",
            doesUserExist: true,
            user: {
                id: 0,
                name: "",
                password: "",
                nbWin: 0,
                nbLoss: 0,
                stats: 0,
                imgPath: "",
                twoFactorAuth: false,
                status: "",
                channels: []
            }
        };
        this.handleClickTwoFactorAuth = this.handleClickTwoFactorAuth.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    componentDidMount() {
        this.getParams();
    }

    getParams = () => {
        this.params = this.props;
        let userId = this.params.match.params.id;

        if (this.params.match.params.id === undefined) {
            // userId = app.state.userId;                           // a remettre quand ca marchera
            userId = '1';
        }

        if (this.state.id !== this.params.match.params.id) {
            this.setState({
                id: this.params.match.params.id,
                user : {
                    ...this.state.user,
                    id: userId
                }
            });
        }
    };

    componentDidUpdate(prevProps: UserProps, prevStates: UserStates) {
        this.getParams();
        
        if (prevStates.id !== this.state.id) {
            this.onLoad(this.state.user.id);
        }
        // console.log("didupdate user id: " + this.state.user.id);
        // console.log("didupdate id: " + this.state.id);
    }

    componentWillUnmount() {
        // console.log("unmount - id = " + this.state.user);
    }

    onLoad = async (userId: number) => {
        try {
            if (!isNaN(Number(userId))) {
                const data = await axios.get("/api/users/" + this.state.user.id);
                console.log(data);
                this.setState({
                    doesUserExist: true,
                    user: data.data
                });
            }
            else {
                this.setState({doesUserExist: false})
            }
        } catch (error) {
            this.setState({doesUserExist: false})
            console.log(error);
        }
    };

    async handleClickTwoFactorAuth() {
        let newTwoFactorAuth = !this.state.user.twoFactorAuth;
        try {
            const data = await axios.patch("/api/users/" + this.state.user.id, { "twoFactorAuth": newTwoFactorAuth })
            console.log("two factor auth changed to: " + !this.state.user.twoFactorAuth)
            this.setState({
                user: {
                    ...this.state.user,
                    twoFactorAuth: newTwoFactorAuth
                }
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    async handleClickProfilePicture() {
        
        // try {
        //     const data = await axios.patch("/api/users/" + this.state.user.id, { "twoFactorAuth": newTwoFactorAuth })
        //     console.log("two factor auth changed to: " + !this.state.user.twoFactorAuth)
        //     this.setState({
        //         user: {
        //             ...this.state.user,
        //             twoFactorAuth: newTwoFactorAuth
        //         }
        //     });
        //     console.log(data);
        // } catch (error) {
        //     console.log(error);
        // }
    }

    async getProfilePicture(pictureId: string) {
        try {
            const data = await axios.get("/uploads/" + pictureId)
            console.log("test ---- data");
            console.log(data);
            return data.request.responseURL
            
        } catch (error) {
            console.log(error);
        }    
    }

    onFileChange (fileChangeEvent: any) {
        // values.current.file = fileChangeEvent.target.files[0];
        this.submitForm(fileChangeEvent.target.files[0]);
    }
    
    async submitForm (valuesCurrentFile: any) {
        if (!valuesCurrentFile) {
            return false;
        }
        
        let formData = new FormData();
    
        formData.append("photo", valuesCurrentFile, valuesCurrentFile.name);
        
        try {
            const data = await axios.post("/api/photos/upload", formData);
            // console.log(data);
            this.setState({user: {
                ...this.state.user,
                imgPath: data.data.path
            }})
            const data2 = await axios.patch("/api/users/" + this.state.user.id, { "imgPath": data.data.path })
            // console.log(data2);
        } catch(error) {
            console.log(error);
        }
    }

    render() {

        this.params = this.props;

        if (this.params.match.params.id === "find") {
            return <div></div>;
        }

        if (this.params.match.params.id === "create") {
            return <div></div>;
        }

        if (!this.state.doesUserExist) {
            return <div className="px-2 py-2 font-bold">This user does not exist</div>
        }

        return (
            <div className="">
                <section className="relative w-full">
                    <UserInformation
                        id={Number(this.state.user.id)}
                        name={this.state.user.name}
                        status={this.state.user.status}
                        nbWin={this.state.user.nbWin}
                        nbLoss={this.state.user.nbLoss}
                        imgPath={this.state.user.imgPath}
                        isMe={this.state.id === undefined}
                        isFriend
                        twoFactorAuth={this.state.user.twoFactorAuth}
                        handleClickTwoFactorAuth={this.handleClickTwoFactorAuth}
                        handleClickProfilePicture={this.handleClickProfilePicture}
                        onFileChange={this.onFileChange}
                    />
                </section>
                <div className="relative flex flex-wrap justify-center w-full">
                    <section className="relative">
                        <UserStats
                            nbWin={this.state.user.nbWin}
                            nbLoss={this.state.user.nbLoss}
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