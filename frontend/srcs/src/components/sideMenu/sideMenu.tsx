import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SideMenu() {
		const location = useLocation();

		return (
			<nav className="inline-flex flex-col h-full bg-gray-500 w-60">
				<ul>
					<li>
						<Link to='/'>
							<img
								className="object-cover object-center w-full"
								src={process.env.PUBLIC_URL + 'logo-menu.jpeg'}
								alt='logo-menu'/>
						</Link>
					</li>
					<li className={ "h-12  flex uppercase font-semibold" + (location.pathname === '/' ? ' bg-gray-600' : "" )}>
						<Link 
							to="/"
							className="m-auto my-auto" >Home</Link>
					</li>
					<li className={ "h-12 flex uppercase font-semibold" + (location.pathname === '/game' ? ' bg-gray-600' : "" )}>
						<Link 
							to="/game"
							className="m-auto my-auto" >Game</Link>
					</li>
					<li className={ "h-12 flex uppercase font-semibold" + (location.pathname === '/profile' ? ' bg-gray-600' : "" )}>
						<Link 
							to="/profile"
							className="m-auto my-auto" >Profile</Link>
					</li>
				</ul>
			</nav>
		)
	}
export default SideMenu;