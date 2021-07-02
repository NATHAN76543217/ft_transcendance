import { Link, NavLink, useLocation } from 'react-router-dom';

function DisplayAdminMenu(isAdmin: boolean) {
	if (isAdmin) {
		return (
			<SideMenuButton name="Admin" href="/admin" icon="fa-shield-alt" />
		)
	};
}

type SideMenuButtonProps = {
	name: string;
	href: string;
	icon: string;
	iconStyle: string;
}

function SideMenuButton({ name, href, icon, iconStyle }: SideMenuButtonProps) {
	// <i className={`hidden pl-4 m-auto fa-lg ${iconStyle} ${icon} group-hover:block`}></i>
	return (
		<li className={"h-12"}>
			<NavLink
				to={href}
				exact={true}
				className="relative flex items-center justify-center h-full text-center hover:bg-gray-300"
				activeClassName="bg-neutral-dark">
				<i className={`z-0 fa-2x ${iconStyle} ${icon} group-hover:hidden`}></i>
				<i className={`hidden w-16 fa-lg ${iconStyle} ${icon} group-hover:inline-block`}></i>
				<div className="absolute w-full font-semibold uppercase opacity-0 group-hover:relative group-hover:block group-hover:opacity-100">{name}</div>
			</NavLink>
		</li>
	)
}

SideMenuButton.defaultProps = {
	iconStyle: "fas",
}

function SideMenu() {
	return (
		<nav className="flex flex-col w-16 h-full bg-neutral duration-800 transition-width delay-0 hover:w-64 group lg:w-28 xl:w-32">
			<ul className="w-full ">
				<li className="h-40 bg-black xl:h-52 2xl:h-60">
					<Link to='/'>
						<header className="table-cell w-16 h-40 text-center text-white align-middle bg-transparent lg:w-28 xl:w-32 group-hover:hidden xl:h-52 2xl:h-60" >
							<span className="items-center justify-center inline-block h-10 font-bold transform -rotate-90 bg-transparent w-min text-md md:text-md lg:text-2xl 2xl:text-3xl ">
								ft_pong
							</span>
						</header>
						<img
							src='/logo-menu.jpeg'
							alt='logo-menu'
							className="hidden object-cover object-center w-full h-full group-hover:block " />
					</Link>
				</li>
				<SideMenuButton name="Home" href="/" icon="fa-home" />
				<SideMenuButton name="Game" href="/game" icon="fa-dice-d6" />
				<SideMenuButton name="Users" href="/users/find" icon="fa-users" />
				<SideMenuButton name="Profile" href="/users" icon="fa-address-card" />
				<SideMenuButton name="Chats" href="/chat" icon="fa-comment-dots" />
				{DisplayAdminMenu(true)}
				{/* {DisplayAdminMenu(false)} */}		
						{/* A CHANGER AVEC LE VRAI ADMIN STATUS */}
			</ul>
		</nav>
	)
}
export default SideMenu;