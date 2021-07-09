import axios from "axios";

import { useContext } from "react";
//import Cookies from "js-cookie";
import AppContext from "../../AppContext";

export default function LogoutButton() {
  const { setUser } = useContext(AppContext);
  const onLogout = async () => {
    try {
      await axios.post("/api/authentication/logout", {
        withCredentials: true,
      });
      console.log("Logout");
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
        "rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary"
      }
    >
      Logout
    </button>
  );
}
