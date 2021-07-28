import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import FriendsBar from "./components/friendsBar/friendsBar";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import SideMenu from "./components/sideMenu/sideMenu";
import Home from "./pages/home/home";
import Game from "./pages/game/game";
import User from "./pages/users/user";
import Admin from "./pages/admin/admin";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import ChatPage from "./pages/chat/chat";
import React from "react";
import { IUser, UserChannelRelationship, UserRole, UserStatus } from "./models/user/IUser";
import axios from "axios";
import OnlyPublic from "./routes/onlyPublic";
import PrivateRoute from "./routes/privateRoute";

import { AppState } from "./AppState";
import { IAppContext } from "./IAppContext";
import AppContext from "./AppContext";
import { AuthenticatedUser } from "./models/user/AuthenticatedUser";
import UserRelationship, { UserRelationshipType } from "./models/user/UserRelationship";
import { AppUserRelationship } from "./models/user/AppUserRelationship";
import BanPage from "./pages/banPage/banPage";
import { io } from "socket.io-client";
import FailedLogin from "./pages/failedLogin/failedLogin";
import { ChannelRelationshipType } from "./models/channel/ChannelRelationship";

// let change_bg_color_with_size =
//   "bg-gray-500 sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-purple-500"; // for testing

let change_bg_color_with_size =
  "bg-gray-200"

