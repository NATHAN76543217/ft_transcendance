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
import Login  from './pages/login/login';
import Register from './pages/register/register';
import ChatPage from './pages/chat/chat';

let change_bg_color_with_size = "bg-gray-500 sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-purple-500";	// for testing

function displayAdminRoute(isAdmin: boolean) {
	if (isAdmin) {
		return (
			<Route path='/admin'>
				<Admin />
			</Route>
		)};
}

function App() {
	return (
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
							<div className="flex w-full flex-nowrap">
								<main className={"flex-grow " + change_bg_color_with_size}>
									<Switch>
										<Route exact path='/'>
											<Home />
										</Route>
										<Route path='/game'>
											<Game />
										</Route>
										<Route path="/users">
											<User />
										</Route>
										<Route path="/chat/:id?" component={ChatPage}/>
										<Route path='/login'>
											<Login />
										</Route>
										<Route path='/register'>
											<Register />
										</Route>
										{displayAdminRoute(true)}			
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
	);
}

export default App;
