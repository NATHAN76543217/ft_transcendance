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
import Game from "./pages/game/pages/game";
import User from "./pages/users/user";
import Admin from "./pages/admin/admin";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import ChatPage from "./pages/chat/chat";
import React from "react";
import {
  IUser,
  UserChannelRelationship,
  UserRole,
  UserStatus,
} from "./models/user/IUser";
import axios from "axios";
import OnlyPublic from "./routes/onlyPublic";
import PrivateRoute from "./routes/privateRoute";

import { AppState } from "./AppState";
import { IAppContext } from "./IAppContext";
import AppContext from "./AppContext";
import UserRelationship, {
  UserRelationshipType,
} from "./models/user/UserRelationship";
import { AppUserRelationship } from "./models/user/AppUserRelationship";
import BanPage from "./pages/banPage/banPage";
import { Socket } from "socket.io-client";
import FailedLogin from "./pages/failedLogin/failedLogin";
import { ChannelRelationshipType } from "./models/channel/ChannelRelationship";
import TwoFactorAuth from "./pages/login/two-factor";
import { Message, MessageType } from "./models/channel/Channel";
import { getSocket } from "./components/utilities/getSocket";
import { Events } from "./models/channel/Events";

interface AppProps { }

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      relationshipsList: [],
      eventSocket: undefined,
      user: this.getCachedUser(),
    };
  }

  onEventSocketConnection = (socket: Socket) => {
    // console.log("Registering event-socket callbacks...");

    // TODO: Define data dtos here to prevent missuse
    // TODO: Send numbers from the backend instead of converting

    socket.on(Events.Client.UpdateUserRelation, (data: any) => {
      if (data) {
        this.updateOneRelationshipType(data.user_id, data.type);
      }
    });

    socket.on(Events.Client.UpdateUserInfo, (data: any) => {
      if (data) {
        if (Number(data.user_id) === this.state.user?.id) {
          this.updateNameAndImgPath(data.name, data.imgPath);
        } else {
          this.updateOneRelationshipNameAndImgPath(
            Number(data.user_id),
            data.name,
            data.imgPath
          );
        }
      }
    });

    socket.on(Events.Client.UpdateUserRole, (data: any) => {

      // console.log('UpdateUserRole', data)
      if (data && Number(data.user_id) === Number(this.state.user?.id)) {
        this.updateRole(data.role);
      }
    });

    socket.on(Events.Client.UpdateChannelRelation, (data: any) => {
      // console.log('UpdateChannelRelation', data)
      if (data) {
        this.updateChannelRelationship(
          Number(data.channel_id),
          Number(data.user_id),
          data.type
        );
      }
    });

    socket.on(Events.Client.JoinChannel, (data: any) => {
      if (data) {
        this.updateChannelRelationship(
          Number(data.channel_id),
          Number(data.user_id),
          data.type
        );
      }
    });

    socket.on(Events.Client.LeaveChannel, (data: any) => {
      if (data) {
        const newRelType = data.type ? data.type : ChannelRelationshipType.Null;
        this.updateChannelRelationship(
          Number(data.channel_id),
          Number(data.user_id),
          newRelType
        );
      }
    });

    socket.on(Events.Client.UpdateUserStatus, (data: any) => {
      this.updateOneRelationshipStatus(data.user_id, data.status, data.roomId);
    });

    socket.on(Events.Client.UserMessage, (message: Message) => {
      if (
        message.type === MessageType.GameInvite ||
        message.type === MessageType.GameCancel
      ) {
        if (message.type === MessageType.GameInvite) {

          // console.log(`Received invitation to ${message.data} from ${message.sender_id}`);
        }
        if (message.type === MessageType.GameCancel) {
          // console.log(`Received cancel to ${message.data} from ${message.sender_id}`);
        }
        this.updateOneRelationshipGameInvite(message);
      }
    });

    // console.log("Registered event-socket callbacks!");
  };

  onMatchSocketConnection = (socket: Socket) => {
    // TODO: Register event callbacks here
    // console.log("TODO: Game socket connected!");
  };

  setUserInit = (user?: IUser) => {
    if (user !== this.state.user) {
      // if the user is undefined, he is not logged
      const logged = user !== undefined;

      let newEventSocket;
      let newMatchSocket;
      if (logged) {
        newEventSocket = getSocket("/events", this.onEventSocketConnection);
        newMatchSocket = getSocket("/matches", this.onMatchSocketConnection);
      } else {
        newEventSocket = undefined;
        newMatchSocket = undefined;
        this.state.eventSocket?.close();
        this.state.matchSocket?.close();
      }

      // update state
      this.setState(
        {
          user: user,
          eventSocket: newEventSocket,
          matchSocket: newMatchSocket,
        },
        this.updateAllRelationships
      );

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
  setUser = (user?: IUser) => {
    if (user !== this.state.user) {
      // if the user is undefined, he is not logged
      const logged = user !== undefined;
      let socket = this.state.eventSocket;
      if (!logged) {
        socket = undefined;
        this.state.eventSocket?.close();
      }

      // update state
      this.setState({
        user: user,
        eventSocket: socket,
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
      const res = await axios.get<IUser>(`/api/users/me`, {
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
            const res = await axios.get<IUser>(`/api/users/me`, {
              withCredentials: true,
            });
            this.setUserInit(res.data);
          } catch (error) { }
        } else {
          // console.log("TODO: GetLoggedProfile: Handle status:", e.message);
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

  componentWillUnmount() {
    // console.log("App will unmount, closing socket...");
    this.state.eventSocket?.close();
    this.setState({ ...this.state, eventSocket: undefined });
  }

  async sortRelationshipsList() {
    let a = this.state.relationshipsList.slice();
    a.sort((user1: AppUserRelationship, user2: AppUserRelationship) =>
      user1.user.name.localeCompare(user2.user.name)
    );
    this.setState({ relationshipsList: a });
  }

  updateAllRelationships = async () => {
    if (!this.state.user) return;
    try {
      const dataRel = await axios.get(
        `/api/users/relationships/${this.state.user.id}`
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

            const dataInvite = await axios.get(
              `/api/users/${this.state.user?.id}/${friendId}/gameInvite`
            );
            // console.log("dataInvite", dataInvite);
            a.push({
              user: dataUser.data,
              relationshipType: relation.type,
              gameInvite: dataInvite.data,
            });
            this.setState({ relationshipsList: a });
          } catch (error) { }
        });
      }
    } catch (error) { }
  };

  updateOneRelationshipType = async (
    user_id: number,
    newType: UserRelationshipType
  ) => {
    // console.log('updateOneRelationshipType', user_id, newType, this.state.relationshipsList)

    let a = this.state.relationshipsList.slice();
    let index = a.findIndex((relation: AppUserRelationship) => {
      return Number(relation.user.id) === Number(user_id);
    });
    if (index !== -1) {
      if (Number(newType) !== Number(UserRelationshipType.null)) {
        a[index].relationshipType = newType;
      } else {
        a.splice(index, 1);
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
        // TODO: It seems like this should be clearing the rest of the state?
        // Normally I use object destruction {...this.state} to keep previous state
      } catch (e) {
        console.log(e);
      }
    }
  };

  updateOneRelationshipStatus = async (
    user_id: number,
    newStatus: UserStatus,
    roomId?: number
  ) => {
    let a = this.state.relationshipsList.slice();
    let index = a.findIndex((relation: AppUserRelationship) => {
      return Number(relation.user.id) === Number(user_id);
    });
    if (index !== -1 && this.state.user) {
      if (a[index].relationshipType & UserRelationshipType.block_both) {
        newStatus = UserStatus.Offline;
      }
      if (Number(newStatus) !== Number(UserStatus.Null)) {
        a[index].user.status = newStatus;
        a[index].user.roomId = roomId;
        this.setState({ relationshipsList: a });
      }
    }
  };

  updateOneRelationshipGameInvite = async (message: Message) => {
    const friendId =
      message.sender_id === this.state.user?.id
        ? message.receiver_id
        : message.sender_id;
    let a = this.state.relationshipsList.slice();
    let index = a.findIndex((relation: AppUserRelationship) => {
      return Number(relation.user.id) === friendId;
    });
    if (index !== -1 && this.state.user) {
      if (message.type === MessageType.GameInvite) {
        a[index].gameInvite = message;
      } else if (message.type === MessageType.GameCancel) {
        a[index].gameInvite = undefined;
      }
      this.setState({ relationshipsList: a });
    }
  };

  updateOneRelationshipNameAndImgPath = async (
    user_id: number,
    newName: string,
    newImgPath: string
  ) => {
    let a = this.state.relationshipsList.slice();
    let index = a.findIndex((relation: AppUserRelationship) => {
      return Number(relation.user.id) === Number(user_id);
    });
    if (index !== -1 && this.state.user) {
      if (newName) {
        a[index].user.name = newName;
      }
      if (newImgPath) {
        a[index].user.imgPath = newImgPath;
      }
      this.setState({ relationshipsList: a });
    }
  };

  updateNameAndImgPath = async (newName: string, newImgPath: string) => {
    let newUser = this.state.user;
    if (newUser) {
      if (newName) {
        newUser.name = newName;
      }
      if (newImgPath) {
        newUser.imgPath = newImgPath;
      }
      this.setState({ user: newUser });
    }
  };

  updateRole = async (newRole: UserRole) => {
    let newUser = this.state.user;
    if (newUser) {
      newUser.role = newRole;
      this.setState({ user: newUser });
    }
  };

  updateChannelRelationship = async (
    channel_id: number,
    user_id: number,
    newType: ChannelRelationshipType = ChannelRelationshipType.Null
  ) => {
    // console.log('updateChannelRelationship')
    if (this.state.user) {
      let a = this.state.user.channels.slice();
      let index = a.findIndex((channel: any) => {
        return Number(channel.channel.id) === channel_id;
      });
      if (index !== -1) {
        if (user_id === this.state.user.id || user_id === -1) {
          if (Number(newType) !== Number(ChannelRelationshipType.Null)) {
            a[index].type = newType;
          } else {
            a.splice(index, 1);
          }
        } else {
          const userIndex = a[index].channel.users.findIndex((elem) => {
            return elem.user.id === user_id;
          });
          if (userIndex !== -1) {
            if (newType === ChannelRelationshipType.Null) {
              a[index].channel.users.splice(userIndex, 1);
            } else {
              a[index].channel.users[userIndex].type = newType;
            }
          } else {
            const dataUser = await axios.get("/api/users/" + user_id);
            a[index].channel.users.push({
              type: newType,
              user: {
                id: dataUser.data.id,
                name: dataUser.data.name,
                imgPath: dataUser.data.imgPath,
              },
            });
          }
        }
        // console.log(a)
        const newUser = {
          ...this.state.user,
          channels: a,
        };
        this.setState({ user: newUser });
      } else if (newType !== ChannelRelationshipType.Null) {
        try {
          const dataChannel = await axios.get("/api/channels/" + channel_id);
          a.push({
            channel: dataChannel.data,
            type: newType,
          });
          a.sort(
            (
              channel1: UserChannelRelationship,
              channel2: UserChannelRelationship
            ) => channel1.channel.name.localeCompare(channel2.channel.name)
          );
          const newUser = {
            ...this.state.user,
            channels: a,
          };
          this.setState({ user: newUser });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  displayAdminRoute(isAdmin: boolean) {
    if (isAdmin) {
      return (
        <Route path="/admin">
          <Admin />
        </Route>
      );
    }
  }

  render() {
    let contextValue: IAppContext = {
      ...this.state,
      setUser: this.setUser,
      setUserInit: this.setUserInit,
      updateOneRelationshipType: this.updateOneRelationshipType,
      updateOneRelationshipGameInvite: this.updateOneRelationshipGameInvite,
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
                <div className="flex h-full border-t-2 border-primary-dark border-opacity-70">
                  <div className="md:block border-opacity-70">
                    <SideMenu logged={this.state.user !== undefined} />
                  </div>
                  <div className="z-30 flex w-full h-screen bg-gray-200 flex-nowrap">
                    <main className="flex-grow">
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
                          <User
                            relationshipsList={this.state.relationshipsList}
                          />
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
                          path="/login/2fa/:redirPath?"
                          component={TwoFactorAuth}
                        ></OnlyPublic>
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
                    <FriendsBar
                      logged={this.state.user !== undefined}
                      relationshipsList={this.state.relationshipsList}
                    />
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
