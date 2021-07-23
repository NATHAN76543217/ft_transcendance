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
import { IUser, UserRole } from "./models/user/IUser";
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
    this.updateAllRelationships = this.updateAllRelationships.bind(this);
  }

  // We do not need to bind when using the equal form
  setUser = (user?: AuthenticatedUser) => {
    if (user !== this.state.user) {
      // if the user is undefined, he is not logged
      const logged = user !== undefined;

      if (logged) {
        this.setState({ socket: this.getSocket() });
      } else {
        this.state.socket?.close();
        this.setState({ socket: undefined });
      }

      // update state
      this.setState({ user });

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

      this.setUser(res.data);
    } catch (e) {
      this.setUser();
      // TODO: Handle refresh token if status 401 (Unauthorized)
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          try {
            await axios.get("/api/authentication/refresh");
            const res = await axios.get<AuthenticatedUser>(`/api/users/me`, {
              withCredentials: true,
            });
            this.setUser(res.data);
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
    this.getCachedUser();
    this.getCurrentUser();
    this.updateAllRelationships();
  }

  async sortRelationshipsList() {
    let a = this.state.relationshipsList.slice();
    a.sort((user1: AppUserRelationship, user2: AppUserRelationship) =>
      user1.user.name.localeCompare(user2.user.name)
    );
    this.setState({ relationshipsList: a });
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    if (prevState.user?.toString() !== this.state.user?.toString()) {
      this.updateAllRelationships();
    } else if (
      prevState.relationshipsList.toString() !==
      this.state.relationshipsList.toString()
    ) {
      this.sortRelationshipsList();
    }
    if (this.state.user !== undefined && this.state.socket === undefined) {
      const newSocket = this.getSocket();
      this.setState({
        ...this.state,
        socket: newSocket,
      });
    }
    console.log("state", this.state);
  }

  async updateAllRelationships() {
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
            console.log("dataUser");
            console.log(dataUser);
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

  updateOneRelationship = async (user_id: number, newType: UserRelationshipType) => {
    console.log('updateOneRelationship - begin')
      let a = this.state.relationshipsList.slice();
      let index = a.findIndex((relation: AppUserRelationship) => {
        return Number(relation.user.id) === Number(user_id)
      })
      console.log('index = ', index)
      if (index !== -1) {
        if (newType !== UserRelationshipType.null) {
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
          this.setState({ relationshipsList: a });
        } catch (e) {
          console.log(e)
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

    return io("", {
      path: "/api/socket.io/events",
      rejectUnauthorized: false, // This disables certificate authority verification
      withCredentials: true,
    }).on("authenticated", () => {
      console.log("Socket connection authenticated!");
    });
  };

  render() {
    let contextValue: IAppContext = {
      relationshipsList: this.state.relationshipsList,
      user: this.state.user,
      setUser: this.setUser,
      updateAllRelationships: this.updateAllRelationships,
      updateOneRelationship: this.updateOneRelationship,
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
                          <User relationshipsList={this.state.relationshipsList}/>
                        </PrivateRoute>
                        <Route path="/chat/:id?" component={ChatPage} />
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
