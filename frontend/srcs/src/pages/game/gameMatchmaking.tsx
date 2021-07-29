import { NavLink } from "react-router-dom";

function GameMatchmaking() {

  const findGame = () => {
    console.log('Find a game')
  }

  const cancelSearch = () => {
    console.log('Cancel search')
  }

  const quitToHome = () => {
    console.log('Quit to Home')
  }



  const buttonClassname = "flex justify-center rounded-lg py-2 px-4 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto"
  const textButtonClassname = 'text-2xl font-bold text-gray-900'

  return (
    <div className='grid justify-center'>
      <div className='inline-block px-12 py-8 mt-24 bg-blue-200 border-2 border-gray-300 rounded-lg'>
        <div className='flex justify-center mb-8 text-3xl font-bold '>
          Matchmaking
        </div>
        <div className='flex w-auto space-x-8 rounded-md lg:space-x-24'>
          <button
            className={buttonClassname + ' bg-green-300 hover:bg-green-400'}
            // to='game/matchmaking'
            onClick={() => findGame()}
          >
            <span className={textButtonClassname}>Find a Game</span>
          </button>
          <button
            className={buttonClassname + ' bg-red-400 hover:bg-red-500'}
            // to='game/create'
            onClick={() => cancelSearch()}
          >
            <span className={textButtonClassname}>Cancel search</span>
          </button>
        </div>
      </div>
      <div className='flex justify-center'>

        <NavLink
          className={buttonClassname + ' bg-secondary hover:bg-secondary-dark mt-8 w-32'}
          to='/game'
          onClick={() => quitToHome()}
        >
          <span className={textButtonClassname}>Quit</span>
        </NavLink>
      </div>
    </div>
  );
}

export default GameMatchmaking;
