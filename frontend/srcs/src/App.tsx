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
import Profile from './pages/profile/profile';

function App() {
  return (
	<div className="h-full">
		<Router>
			<Header/>
			<div className="flex h-full flex-nowrap">
				<SideMenu/>
				<div className="grid w-full grid-cols-4 xl:grid-cols-5">
					<main className="col-span-3 xl:col-span-4">
						<Switch>
							<Route path='/game'>
								<Game/>
							</Route>
							<Route path="/profile">
								<Profile/>
							</Route>
							<Route path='/'>
								<Home/>
							</Route>
						</Switch>
					</main>
					<FriendsBar/>
				</div>
			</div>
			<Footer/>
		</Router>

	</div>
  );
}

export default App;
