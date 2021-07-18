import Cookies from "js-cookie";
import React from "react";
import { io, Socket } from "socket.io-client";

// import Button from '../../components/utilities/Button';

class Test extends React.Component {



  getSocket = () => {
  
    console.log("Users socket connection - Initiating...");
  
    // const io = require("socket.io-client");

    const socket = io("", {
      path: "/api/socket.io/users",
      rejectUnauthorized: false, // This disables certificate authority verification
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.connect();

    console.log("Users socket connection - Ending...", socket);
    return socket.on("authenticated", () => {
      console.log("--------- Socket connection authenticated!");
    });

    // return socket;
  };
  
  render() {
    const socket: Socket | undefined = this.getSocket()


    return (
      <div className="">
        Test
      </div>
    );
  }
}

export default Test;


