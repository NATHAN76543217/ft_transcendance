import { Slider } from "@material-ui/core";
import { useState, useContext } from "react";
import { FieldError, useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import AppContext from "../../../AppContext";
import CreateGameDto from "../../../models/game/CreateGame.dto";
import { UserStatus } from "../../../models/user/IUser";

function GameCreate() {
  const { relationshipsList, user } = useContext(AppContext)

  const quitToHome = () => {
    console.log('Quit to Home')
  }

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateGameDto>();

  const TextInputError = (error?: FieldError) => {
    let message: string = "";

    if (error) {
      if (error.message)
        message = error.message;
      else if (error.type === "required")
        message = "This field is required";
    }
    return (<span className="inline-block ml-2 font-semibold text-red-500">{message}</span>)
  }

  const buttonClassname = "flex justify-center rounded-lg py-2 px-4 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto"
  const textButtonClassname = 'text-2xl font-bold text-gray-900'

  const [nbPoints, setNbPoints] = useState<number>(5);
  const [showCreationValidation, setShowCreationValidation] = useState(false)

  const handleChange = (event: any, newValue: any) => {
    setNbPoints(newValue);
    console.log('newValue', newValue)
  };

  const marks = [
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
    {
      value: 15,
      label: '15',
    },
    {
      value: 20,
      label: '20',
    },
  ];

  const onSubmit = async (values: CreateGameDto) => {
    values.nbPoints = nbPoints
    values.user1_id = user ? user.id.toString() : ""
    console.log('onSubmit', values)
    setShowCreationValidation(false);
    clearErrors();
    if (values.user2_id === null || !values.user2_id) {
      setError(
        "user2_id",
        { message: "You need to select a player" },
        { shouldFocus: true }
      );
      return;
    }
    try {


      //////////////////////////////////////////////////////////////////////////////
      // create the game with values parameters
      //                 HERE
      //////////////////////////////////////////////////////////////////////////////


      console.log('Game created with params: ', values)
      setShowCreationValidation(true);
    }
    catch (error) {
      // if (axios.isAxiosError(error)) {
      if (false) {
        if (error.response?.status === 409) {
          // const details = error.response.data as {
          //   statusCode: number;
          //   message: string;
          // };
          // setError(
          //   "channelName",
          //   { message: details.message },
          //   { shouldFocus: true }
          // );
        }
      }
      else {
        setError(
          'user2_id',
          { message: 'No opponent found' },
          { shouldFocus: true }
        );
      }
    }
  }

  const displayCreationValidationMessage = (showRegisterValidation: boolean) => {
    if (showRegisterValidation) {
      return (
        <div className="absolute bottom-0 w-full pr-12 font-bold text-center text-green-600">
          Channel creation confirmed
        </div>
      );
    }
  }

  const getNbOnlineFriends = () => {
    let nbOnlineFriends = 0;
    relationshipsList.map((relation) => {
      if (relation.user.status === UserStatus.Online) {
        nbOnlineFriends++;
      }
      return nbOnlineFriends;
    })
    return nbOnlineFriends;
  }



  const displayPlayersList = () => {
    let radioLabelClassName = "inline-flex items-center ml-2 mr-2"
    let radioSpanClassName = "ml-1 font-semibold"
    if (getNbOnlineFriends()) {
      return (
        <ul>
          {relationshipsList.map((relation) => {
            if (relation.user.status === UserStatus.Online) {
              return (
                <li key={relation.user.id}>
                  <label className={radioLabelClassName}>
                    <input type="radio" className='' value={relation.user.id} {...register("user2_id")} />
                    <span className={radioSpanClassName}>{relation.user.name}</span>
                  </label>
                </li>
              )
            } else {
              return <div></div>
            }
          })}
        </ul>
      )
    } else {
      return (
        <div className='font-semibold text-center'>You have no online friend</div>
      )
    }
  }

  const displaySliderPoints = () => {
    return (
      <div className="">
        <label className='ml-2 text-lg font-semibold'> Max points number</label>
        <div className="px-8 pt-2 bg-gray-100 rounded-md">
          <Slider
            step={5}
            min={5}
            max={20}
            marks={marks}
            className="px-2 rounded-sm cursor-grab"
            aria-labelledby="discrete-slider-always"
            value={nbPoints}
            onChange={handleChange}
          />
        </div>
      </div>
    )
  }

  const displayCreateGameForm = () => {


    return (
      <form onSubmit={handleSubmit(onSubmit)} className="py-2">
        <div className="relative pl-4 w-80">
          <div className="h-auto mb-4">
            <span className="mb-2 ml-2 text-lg font-semibold ">Player</span>
            <div className="grid px-4 py-2 bg-gray-100 rounded-md">
              {displayPlayersList()}
              {TextInputError(errors.user2_id)}
            </div>
          </div>
          {displaySliderPoints()}
          <div className="flex justify-center pr-4 ">
            <input
              type="submit"
              value="Create a game"
              className="h-10 px-4 py-1 my-8 text-lg font-semibold bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            ></input>
          </div>
          {displayCreationValidationMessage(showCreationValidation)}
        </div>
      </form>
    );
  }

  return (
    <div className='grid justify-center'>
      <div className='inline-block px-12 pt-8 pb-2 mt-24 bg-blue-200 border-2 border-gray-300 rounded-lg'>
        <div className='flex justify-center mb-4 text-3xl font-bold '>
          Game settings
        </div>
        {displayCreateGameForm()}

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
