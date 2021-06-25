import React from 'react';
import Button from '../utilities/Button';

class Header extends React.Component {

	render(){
		return (
		<header className="relative z-30 flex flex-row justify-between w-full bg-primary ">
			<span className="block px-4 py-2 text-4xl font-bold">
				ft_pong
			</span>
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
		</header>);
	}
}

export default Header;