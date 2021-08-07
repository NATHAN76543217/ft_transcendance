import { Slider } from "@material-ui/core";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { FieldError, useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import AppContext from "../../../AppContext";
import { CreateGameDto } from "../../../models/game/CreateGame.dto";
import { Match } from "../../../models/game/Match";
import { UserStatus } from "../../../models/user/IUser";
import { ClientMessages } from "../dto/messages";

type CreateGameFormValues = {
  rounds: number;
  opponent_id: number;
};

function GameCreate() {
  const history = useHistory();
  const { relationshipsList, matchSocket } = useContext(AppContext);

  useEffect(() => {
    matchSocket
      ?.on(ClientMessages.NOTIFY, console.log)
      .on(ClientMessages.GUEST_REJECTION, () => history.push("/game"));

    return () => {
      matchSocket
        ?.off(ClientMessages.NOTIFY, console.log)
        .off(ClientMessages.GUEST_REJECTION, () => history.push("/game"));
    };
  }, [matchSocket, history]);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateGameFormValues>();

  const TextInputError = (error?: FieldError) => {
    let message: string = "";

    if (error) {
      if (error.message) message = error.message;
      else if (error.type === "required") message = "This field is required";
    }
    return (
      <span className="inline-block ml-2 font-semibold text-red-500">
        {message}
      </span>
    );
  };

  const buttonClassname =
    "flex justify-center rounded-lg py-2 px-4 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto";
  const textButtonClassname = "text-2xl font-bold text-gray-900";

  const [nbPoints, setNbPoints] = useState<number>(11);
  const [speedMode, setSpeedMode] = useState<boolean>(false);
  const [downsizing, setDownsizing] = useState<boolean>(false);
  //const [showCreationValidation, setShowCreationValidation] = useState(false);

  const handleChange = (event: any, newValue: any) => {
    setNbPoints(newValue);
    // console.log('newValue', newValue)
  };

  const marks = [
    {
      value: 3,
      label: "3",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 11,
      label: "11",
    },
    {
      value: 15,
      label: "15",
    },
    {
      value: 19,
      label: "19",
    },
  ];

  const onSubmit = async (values: CreateGameFormValues) => {
    values.rounds = nbPoints;
    console.log("onSubmit", values);
    //setShowCreationValidation(false);
    clearErrors();
    if (values.opponent_id === null || values.opponent_id === undefined) {
      setError(
        "opponent_id",
        { message: "You need to select a player" },
        { shouldFocus: true }
      );
      return;
    }

    console.log("opponent id", values.opponent_id);
    const body: CreateGameDto = {
      ruleset: {
        rounds: values.rounds,
        speedMode: speedMode,
        downsize: downsizing
      },
      guests: [Number(values.opponent_id)],
    };
    try {
      const response = await axios.post<Match>("/api/matches", body);
      console.log("Game created, redirecting to:", response.data);
      history.push(`/game/${response.data.id}`);
    } catch (e) {
      console.error("TODO: inviteFriend:", e);
    }
  };

  const getNbOnlineFriends = () => {
    let nbOnlineFriends = 0;
    relationshipsList.map((relation) => {
      if (relation.user.status === UserStatus.Online) {
        nbOnlineFriends++;
      }
      return nbOnlineFriends;
    });
    return nbOnlineFriends;
  };

  const displayNoOnlineFriendsMessage = () => {
    if (!getNbOnlineFriends()) {
      return (
        <div className="font-semibold text-center">
          You have no online friend
        </div>
      );
    }
  };

  const displayPlayersList = () => {
    let radioLabelClassName = "inline-flex items-center ml-2 mr-2";
    let radioSpanClassName = "ml-1 font-semibold";
    return (
      <div>
        <ul>
          {relationshipsList.map((relation) => {
            if (relation.user.status === UserStatus.Online) {
              return (
                <li key={relation.user.id}>
                  <label className={radioLabelClassName}>
                    <input
                      type="radio"
                      className=""
                      value={relation.user.id}
                      {...register("opponent_id")}
                    />
                    <span className={radioSpanClassName}>
                      {relation.user.name}
                    </span>
                  </label>
                </li>
              );
            } else {
              return <li key={relation.user.id}></li>;
            }
          })}
        </ul>
        {displayNoOnlineFriendsMessage()}
      </div>
    );
  };

  // TO DO: Clear index bellow the slider.
  const displaySliderPoints = () => {
    return (
      <div className="">
        <label className="ml-2 text-lg font-semibold">
          {" "}
          Score to win: {nbPoints}
        </label>
        <div className="px-8 pt-2 bg-gray-100 rounded-md">
          <Slider
            step={4}
            min={3}
            max={19}
            marks={marks}
            className="px-2 rounded-sm cursor-grab"
            aria-labelledby="discrete-slider-always"
            value={nbPoints}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log('speedMode', speedMode)
  }, [speedMode])
  
  useEffect(() => {
    console.log('downsizing', downsizing)
  }, [downsizing])

  function displaySpeedModeBonus() {
  
    return (
      <section className="relative flex items-center justify-center pt-8">
        <label className="font-bold text-gray-700">
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            readOnly
            onClick={() => setSpeedMode(!speedMode)}
            checked={speedMode}
          />
          <span className="text-sm">Speed mode</span>
        </label>
      </section>
    ) 
  }

  function displayDownsizingBonus() {
  
    return (
      <section className="relative flex items-center justify-center pt-2 pb-4">
        <label className="font-bold text-gray-700">
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            readOnly
            onClick={() => setDownsizing(!downsizing)}
            checked={downsizing}
          />
          <span className="text-sm">Downsizing mode</span>
        </label>
      </section>
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
              {TextInputError(errors.opponent_id)}
            </div>
          </div>
          {displaySliderPoints()}
          {displaySpeedModeBonus()}
          {displayDownsizingBonus()}
          <div className="flex justify-center pr-4 ">
            <input
              type="submit"
              value="Create a game"
              className="h-10 px-4 py-1 my-8 text-lg font-semibold bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            ></input>
          </div>
          {/* {displayCreationValidationMessage(showCreationValidation)} */}
        </div>
      </form>
    );
  };

  // NavLink does not need an onClick, because it is a link

  return (
    <div className="grid justify-center">
      <div className="inline-block px-12 pt-8 pb-2 mt-24 bg-blue-200 border-2 border-gray-300 rounded-lg">
        <div className="flex justify-center mb-4 text-3xl font-bold ">
          Game settings
        </div>
        {displayCreateGameForm()}
      </div>
      <div className="flex justify-center">
        <NavLink
          className={
            buttonClassname + " bg-secondary hover:bg-secondary-dark mt-8 w-32"
          }
          to="/game"
        >
          <span className={textButtonClassname}>Quit</span>
        </NavLink>
      </div>
    </div>
  );
}

export default GameCreate;
