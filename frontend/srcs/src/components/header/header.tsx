import React from 'react';
import Button from '../utilities/Button';
import propTypes, { InferProps } from "prop-types";

const headerPropType = { 
	logged: propTypes.bool.isRequired,
	user: propTypes.any
}

function Header( { logged, user }: InferProps<typeof headerPropType> ) {
		//TODO replace logout button redirection by a query to /apip/authentication/api
		return (
			<header className="relative z-30 flex flex-row justify-between w-full bg-primary ">
				<span className="block px-4 py-2 text-4xl font-bold">
					ft_pong
				</span>
				<span>
					{ user && user.name }
				</span>
				{ logged ? 
					<div className='m-4'>
						<Button
							content='Logout'
							primary
							url='/logout'
							className="w-24 text-center"/>
					</div>
					: 
					<div className='m-4'>
						<Button
							content='Login'
							primary
							url='/login'
							className="w-24 text-center"/>
						<Button
							content='Register'
							primary
							url='/register'
							className="w-24 text-center"
							/>
					</div>	
				}
			</header>
		);
	}



export default Header;