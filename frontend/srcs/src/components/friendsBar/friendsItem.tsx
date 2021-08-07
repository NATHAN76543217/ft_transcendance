import axios from "axios";
import { useContext } from "react";
// import React, { useContext } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import AppContext from "../../AppContext";
// import AppContext from "../../AppContext";
import { Message } from "../../models/channel/Channel";
import { CreateGameDto } from "../../models/game/CreateGame.dto";
import { Match } from "../../models/game/Match";
import { UserStatus } from "../../models/user/IUser";
import { ServerMessages } from "../../pages/game/dto/messages";

type FriendsProps = {
  name: string;
  status: UserStatus;
  imgPath?: string;
  id: number;
  canInvite?: boolean;
  canWatch?: boolean;
  isFriend?: boolean;
  gameInvite?: Message;
  roomId?: number;
};

function FriendItem({
  name,
  status,
  imgPath,
  id,
  canInvite,
  canWatch,
  isFriend,
  gameInvite,
  roomId
}: FriendsProps) {
  const history = useHistory();
  // const { channelSocket: socket } = useContext(AppContext);

  const { matchSocket } = useContext(AppContext);


  let path =
    imgPath === ""
      ? "/api/uploads/default-profile-picture.png"
      : "/api/uploads/" + imgPath;
  let friendName = name.length < 10 ? name : name.substring(0, 10) + "...";

  let friendUrl = isFriend ? `/chat/${id}` : `/users/${id}`;

  const displayProfilePicture = () => {
    return (
      <Link className="inline w-10 h-10 mx-2 my-auto " to={friendUrl}>
        <img src={path} alt="friends_1_avatar" className="rounded-full " />
      </Link>
    );
  };

  const inviteFriendToPlay = async () => {
    const gameData: CreateGameDto = { guests: [id], ruleset: {} };

    console.log("Creating new game", gameData);

    try {
      const response = await axios.post<Match>("/api/matches", gameData);
      console.log("Game created, redirecting to:", response.data);
      // history.push(`/game`);
      history.push(`/game/${response.data.id}`);
    } catch (e) {
      console.error("TODO: inviteFriend:", e);
    }
  };

  const acceptGameRequest = async () => {
    console.log("[pong.tsx] Accepting game invitation - game Invite: ", gameInvite);
    if (gameInvite) {
      matchSocket?.emit(ServerMessages.ACCEPT_INVITATION, {
        roomId: Number(gameInvite.data),
        messageId: gameInvite.id
      });
      // history.push(`/game`);
      history.push(`/game/${gameInvite.data}`);
      // await axios.delete(`/api/messages/${gameInvite.id}`);
    }
  };

  const cancelGameRequest = async () => {
    try {
      if (gameInvite) {
        await axios.delete(`/api/matches/${gameInvite.data}`);
        await axios.delete(`/api/messages/${gameInvite.id}`);
        console.log("Game invitation deleted");
        // history.push(`/game/${response.data.id}`);
      }
      } catch (e) {
      console.error(e);
    }
  };

  const displayInviteButton = () => {
    if (canInvite) {
      if (!gameInvite) {

        return (
          <button
            className={
              "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
              " bg-purple-300 hover:bg-purple-400" +
              " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
            }
            onClick={() => inviteFriendToPlay()}
          >
            Invite to play
          </button>
        );
      } else {
        if (gameInvite.sender_id === id) {
          return (
            <button
              className={
                "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
                " bg-green-300 hover:bg-green-400 text-xs" +
                " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
              }
              onClick={() => acceptGameRequest()}
            >
              Accept game request
            </button>
          );
        } else {
          return (
            <button
              className={
                "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
                " bg-red-400 hover:bg-red-500" +
                " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
              }
              onClick={() => cancelGameRequest()}
            >
              Cancel game request
            </button>
          );
        }
      }
    }
  };

  const displayWatchButton = () => {
    if (canWatch) {
      return (
        <NavLink
          className={
            "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
            " bg-yellow-300 hover:bg-yellow-400" +
            " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
          }
          to={`/game/${roomId}`}
        >
          {"Watch the game"}
        </NavLink>
      );
    }
  };

  return (
    <li className="flex h-16 border-t-2 border-gray-200">
      {displayProfilePicture()}
      <div className="inline-block my-auto align-middle">
        <span className="first-letter:uppercase">{friendName}</span>
        <br />
        {displayInviteButton()}
        {displayWatchButton()}
      </div>
    </li>
  );
}

export default FriendItem;
