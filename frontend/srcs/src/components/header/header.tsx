import { useContext } from "react";

import Button from "../utilities/Button";
import LogoutButton from "../auth/LogoutButton";
import AppContext from "../../AppContext";

function Header() {
  const { user } = useContext(AppContext);

  //TODO replace logout button redirection by a query to /apip/authentication/api

  console.log("Header user authenticated:", user !== undefined);
  return (
    <header className="relative z-30 flex flex-row justify-between w-full bg-primary ">
      <span className="block px-4 py-2 text-4xl font-bold">ft_pong</span>
      <span>{user && user.name}</span>
      {user !== undefined ? (
        <div className="m-4">
          <LogoutButton />
        </div>
      ) : (
        <div className="m-4 ">
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
      )}
    </header>
  );
}

export default Header;
