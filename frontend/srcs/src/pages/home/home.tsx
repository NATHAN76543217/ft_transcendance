
function Home() {
    return (
        <div className="w-30">

            <video autoPlay muted loop>
                <source src={process.env.PUBLIC_URL + 'hero-sea.mp4'} type='video/mp4'/>
            </video>
        </div>
    );
}

export default Home;