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
import Login  from './pages/login/login';
import Register  from './pages/register/register';
import React from 'react';
import OnlyPublic from "./routes/onlyPublic";
import PrivateRoute from "./routes/privateRoute";

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
		this.setState({
			user: user,
			logged: logged,
		})
	}

	render ()
	{
		return (
			<div className="h-full">
				<Router>
					<Header logged={ true } user={this.state.user} />
					<div className="flex h-full">
						<div className="flex-none">
							<SideMenu/>
						</div>
						<div className="flex w-full flex-nowrap">
							<main className={"flex-grow " + change_bg_color_with_size}>
								<Switch>
									<OnlyPublic isAuth={ this.state.logged } path='/login' component={Login} setUser={this.setUser}/>
									<OnlyPublic isAuth={ this.state.logged } path='/register' component={Register} />
									<PrivateRoute isAuth={ this.state.logged } path='/game' component={Game} />
									<PrivateRoute isAuth={ this.state.logged } exact path="/users" component={User} />
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
