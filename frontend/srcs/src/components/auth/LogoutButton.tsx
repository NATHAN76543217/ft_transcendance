import axios from "axios";

import { useContext } from "react";
//import Cookies from "js-cookie";
import AppContext from "../../AppContext";
import { UserStatus } from "../../models/user/IUser";

export default function LogoutButton() {
  const { setUser, user } = useContext(AppContext);
  const onLogout = async () => {
    const userId = user?.id
    try {
      const dataUpdate = await axios.patch(
        `/api/users/${userId}`,
        { status: UserStatus.offline },
        // { withCredentials: true }
      );
      console.log("data Update logout: ",dataUpdate)

      await axios.post("/api/authentication/logout", {
        withCredentials: true,
      });
      // console.log("Logout");

      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("logout error ", error);
      }
    } finally {

      setUser(undefined);
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
        "rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary hover:bg-secondary-dark"
      }
    >
      Logout
    </button>
  );
}
