import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
import { IUser, UserRole, UserStatus } from "./models/user/IUser";
import axios from "axios";
import OnlyPublic from "./routes/onlyPublic";
import PrivateRoute from "./routes/privateRoute";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import { AppState } from "./AppState";
import { IAppContext } from "./IAppContext";
import AppContext from "./AppContext";
import { AuthenticatedUser } from "./models/user/AuthenticatedUser";
import UserRelationship from "./models/user/UserRelationship";
import { AppUserRelationship } from "./models/user/AppUserRelationship";

let change_bg_color_with_size =
  "bg-gray-500 sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-purple-500"; // for testing

interface AppProps { }

interface TokenPayload {
  userId: number;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    let userVar = localStorage.getItem("user")
    this.state = {
      relationshipsList: [],
      // user: undefined,
      user: userVar ? JSON.parse(userVar) : undefined,
      //myRole: UserRoleTypes.owner, // A remplacer par le vrai role
      //logged: false,
    };
    this.updateAllRelationships = this.updateAllRelationships.bind(this);
    //this.setUser = this.setUser.bind(this);
  }

  // We do not need to bind when using the equal form
  setUser = (user?: AuthenticatedUser) => {
    // if the user is undefined, he is not logged
    const logged = user !== undefined;

    console.debug(`setting user (logged = ${logged}): `, user);

    if (!logged) localStorage.removeItem("user");
    else localStorage.setItem("user", JSON.stringify(user));
    this.setState({ user });
  };

  // Get logged profile for OAuth users
  GetLoggedProfile = (): JSX.Element => {
    const jwt = Cookies.get("Authentication");
    if (!jwt) return <p>Cookies not found</p>;
    const userid = jwt_decode<TokenPayload>(jwt).userId;

    axios.get(`/api/users/${userid}`, { withCredentials: true }).then((res) => {
      const user: AuthenticatedUser = res.data;

      console.log("user = ", user);
      if (this.state.user === undefined) {
        // If the user is not logged
        this.setUser(user);
      }

      window.location.href = "/";
    });

    const dataUpdate = axios.patch(
      `/api/users/${userid}`,
      { status: UserStatus.online }
    );
    // console.log("data Update login: ",dataUpdate)

    return <p>You will be redirect soon</p>;
  };

  getOldState() {
    if (this.state.user == null) {
      const user = localStorage.getItem("user");
      if (user === null) return false;
      else this.setUser(JSON.parse(user));
    }
    return true;
  }

  componentDidMount() {
    this.getOldState();
    this.updateAllRelationships();
  }

  async sortRelationshipsList() {
    let a = this.state.relationshipsList.slice();

    console.log("a");
    console.log(a);

    a.sort((user1: AppUserRelationship, user2: AppUserRelationship) =>
      user1.user.name.localeCompare(user2.user.name)
    );
    this.setState({ relationshipsList: a });
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    if (prevState.user?.toString() !== this.state.user?.toString()) {
      this.updateAllRelationships()
    }
    else if (prevState.relationshipsList.toString() !== this.state.relationshipsList.toString()) {
      this.sortRelationshipsList();
    }
  }

  async updateAllRelationships() {
    try {
      const dataRel = await axios.get(
        "/api/users/relationships/" + this.state.user?.id
      );

      console.log("dataRel")
      console.log(dataRel)

      let a: AppUserRelationship[] = [];
      if (!dataRel.data.length) {
        this.setState({ relationshipsList: a });
      } else {
        await dataRel.data.map(async (relation: UserRelationship) => {
          let inf = (Number(relation.user1_id) === Number(this.state.user?.id));
          let friendId = inf ? relation.user2_id : relation.user1_id;
          try {
            let index;
            const dataUser = await axios.get("/api/users/" + friendId);
            console.log("dataUser")
            console.log(dataUser)
            index = a.push({
              user: dataUser.data,
              relationshipType: relation.type
            });
            // a[index - 1].relationshipType = relation.type;
            this.setState({ relationshipsList: a });
          } catch (error) { }
        });
      }
    } catch (error) { }
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

  render() {
    let contextValue: IAppContext = {
      relationshipsList: this.state.relationshipsList,
      user: this.state.user,
      setUser: this.setUser,
      updateAllRelationships: this.updateAllRelationships,
    };

    return (
      <AppContext.Provider value={contextValue}>
        <div className="h-full">
          <Router>
            <Switch>
              <Route path="/health">
                <h3>App is healthy!</h3>
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
                          <Home />
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
                          <User />
                        </PrivateRoute>
                        <Route path="/chat/:id?" component={ChatPage} />
                        <Route exact path="/login/success">
                          <this.GetLoggedProfile />
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
                          (this.state.user?.role === UserRole.admin ||
                            this.state.user?.role === UserRole.admin)
                        )}
                      </Switch>
                    </main>
                    <div className="flex-none hidden md:block">
                      <FriendsBar />
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
