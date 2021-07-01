import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SideMenu() {
		const location = useLocation();

		return (
			<nav className="flex flex-col w-16 h-full bg-neutral duration-800 transition-width delay-0 hover:w-64 group lg:w-28 xl:w-32">
				<ul className="w-full">
					<li className="h-40 xl:h-52 2xl:h-60">
						<Link to='/'>
							<header className="table-cell w-16 h-40 text-center text-white align-middle bg-black lg:w-28 xl:w-32 group-hover:hidden xl:h-52 2xl:h-60" >
								<span className="items-center justify-center inline-block h-10 font-bold transform -rotate-90 w-min text-md md:text-md lg:text-2xl 2xl:text-3xl ">
									ft_pong
								</span>
							</header>
							<img
								src={process.env.PUBLIC_URL + 'logo-menu.jpeg'}
								alt='logo-menu'
								className="hidden object-cover object-center w-full h-full group-hover:block "/>
						</Link>
					</li>
					<li className={ "h-12 relative flex uppercase font-semibold text-center" + (location.pathname === '/' ? ' bg-neutral-dark' : "" )}>
						<i className="z-0 m-auto fas fa-home fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto fas fa-home fa-lg group-hover:block"></i>
						<Link 
							to="/"
							className="absolute w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Home
						</Link>
					</li>
					<li className={ "h-12 flex uppercase relative font-semibold text-center" + (location.pathname === '/game' ? ' bg-neutral-dark' : "" )}>
						<i className="z-0 m-auto fas fa-dice-d6 fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto fas fa-dice-d6 fa-lg group-hover:block"></i>
						<Link 
							to="/game"
							className="absolute w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Game
						</Link>
					</li>
					<li className={ "h-12 flex uppercase relative font-semibold text-center" + (location.pathname === '/users/find' ? ' bg-neutral-dark' : "" )}>
						<i className="z-0 m-auto fas fa-users fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto fas fa-users fa-lg group-hover:block"></i>
						<Link 
							to="/users/find"
							className="absolute w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Users
						</Link>
					</li>
					<li className={ "h-12 flex uppercase relative font-semibold text-center" + (location.pathname === '/users' ? ' bg-neutral-dark' : "" )}>
						<i className="z-0 m-auto far fa-address-card fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto far fa-address-card fa-lg group-hover:block"></i>
						<Link 
							to="/users"
							className="absolute w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Profile
						</Link>
					</li>
					<li className={ "h-12 flex uppercase relative font-semibold text-center" + (location.pathname === '/admin' ? ' bg-neutral-dark' : "" )}>
						<i className="z-0 m-auto fas fa-shield-alt fa-2x group-hover:hidden"></i>
						<i className="hidden pl-4 m-auto fas fa-shield-alt fa-lg group-hover:block"></i>
						<Link 
							to="/admin"
							className="absolute w-full h-full pt-3 m-auto opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">
								Admin
						</Link>
					</li>
				</ul>
			</nav>
		)
	}
export default SideMenu;