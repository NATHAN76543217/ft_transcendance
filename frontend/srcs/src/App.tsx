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
import Game from './pages/game/game';
import User from './pages/users/user';
import Admin from './pages/admin/admin';
import Login from './pages/login/login';
import Register from './pages/register/register';
import ChatPage from './pages/chat/chat';
import React from 'react';
import IUserInterface from './components/interface/IUserInterface';
import axios from 'axios';
import IUserRelationship from './components/interface/IUserRelationshipInterface';

import { AppStates } from './AppStates'
import { IAppContext } from './IAppContext';
import AppContext from './AppContext';
import { UserRoleTypes } from './components/users/userRoleTypes';

let change_bg_color_with_size = "bg-gray-500 sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-purple-500";	// for testing

interface AppProps {
}


class App extends React.Component<AppProps, AppStates> {

	constructor(props: AppProps) {
		super(props)
		this.state = {
			relationshipsList: [],
			myId: "1",				// A remplacer par le vrai id
			myRole: UserRoleTypes.owner	// A remplacer par le vrai role
		}
		this.updateAllRelationships = this.updateAllRelationships.bind(this)
	}

	componentDidMount() {
		this.updateAllRelationships()
	}

	async sortRelationshipsList() {
		let a = this.state.relationshipsList.slice();
		a.sort((user1: IUserInterface, user2: IUserInterface) => user1.name.localeCompare(user2.name));
		this.setState({relationshipsList: a});
	}

	componentDidUpdate(prevProps: AppProps, prevState: AppStates) {
		if (prevState.relationshipsList.toString() !== this.state.relationshipsList.toString()) {
			this.sortRelationshipsList();
		}
		// console.log("component did update")
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
						const dataUser = await axios.get("/api/users/" + friendId);
						index = a.push(dataUser.data);
						a[index - 1].relationshipType = relation.type;
						this.setState({ relationshipsList: a });
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

		let contextValue: IAppContext = {
			relationshipsList: this.state.relationshipsList,
			myId: this.state.myId,
			myRole: this.state.myRole,
			updateAllRelationships: this.updateAllRelationships
		}

		return (
			<AppContext.Provider
				value={contextValue}
			>

				<div className="h-full">
					<Router>
						<Switch>
							<Route path='/health'>
								<h3>App is healthy!</h3>
							</Route>
							<Route>
								<Header />
								<div className="flex h-full border-t-2 border-gray-700 border-opacity-70">
									<div className="flex-none border-r-2 border-gray-700 md:block border-opacity-70">
										<SideMenu />
									</div>
									<div className="z-30 flex w-full flex-nowrap">
										<main className={"flex-grow " + change_bg_color_with_size}>
											<Switch>
												<Route exact path='/'>
													<Home />
												</Route>
												<Route path='/game'>
													<Game />
												</Route>
												<Route path="/users">
													<User
														myId={this.state.myId}
													/>
												</Route>
												<Route path="/chat/:id?" component={ChatPage} />

												{/* <Route exact path="/chat/:id" render={(props) => <ChatPage
												myId={this.state.myId}
												{...props} />
											} /> */}
												<Route path='/login'>
													<Login />
												</Route>
												<Route path='/register'>
													<Register />
												</Route>
												{this.displayAdminRoute(true)}
												{/* {displayAdminRoute(false)} */}
												{/* A CHANGER AVEC LE VRAI ADMIN STATUS */}
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