interface AppProps { }

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      relationshipsList: [],
      socket: undefined,
      user: this.getCachedUser(),
    };
  }

  setUserInit = (user?: AuthenticatedUser) => {
    if (user !== this.state.user) {
      // if the user is undefined, he is not logged
      const logged = user !== undefined;
      let socket;
      if (logged) {
        socket = this.getSocket();
      } else {
        socket = undefined;
        this.state.socket?.close();
      }

      // update state
      this.setState({
        user: user,
        socket: socket
      },
        () => { this.updateAllRelationships() });

      // update cache
      try {
        if (user === undefined) localStorage.removeItem("user");
        else localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // We do not need to bind when using the equal form
  setUser = (user?: AuthenticatedUser) => {
    if (user !== this.state.user) {
      // if the user is undefined, he is not logged
      const logged = user !== undefined;
      let socket = this.state.socket;
      if (!logged) {
        socket = undefined;
        this.state.socket?.close();
      }

      // update state
      this.setState({
        user: user,
        socket: socket
      });

      // update cache
      try {
        if (user === undefined) localStorage.removeItem("user");
        else localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    }
  };
  /* 
  setToken = async (token?: string) => {
    // Set or clear the token
    localStorage.setItem("token", token ?? "");
    if (token)
    {
      this.GetLoggedProfile()
    }
  }; */

  // Get logged profile for OAuth users

  getCachedUser = () => {
    const userData = localStorage.getItem("user");

    if (userData !== null) {
      try {
        const user = JSON.parse(userData) as IUser;
        /* 
        if (user.imgPath === "default-profile-picture.png") {
          window.location.href = "/users";
        } else {
          window.location.href = "/";
        } */

        return user;
      } catch {
        localStorage.removeItem("user");
      }
    }

    /* const dataUpdate = axios.patch(
      `/api/users/${user.id}`,
      { status: UserStatus.online }
    ); */
    // console.log("data Update login: ",dataUpdate)

    //return <Loading />
    // return <p>You will be redirected soon</p>;
    //}
    return undefined;
  };

  // TODO: Find out why the api gets called twice
  getCurrentUser = async () => {
    try {
      const res = await axios.get<AuthenticatedUser>(`/api/users/me`, {
        withCredentials: true,
      });

      this.setUserInit(res.data);
    } catch (e) {
      this.setUserInit();
      // TODO: Handle refresh token if status 401 (Unauthorized)
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          try {
            await axios.get("/api/authentication/refresh");
            const res = await axios.get<AuthenticatedUser>(`/api/users/me`, {
              withCredentials: true,
            });
            this.setUserInit(res.data);
          } catch (error) { }
        } else {
          console.log("TODO: GetLoggedProfile: Handle status:", e.message);
        }
      }
    }
  };
  /* 
  getOldState = () => {
    if (this.state.user == null) {
      const user = localStorage.getItem("user");
      if (user === null) return false;
      else this.setUser(JSON.parse(user));
    }
    return true; 
  };*/

  componentDidMount() {
    // this.getCachedUser();
    this.getCurrentUser();
    // this.updateAllRelationships();
  }

  async sortRelationshipsList() {
    let a = this.state.relationshipsList.slice();
    a.sort((user1: AppUserRelationship, user2: AppUserRelationship) =>
      user1.user.name.localeCompare(user2.user.name)
    );
    this.setState({ relationshipsList: a });
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    // if (prevState.user?.toString() !== this.state.user?.toString()) {
    //   this.updateAllRelationships();
    // } else if (
    //   prevState.relationshipsList.toString() !==
    //   this.state.relationshipsList.toString()
    // ) {
    //   this.sortRelationshipsList();
    // }
    if (this.state.user !== undefined && this.state.socket === undefined) {
      const newSocket = this.getSocket();
      this.setState({
        ...this.state,
        socket: newSocket,
      });
    }
    console.log("componentDidUpdate - state", this.state);
  }

  updateAllRelationships = async () => {
    try {
      const dataRel = await axios.get(
        "/api/users/relationships/" + this.state.user?.id
      );
      // console.log("dataRel", dataRel)

      let a: AppUserRelationship[] = [];
      if (!dataRel.data.length) {
        this.setState({ relationshipsList: a });
      } else {
        await dataRel.data.map(async (relation: UserRelationship) => {
          let inf = Number(relation.user1_id) === Number(this.state.user?.id);
          let friendId = inf ? relation.user2_id : relation.user1_id;
          try {
            const dataUser = await axios.get("/api/users/" + friendId);
            if (relation.type & UserRelationshipType.block_both) {
              dataUser.data.status = UserStatus.Offline;
            }
            // console.log("dataUser", dataUser);
            a.push({
              user: dataUser.data,
              relationshipType: relation.type,
            });
            this.setState({ relationshipsList: a });
          } catch (error) { }
        });
      }
    } catch (error) { }
  }

  updateOneRelationshipType = async (user_id: number, newType: UserRelationshipType) => {
    let a = this.state.relationshipsList.slice();
    let index = a.findIndex((relation: AppUserRelationship) => {
      return (Number(relation.user.id) === Number(user_id));
    })
    if (index !== -1) {
      if (Number(newType) !== Number(UserRelationshipType.null)) {
        a[index].relationshipType = newType
      } else {
        a.splice(index, 1)
      }
      this.setState({ relationshipsList: a });
    } else if (newType !== UserRelationshipType.null) {
      try {
        const dataUser = await axios.get("/api/users/" + user_id);
        a.push({
          user: dataUser.data,
          relationshipType: newType,
        });
        a.sort((user1: AppUserRelationship, user2: AppUserRelationship) =>
          user1.user.name.localeCompare(user2.user.name)
        );
        this.setState({ relationshipsList: a });
      } catch (e) {
        console.log(e)
      }
    }
  }

  updateOneRelationshipStatus = async (user_id: number, newStatus: UserStatus) => {
    let a = this.state.relationshipsList.slice();
    let index = a.findIndex((relation: AppUserRelationship) => {
      return (Number(relation.user.id) === Number(user_id));
    })
    if (index !== -1 && this.state.user) {
      if (a[index].relationshipType & UserRelationshipType.block_both) {
        newStatus = UserStatus.Offline;
      }
      if (Number(newStatus) !== Number(UserStatus.Null)) {
        a[index].user.status = newStatus
        this.setState({ relationshipsList: a });
      }
    }
  }

  updateRole = async (newRole: UserRole) => {
    let newUser = this.state.user;
    if (newUser) {
      newUser.role = newRole;
      this.setState({ user: newUser });
    }
  }

  updateChannelRelationship = async (channel_id: number, user_id: number, newType: ChannelRelationshipType = ChannelRelationshipType.Null) => {
    console.log('updateChannelRelationship')
    if (this.state.user) {
      let a = this.state.user.channels.slice();
      let index = a.findIndex((channel: any) => {
        return (Number(channel.channel.id) === Number(channel_id));
      })
      console.log('updateChannelRelationship - index: ', index)
      if (index !== -1) {
        if (user_id === this.state.user.id) {
          if (Number(newType) !== Number(ChannelRelationshipType.Null)) {
            a[index].type = newType
          } else {
            a.splice(index, 1)
          }

        } else {
          const userIndex = a[index].channel.users.findIndex((elem) => {
            return elem.user.id === user_id
          })
          if (userIndex !== -1) {
            if (newType === ChannelRelationshipType.Null) {
              a[index].channel.users.splice(userIndex, 1);
            } else {
              a[index].channel.users[userIndex].type = newType;
            }
          } else {
            const dataUser = await axios.get('/api/users/' + user_id);
            a[index].channel.users.push({
              type: newType,
              user: {
                id: dataUser.data.id,
                name: dataUser.data.name,
                imgPath: dataUser.data.imgPath
              }
            })
          }
        }
        const newUser = {
          ...this.state.user,
          channels: a
        }
        this.setState({ user: newUser });
      } else if (newType !== ChannelRelationshipType.Null) {
        try {
          const dataChannel = await axios.get("/api/channels/" + channel_id);
          console.log('dataChannel', dataChannel)
          a.push({
            channel: dataChannel.data,
            type: newType,
          });
          a.sort((channel1: UserChannelRelationship, channel2: UserChannelRelationship) =>
            channel1.channel.name.localeCompare(channel2.channel.name)
          );
          const newUser = {
            ...this.state.user,
            channels: a
          }
          this.setState({ user: newUser });
        } catch (e) {
          console.log(e)
        }
      }
    }

  }

  displayAdminRoute(isAdmin: boolean) {
    if (isAdmin) {
      return (
        <Route path="/admin">
          <Admin />
        </Route>
      );
    }
  }

  getSocket = () => {
    console.log("Initiating socket connection...");

    const socket = io("", {
      path: "/api/socket.io/events",
      rejectUnauthorized: false, // This disables certificate authority verification
      withCredentials: true,
    }).on("authenticated", () => {
      console.log("Socket connection authenticated!");
    });

    socket.on('updateRelationship-back', (data: any) => {
      if (data) {
        this.updateOneRelationshipType(data.user_id, data.type)
      }
    })

    socket.on('updateRole-back', (data: any) => {
      if (data && Number(data.user_id) === Number(this.state.user?.id)) {
        this.updateRole(data.role)
      }
    })

    socket.on('updateChannelRelationship-back', (data: any) => {
      if (data && Number(data.user_id) === Number(this.state.user?.id)) {
        this.updateChannelRelationship(data.channel_id, data.type)
      }
    })

    socket.on('joinChannel-back', (data: any) => {
      console.log('joinChannel-back', data)
      // if (data && Number(data.user_id) === Number(this.state.user?.id)) {
      if (data) {
        this.updateChannelRelationship(data.channel_id, data.user_id, data.type)
      }
    })

    socket.on('leaveChannel-back', (data: any) => {
        
      // if (data && (Number(data.user_id) === Number(this.state.user?.id) || data.user_id === '-1')) {
      if (data) {
        const newType = data.type ? data.type : ChannelRelationshipType.Null
        this.updateChannelRelationship(data.channel_id, data.user_id, newType)
      }
    })

    socket.on('statusChanged', (data: any) => {
      this.updateOneRelationshipStatus(data.user_id, data.status);
    })

    // socket.on('message-user', (data: any) => {
    //   // this.updateOneRelationshipStatus(data.user_id, data.status);
    // })

    return socket;
  };



  render() {
    let contextValue: IAppContext = {
      relationshipsList: this.state.relationshipsList,
      user: this.state.user,
      setUser: this.setUser,
      setUserInit: this.setUserInit,
      updateOneRelationshipType: this.updateOneRelationshipType,
      socket: this.state.socket,
    };

    if (
      this.state.user !== undefined &&
      this.state.user.role === UserRole.Banned
    ) {
      return (
        <AppContext.Provider value={contextValue}>
          <div className="h-full">
            <Header />
            <BanPage />
          </div>
        </AppContext.Provider>
      );
    }

    return (
      <AppContext.Provider value={contextValue}>
        <div className="h-full">
          <Router>
            <Switch>
              <Route path="/health">
                <h3 className="text-center">App is healthy!</h3>
              </Route>
              <Route>
                <Header />
                <div className="flex h-full border-t-2 border-gray-700 border-opacity-70">
                  <div className="flex-none border-r-2 border-gray-700 md:block border-opacity-70">
                    <SideMenu logged={this.state.user !== undefined} />
                  </div>
                  <div className="z-30 flex w-full flex-nowrap">
                    <main className={"flex-grow " + change_bg_color_with_size}>
                      <Switch>
                        <Route exact path="/">
                          <Home logged={this.state.user !== undefined} />
                        </Route>
                        <PrivateRoute
                          isAuth={this.state.user !== undefined}
                          path="/game"
                        >
                          <Game />
                        </PrivateRoute>
                        <PrivateRoute
                          isAuth={this.state.user !== undefined}
                          path="/users"
                        >
                          <User relationshipsList={this.state.relationshipsList} />
                        </PrivateRoute>
                        <Route path="/chat/:id?" component={ChatPage} />
                        <Route exact path="/login/success/first">
                          <Redirect to="/users" />
                        </Route>
                        <Route exact path="/login/success">
                          <Redirect to="/" />
                        </Route>
                        <Route exact path="/login/failure">
                          <FailedLogin />
                          {/* <Redirect to="/" /> */}
                        </Route>
                        <OnlyPublic
                          isAuth={this.state.user !== undefined}
                          path="/login/:redirPath?"
                          component={Login}
                        ></OnlyPublic>
                        <OnlyPublic
                          isAuth={this.state.user !== undefined}
                          path="/register"
                        >
                          <Register />
                        </OnlyPublic>
                        {this.displayAdminRoute(
                          // true
                          this.state.user?.role === UserRole.Admin ||
                          this.state.user?.role === UserRole.Owner
                        )}
                      </Switch>
                    </main>
                    <div className="flex-none hidden md:block">
                      <FriendsBar
                        logged={this.state.user !== undefined}
                        relationshipsList={this.state.relationshipsList}
                      />
                    </div>
                  </div>
                </div>
                <Footer />
              </Route>
            </Switch>
          </Router>
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
