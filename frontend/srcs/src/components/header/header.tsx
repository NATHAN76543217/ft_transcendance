import React from 'react';

class Header extends React.Component {

    render(){
        return (
        <header className="relative z-30 w-full bg-primary">
            <span className="block px-4 py-2 text-4xl font-bold">ft_pong</span>
        </header>);
    }
}

export default Header;