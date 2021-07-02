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
import Login from './pages/login/login';
import Register  from './pages/register/register';
import React from 'react';
import OnlyPublic from "./routes/onlyPublic";
import PrivateRoute from "./routes/privateRoute";
import Cookies from 'js-cookie';
import Jwt from 'jwt-decode';
import axios from 'axios';

let change_bg_color_with_size = "sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-purple-500";	// for testing

type appState = {
	user: any,
	logged: boolean,
};

function LoadData ()
{
	return (
		<div>LoadData</div>
	)
}
class App extends React.Component< {}, appState> {

	constructor (props : any )
	{
		super(props);
		this.state = {
			user: undefined,
			logged: false
		}
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
			// <Redirect to="/"/>
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

	render ()
	{
		this.getOldState();
		return (
			<div className="h-full">
				<Router>
					<Header logged={ this.state.logged } user={this.state.user} setUser={this.setUser} />
					<div className="flex h-full">
						<div className="flex-none">
							<SideMenu/>
						</div>
						<div className="flex w-full flex-nowrap">
							<main className={"flex-grow " + change_bg_color_with_size}>
								<Switch>
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
									<PrivateRoute isAuth={ this.state.logged } path='/game'>
										<Game/>
									</PrivateRoute>
									<PrivateRoute isAuth={ this.state.logged } exact path="/users">
										<User/>
									</PrivateRoute>
									<Route exact path='/' component={Home}>
										<Home/>
									</Route>

								</Switch>
							</main>
							<div className="flex-none hidden md:block">
								<FriendsBar/>
							</div>
						</div>
					</div>
					<Footer/>
				</Router>
			</div>
		);
	}
}

export default App;
