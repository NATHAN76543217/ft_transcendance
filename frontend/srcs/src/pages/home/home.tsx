import Button from '../../components/utilities/Button'
function Home() {
    return (
        <div>
            <section className="relative ">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full ">
                    <source src={process.env.PUBLIC_URL + 'hero-sea.mp4'} type='video/mp4'/>
                </video>
                <nav className="absolute p-4 rounded-xl w-96 xl:w-2/3  3xl:w-1/3 top-[20%] xl:top-1/4 3xl:top-1/2 left-[20%]  bg-primary/60">
                    <h1 className="text-4xl " >Welcome to ft_pong</h1>
                    <p className="mt-2 mb-4 ml-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Dolores, rem. Consequuntur laboriosam eius est enim repudiandae minima, 
                    </p>
                    <Button content="Let's play !" url="/game/quickgame" primary />
                    <Button content="Custom Game" url="/game"/>
                    <Button content="Oauth" url="https://api.intra.42.fr/oauth/authorize?client_id=e2d030a76b4b62d20c5f0ef2b431169b9d845bdb68bfc12dc12d9aa31f215733&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fvalidate_oauth&response_type=code"/>
                </nav>
            </section>
        </div>
    );
}

export default Home;