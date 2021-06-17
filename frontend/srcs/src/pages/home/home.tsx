
function Home() {
    return (
            <video autoPlay>
                <source src={process.env.PUBLIC_URL + 'hero-sea.mp4'} type='video/mp4'/>
            </video>
    );
}

export default Home;