import Button from '../../components/utilities/Button'
function Home(props: { logged: boolean }) {
    if (props.logged) {
        return (
            <div>
                <section className="relative ">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full ">
                        <source src={process.env.PUBLIC_URL + 'hero-sea.mp4'} type='video/mp4' />
                    </video>
                    <nav className="absolute p-4 rounded-xl w-96 xl:w-2/3  3xl:w-1/3 top-[20%] xl:top-1/4 3xl:top-1/2 left-[20%]  bg-primary/60 max-w-2xl">
                        <h1 className="text-4xl " >Welcome to ft_pong</h1>
                        <p className="mt-2 mb-4 ml-4">
                            ft_pong is an amazing game that you can play with your friends.
                            <br />
                            There's no time to waste, let's play!
                    </p>
                        <div className="flex items-center justify-center space-x-16">
                            <Button content="Let's play !" url="/game/quickgame" primary />
                            <Button content="Custom Game" url="/game" />
                        </div>
                    </nav>
                </section>
            </div>
        );
    } else {
        return (
            <div>
                <section className="relative">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full ">
                        <source src={process.env.PUBLIC_URL + 'hero-sea.mp4'} type='video/mp4' />
                    </video>
                    <nav className="absolute p-4 rounded-xl w-96 xl:w-2/3  3xl:w-1/3 top-[20%] xl:top-1/4 3xl:top-1/2 left-[20%]  bg-primary/60 max-w-2xl">
                        <h1 className="text-4xl " >Welcome to ft_pong</h1>
                        <p className="mt-2 mb-4 ml-4">
                            ft_pong is an amazing game that you can play with your friends.
                            <br />
                            There's no time to waste, let's register and login to start the ft_pong experience!
                        </p>
                        <div className="flex items-center justify-center space-x-16">
                            <Button
                                content="Login"
                                primary
                                url="/login"
                                className="w-24 text-center"
                            />
                            <Button
                                content="Register"
                                primary
                                url="/register"
                                className="w-24 text-center"
                            />
                        </div>
                    </nav>
                </section>
            </div>
        );
    }
}

export default Home;