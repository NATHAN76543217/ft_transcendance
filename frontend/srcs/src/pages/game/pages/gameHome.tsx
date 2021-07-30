import axios from "axios";
import { NavLink } from "react-router-dom";

function GameHome() {

  const fastGame = () => {
    console.log('Fast game')
  }

  const createGame = () => {
    console.log('Create game')
  }

  const buttonClassname = "flex rounded-lg py-2 px-4 " +
    " bg-secondary hover:bg-secondary-dark" +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto"
  const textButtonClassname = 'text-2xl font-bold text-gray-900'

  // const displayCurrentGames = () => {
  //   const currentGames = await axios.get('/api/matches/current');
  //   currentGames.data.map((match) => {
      
  //   })
  // }
  
  return (
    <div className='flex justify-center'>
      <div className='inline-block px-12 py-8 mt-24 bg-gray-100 border-2 border-gray-300 rounded-lg'>
        <div className='flex justify-center mb-8 text-3xl font-bold '>
          Do you want to play?
        </div>
        <div className='flex w-auto space-x-8 rounded-md lg:space-x-24'>
          <NavLink
            className={buttonClassname}
            to='game/matchmaking'
            onClick={() => fastGame()}
          >
            <span className={textButtonClassname}>Fast Game</span>
          </NavLink>
          <NavLink
            className={buttonClassname}
            to='game/create'
            onClick={() => createGame()}
          >
            <span className={textButtonClassname}>Create Game</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default GameHome;
