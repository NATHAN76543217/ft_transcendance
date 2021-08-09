import { io, Socket } from "socket.io-client";
import urljoin from "url-join";

export function getSocket(
  namespace: string,
  onConnection?: (socket: Socket) => void,
  baseUrl = "/api"
) {
  const path = urljoin(baseUrl, "/socket.io");

  // console.log(`Initiating socket connection to '${path} on '${namespace}'...`);

  const socket = io(namespace, {
    path,
    rejectUnauthorized: false, // This disables certificate authority verification
    withCredentials: true,
  })
    .on("authenticated", () => {
      // console.log(`Socket connection to '${path}' on '${namespace}' authenticated!`);

      if (onConnection !== undefined) {
        onConnection(socket);
      }
    })
    .on("connect_error", (err) => {
      console.error(`Could not connect to ${path}' on '${namespace}':`, err);
    });
  return socket;
}
