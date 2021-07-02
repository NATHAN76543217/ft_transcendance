import React from "react";
import { Route, RouteComponentProps } from "react-router";
import { ChatHeader } from "../../components/chat/ChatHeader";

import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { Chat, ChatType } from "../../models/Chat";
import ChannelSearch from "./channelSearch";

type ChatPageParams = {
    id: string;
}

export default function ChatPage({ match }: RouteComponentProps<ChatPageParams>) {
    const chats: Chat[] = [{ name: "Chat 1", id: 0, type: ChatType.PUBLIC }, { name: "Chat 2", id: 1, type: ChatType.PUBLIC }, { name: "Chat 3", id: 2, type: ChatType.PUBLIC }, { name: "Chat 4", id: 3, type: ChatType.PUBLIC },];
    const currentChat: Chat = chats[Number(match.params.id)];

    console.log("Current chat " + match.params.id);

    return (<div className="flex h-full">
        <ChatNavBar chats={chats} activeIndex={Number(match.params.id)}></ChatNavBar>
        <div className="flex-col w-full">
            <ChatHeader chat={currentChat} ></ChatHeader>
            <Route exact path='/chat/find'>
                <ChannelSearch
                    myId="1"    // a changer
                />
            </Route>
            <Route exact path='/chat/create'>
                {/* <ChannelCreate /> */}
                <div>Channel Create</div>
            </Route>
            {/* <Route exact path="/users/:id" component={ChatElementPage} /> */}
        </div>
    </div>)
}