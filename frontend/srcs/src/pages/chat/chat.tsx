import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { ChatHeader } from "../../components/chat/ChatHeader";

import { ChatNavBar } from "../../components/chat/ChatNavBar";
import { Chat, ChatType } from "../../models/Chat";
//import ChannelSearch from "./channelSearch";

type TooltipIconButtonProps = {
    tooltip: string;
    icon: string;
    iconStyle: string;
    href: string;
}

export function TooltipIconButton({ icon, iconStyle, tooltip, href }: TooltipIconButtonProps) {
    return (
        <NavLink className="flex flex-col items-center has-tooltip" activeClassName="text-blue-600" to={href}>
            <i className={`${iconStyle} ${icon}`}/>
            <span className="p-1 mt-6 bg-gray-100 rounded shadow-lg tooltip">{tooltip}</span>
        </NavLink>
    );
}

TooltipIconButton.defaultProps = {
    iconStyle: "fas fa-lg"
}

type ChatPageParams = {
    id: string;
}

export default function ChatPage({ match }: RouteComponentProps<ChatPageParams>) {
    const chats: Chat[] = [{ name: "Chat 1", id: 0, type: ChatType.PUBLIC }, { name: "Chat 2", id: 1, type: ChatType.PUBLIC }, { name: "Chat 3", id: 2, type: ChatType.PUBLIC }, { name: "Chat 4", id: 3, type: ChatType.PUBLIC },];

    const chatId = Number(match.params.id);

    const currentChat = isNaN(chatId) ? undefined : chats[Number(match.params.id)];

    console.log("Current chat " + match.params.id);

    

    return (<div className="flex h-full">
        {/*<Route exact path='/chat/find'>
            <ChannelSearch
                myId="1"    // a changer
            />
        </Route>
        <Route exact path='/chat/create'>
            { <ChannelCreate /> }
                <div>Channel Create</div>
        </Route>
        */}
        <ChatNavBar chats={chats} activeIndex={Number(match.params.id)}></ChatNavBar>
        <ChatHeader chat={currentChat}>
            <span>40 users</span>
            <TooltipIconButton tooltip="Invite" icon="fa-user-plus" href={`/chat/${chatId}/settings`}></TooltipIconButton>
            <TooltipIconButton tooltip="Settings" icon="fa-cog" href={`/chat/${chatId}/settings`}></TooltipIconButton>
        </ChatHeader>
    </div>)
}