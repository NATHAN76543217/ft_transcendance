import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import FriendsBar from './components/friendsBar/friendsBar';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import SideMenu from './components/sideMenu/sideMenu';
import Home from './pages/home/home';
import Game from '.x/pages/game/game';
import User from './pages/users/user';
import Admin from './pages/admin/admin';
import Login from './pages/login/login';
import Register from './pages/register/register';
import ChatPage from './pages/chat/chat';
import React from 'react';
// import * as React from 'react'
import IUserInterface from './components/interface/IUserInterface';
import axios from 'axios';
import IUserRelationship from './components/interface/IUserRelationshipInterface';
import OnlyPublic from "./routes/onlyPublic";
import PrivateRoute from "./routes/privateRoute";
import Cookies from 'js-cookie';
import Jwt from 'jwt-decode';
let change_bg_color_with_size = "bg-gray-500 sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-purple-500";	// for testing

interface AppProps {

}

interface AppStates {
	relationshipsList: IUserInterface[],
	myId: string,
	user: any,
	logged: boolean,
}

// export const FriendsContext = React.createContext<IUserInterface[]>([]);

// function countReducer(state, action) {
// 	switch (action.type) {
// 		case 'increment': {
// 			return { count: state.count + 1 }
// 		}
// 		case 'decrement': {
// 			return { count: state.count - 1 }
// 		}
// 		default: {
// 			throw new Error(`Unhandled action type: ${action.type}`)
// 		}
// 	}
// }

// const FriendProvider({ children }) {
// 	const [state, dispatch] = React.useReducer(countReducer, { list: [] })
// 	// NOTE: you *might* need to memoize this value
// 	// Learn more in http://kcd.im/optimize-context
// 	const value = { state, dispatch }
// 	return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
// }

// export const MovieProvider = props => {
//     const [movies, setMovies] = useState<IMovie[]>([
//         {
//             original_title: 'name of movie',
//             poster_path: 'path_to_poster',
//             id: 1,
//         },
//     ]);
//     return <MovieContext.Provider value={[movies, setMovies]}>{props.children}</MovieContext.Provider>;
// };


class App extends React.Component<AppProps, AppStates> {

	constructor(props: AppProps) {
		super(props)
		this.state = {
			relationshipsList: [],
			myId: "1",				// A remplacer par le vrai id // a supprimer: id in user
			user: undefined,
			logged: false
		}
		this.updateAllRelationships = this.updateAllRelationships.bind(this)
		this.setUser = this.setUser.bind(this);
	}

	setUser(user: {})
	{
		let logged = false;
		if (user)
			logged = true;
		console.log('set state:', logged, user)
		this.setState({
			user: user,
			logged: logged,
		})
	}

	GetLoggedProfile = () : JSX.Element =>
	{
		const jwt = Cookies.get("Authentication");
		const userid = Jwt(jwt).userId; // decode your token here
		console.log('userid=', userid);
		axios.get("/api/users/" + userid).then((res) => {
			const user = res.data;
			console.log("user = ", user);
			if (this.state.logged === false)
			{
				this.setUser(user);
				localStorage.setItem("user", JSON.stringify(user))
			}
			window.location.href ='/';
		});
		return (
			<p>You will be redirect soon</p>
		)
	}

	getOldState()
	{
		if (this.state.user == null)
		{
			const user = localStorage.getItem('user');
			if (user === null)
				return false;
			else
				this.setUser(JSON.parse(user));
		}
		return true;
	}

	componentDidMount() {
		this.updateAllRelationships()
	}

	componentDidUpdate() {
		console.log(this.state.relationshipsList);
	}

	async updateAllRelationships() {
		try {
			const dataRel = await axios.get("/api/users/relationships/" + this.state.myId)
			let a: IUserInterface[] = [];
			if (!dataRel.data.length) {
				this.setState({ relationshipsList: a });
			} else {
				await dataRel.data.map(async (relation: IUserRelationship) => {
					let inf = (Number(relation.user1_id) === Number(this.state.myId));
					let friendId = inf ? relation.user2_id : relation.user1_id;
					try {
						let index;
						// index = a.findIndex((elem) => (Number(elem.id) === Number(friendId)));
						// if (index === -1) {
							const dataUser = await axios.get("/api/users/" + friendId);	// many api calls
							index = a.push(dataUser.data);
							a[index - 1].relationshipType = relation.type;
							this.setState({ relationshipsList: a });
						// } else {
							// a[index].relationshipType = relation.type;
							// this.setState({ relationshipsList: a });
						// }
					} catch (error) { }
				})
			}
		} catch (error) { }

	}

	displayAdminRoute(isAdmin: boolean) {
		if (isAdmin) {
			return (
				<Route path='/admin'>
					<Admin />
				</Route>
			)
		};
	}

	render() {
		this.getOldState();
		return (
			<div className="h-full">
				<Router>
					<Switch>
						<Route path='/health'>
							<h3>App is healthy!</h3>
						</Route>
						<Route>
							<Header logged={ this.state.logged } user={this.state.user} setUser={this.setUser} />
							<div className="flex h-full border-t-2 border-gray-700 border-opacity-70">
								<div className="flex-none border-r-2 border-gray-700 md:block border-opacity-70">
									<SideMenu logged={ this.state.logged } />
								</div>
								<div className="z-30 flex w-full flex-nowrap">
									<main className={"flex-grow " + change_bg_color_with_size}>
										<Switch>
											
											<Route exact path='/'>
												<Home />
											</Route>
											<PrivateRoute isAuth={ this.state.logged } path='/game'>
												<Game/>
											</PrivateRoute>
											<PrivateRoute isAuth={ this.state.logged } exact path="/users">
												<User
													updateAllRelationships={this.updateAllRelationships}
													myId={this.state.myId}
												/>
											</PrivateRoute>
											<Route path="/chat/:id?" component={ChatPage} />
											<Route exact path='/login/success'>
												<this.GetLoggedProfile />
											</Route>
											<OnlyPublic isAuth={ this.state.logged } path='/login'>
												<Login/>
												{/* <Login setUser={ this.setUser }/> */}
											</OnlyPublic>
											<OnlyPublic isAuth={ this.state.logged } path='/register'>
												<Register/>
											</OnlyPublic>
											{/* <Route exact path="/chat/:id" render={(props) => <ChatPage
												myId={this.state.myId}
												{...props} />
											} /> */}
											{this.displayAdminRoute(true)}
											{/* {displayAdminRoute(false)} */}
											{/* A CHANGER AVEC LE VRAI ADMIN STATUS */}
										</Switch>
									</main>
									<div className="flex-none hidden md:block">
										<FriendsBar
											relationshipsList={this.state.relationshipsList}
											myId={this.state.myId}
										/>
									</div>
								</div>
							</div>
							<Footer />
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
