
function Home() {
    return (
        <div className="relative">
            <video
                autoPlay
                muted
                loop
                className="absolute w-full">
                <source src={process.env.PUBLIC_URL + 'hero-sea.mp4'} type='video/mp4'/>
            </video>
        </div>
    );
}

export default Home;