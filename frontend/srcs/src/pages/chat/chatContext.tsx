import React from "react";
import { IChatContext } from "./IChatContext";

export const chatContext = React.createContext<IChatContext>({
  channelRels: new Map(), // TODO: Use local storage
  currentChannelRel: undefined,
  setChannelRels: () => {},
  setCurrentChannelRel: () => {},
  currentUserRel: undefined,
  setCurrentUserRel: () => {}
});

export const chatProvider = chatContext.Provider;
export const chatConsumer = chatContext.Consumer;

export default chatContext;
