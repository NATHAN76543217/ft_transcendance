import React from 'react';
import Button from '../utilities/Button';

class Header extends React.Component {

    render(){
        return (
        <header className="relative z-30 flex flex-row justify-between w-full h-20 flex-nowrap bg-primary">
            <span className="block px-4 py-2 text-4xl font-bold">ft_pong</span>
            <Button content="Login" url="/login" primary/>
        </header>);
    }
}

export default Header;