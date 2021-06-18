import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SideMenu() {
		const location = useLocation();

		return (
			<nav className="flex flex-col w-16 h-full bg-gray-500 duration-800 transition-width delay-0 hover:w-64 group lg:w-28">
				<ul>
					<li>
						<Link to='/'>
							<img
								className="object-cover object-center w-full"
								src={process.env.PUBLIC_URL + 'logo-menu.jpeg'}
								alt='logo-menu'/>
						</Link>
					</li>
					<li className={ "h-12 relative flex uppercase font-semibold text-center" + (location.pathname === '/' ? ' bg-gray-600' : "" )}>
						<i className="z-0 m-auto fas fa-home fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto fas fa-home fa-lg group-hover:block"></i>
						<Link 
							to="/"
							className="absolute content-center w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Home
						</Link>
					</li>
					<li className={ "h-12 flex uppercase relative font-semibold text-center" + (location.pathname === '/game' ? ' bg-gray-600' : "" )}>
						<i className="z-0 m-auto fas fa-dice-d6 fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto fas fa-dice-d6 fa-lg group-hover:block"></i>
						<Link 
							to="/game"
							className="absolute content-center w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Game
						</Link>
					</li>
					<li className={ "h-12 flex uppercase relative font-semibold text-center" + (location.pathname === '/profile' ? ' bg-gray-600' : "" )}>
						<i className="z-0 m-auto far fa-address-card fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto far fa-address-card fa-lg group-hover:block"></i>
						<Link 
							to="/profile"
							className="absolute content-center w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Profile
						</Link>
					</li>
				</ul>
			</nav>
		)
	}
export default SideMenu;