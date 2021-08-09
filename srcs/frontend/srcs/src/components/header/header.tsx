import React, { useContext } from "react";

import Button from "../utilities/Button";
import LogoutButton from "../auth/LogoutButton";
import AppContext from "../../AppContext";
import { NavLink } from "react-router-dom";
import { IUser } from "../../models/user/IUser";
import { UserRole } from "../../models/user/IUser";

function displayProfileItem(user: IUser | undefined) {
  let path =
    user === undefined || user.imgPath === ""
      ? "/api/uploads/default-profile-picture.png"
      : "/api/uploads/" + user.imgPath;
  if (user !== undefined && user.role !== UserRole.Banned) {
    return (
      <NavLink to="/users">
        <span className="font-bold text-center hover:underline">
          {user && user.name}
        </span>
        <img
          src={path}
          alt="friends_1_avatar"
          className="inline w-8 h-8 ml-2 bg-white rounded-full hover:ring-2 hover:ring-gray-500"
        />
      </NavLink>
    );
  }
}

function displayLoginAndRegisterItem(user: IUser | undefined) {
  if (user !== undefined) {
    return (
      <div className="m-4">
        <LogoutButton />
      </div>
    );
  } else {
    return (
      <div className="m-4 space-x-4">
        <Button
          content="Login"
          secondary
          url="/login"
          className="w-24 text-center"
        />
        <Button
          content="Register"
          secondary
          url="/register"
          className="w-24 text-center"
        />
      </div>
    );
  }
}

function Header() {
  const { user } = useContext(AppContext);

  //TODO replace logout button redirection by a query to /apip/authentication/api
  return (
    <header className="relative z-30 flex flex-row items-center justify-between w-full h-12 bg-primary">
      <span className="block px-4 text-4xl font-bold">ft_pong</span>
      <div className="flex items-center">
        {displayProfileItem(user)}
        {displayLoginAndRegisterItem(user)}
      </div>
    </header>
  );
}

export default Header;
