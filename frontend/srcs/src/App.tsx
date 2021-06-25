import React from 'react';
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
import { Login } from './pages/login/login';

let change_bg_color_with_size = "sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-purple-500";	// for testing

function App() {
  return (
	<div className="h-full">
		<Router>
			<Header/>
			<div className="flex h-full">
				<div className="flex-none">
					<SideMenu/>
				</div>
				<div className="flex w-full flex-nowrap">
					<main className={"flex-grow " + change_bg_color_with_size}>
						<Switch>
							<Route path='/game'>
								<Game/>
							</Route>
							<Route path="/users">
								<User />
							</Route>
							<Route path='/login'>
								<Login/>
							</Route>
							<Route exact path='/'>
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

export default App;
