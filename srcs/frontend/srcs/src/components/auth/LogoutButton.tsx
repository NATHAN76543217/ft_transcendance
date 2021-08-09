import axios from "axios";

import { useContext } from "react";
//import Cookies from "js-cookie";
import AppContext from "../../AppContext";

export default function LogoutButton() {
  const { setUserInit } = useContext(AppContext);
  const onLogout = async () => {
    // const userId = user?.id
    try {
      // const dataUpdate = await axios.patch(
      //   `/api/users/${userId}`,
      //   { status: UserStatus.Offline },
      //   // { withCredentials: true }
      // );
      // console.log("data Update logout: ",dataUpdate)

      await axios.post("/api/authentication/logout", {
        withCredentials: true,
      });
      // console.log("Logout");

      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("logout error ", error);
      }
    } finally {

      setUserInit(undefined);
      // This should be done by api
      //Cookies.set("Authentication", "");
      window.location.href = "/";
    }
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className={
        "rounded-lg text-neutral font-semibold p-1 mx-2 w-full text-md bg-secondary hover:bg-secondary-dark"
      }
    >
      Logout
    </button>
  );
}
