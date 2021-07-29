import { Slider } from "@material-ui/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function GameCreate() {

  const quitToHome = () => {
    console.log('Quit to Home')
  }

  const buttonClassname = "flex justify-center rounded-lg py-2 px-4 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto"
  const textButtonClassname = 'text-2xl font-bold text-gray-900'

  const [value, setValue] = useState<number>(2);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    console.log('newValue', newValue)
  };

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 6,
      label: '6',
    },
    ,
    {
      value: 8,
      label: '8',
    },
    {
      value: 10,
      label: '10',
    },
  ];

  return (
    <div className='grid justify-center'>
      <div className='inline-block px-12 py-8 mt-24 bg-blue-200 border-2 border-gray-300 rounded-lg'>
        <div className='flex justify-center mb-8 text-3xl font-bold '>
          Create a game
        </div>
        {/* <div className='flex w-auto space-x-8 rounded-md lg:space-x-24'>
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
        </div> */}

      <label className='font-semibold'> Game duration (min)</label>
				<Slider
					step={1}
					min={0}
					max={10}
          marks={marks}
					className="px-2 bg-gray-100 rounded-sm cursor-grab"
          aria-labelledby="discrete-slider-always"
					value={value}
					onChange={handleChange}
          // valueLabelDisplay=auto'
				/>
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

export default GameCreate;
