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

function App() {
  return (
	<div className="h-full ">
		<Router>
			<Header/>
			<SideMenu/>
			<FriendsBar/>
			<main>
				<Switch>
					<Route path='/'>
						<Home/>
						<div>coucou</div>
					</Route>
					<Route path='/game'>

					</Route>
					<Route path="/profile">

					</Route>
				</Switch>
			</main>
			<Footer/>
		</Router>

	</div>
  );
}

export default App;
