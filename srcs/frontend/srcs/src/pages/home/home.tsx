import Button from '../../components/utilities/Button'
function Home(props: { logged: boolean }) {
    if (props.logged) {
        return (
            <div className="h-full">
                <section className="relative h-full">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="object-cover w-full h-full">
                        <source src={process.env.PUBLIC_URL + 'hero-sea.mp4'} type='video/mp4' />
                    </video>

                    <nav className="absolute z-30 w-2/3 p-4 -translate-x-1/2 -translate-y-1/2 rounded-xl lg:w-96 xl:w-2/3 3xl:w-1/3 top-[21rem] lg:top-64 left-1/2 bg-primary/60">
                        <div>

                            <h1 className="text-4xl " >Welcome to ft_pong</h1>
                            <p className="mt-2 mb-4 ml-4 text-sm md:text-lg">
                                ft_pong is an amazing game that you can play with your friends.
                            <br />
                            There's no time to waste, let's register and login to start the ft_pong experience!
                            </p>
                        </div>
                        <div>
                            <h1 className="text-4xl " >Rule set</h1>
                            <p className="mt-2 mb-4 ml-4 text-sm md:text-lg">
                                - A game is played between 2 players.
                            <br />
                                - Players can move their paddle with the mouse or trackpad.
                            <br />
                            - The goal is to reach the number of points limit (customizable - 11 by default) before the time limit (3 min).
                            <br />
                            - A player scores a point when the ball hits its opponent wall.
                            <br />
                            - The game ends when one of the two players reaches the points goal or when the time limit is reached.
                            <br />
                            </p>
                        </div>
                        <div className="flex items-center justify-center pt-4 space-x-2 md:space-x-8">
                            <Button
                                content="Let's play !"
                                url="/game/matchmaking"
                                secondary
                                className="whitespace-nowrap"
                            />
                            <Button
                                content="Custom Game"
                                url="/game"
                                secondary
                                className="whitespace-nowrap"
                            />
                        </div>
                    </nav>
                    {/* </div> */}
                </section>
            </div>
        );
    } else {
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
                    <nav className="absolute p-4 rounded-xl w-96 xl:w-2/3  3xl:w-1/3 top-[20%] xl:top-1/4 3xl:top-1/2 left-[20%]   bg-primary/60 max-w-2xl">
                        <div>

                            <h1 className="text-4xl " >Welcome to ft_pong</h1>
                            <p className="mt-2 mb-4 ml-4">
                                ft_pong is an amazing game that you can play with your friends.
                            <br />
                            There's no time to waste, let's register and login to start the ft_pong experience!
                        </p>
                        </div>
                        <div className="flex items-center justify-center space-x-16">
                            <Button
                                content="Login"
                                secondary
                                url="/login"
                                className="w-24 text-center"
                            />
                            <Button
                                content="Register"
                                secondary
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