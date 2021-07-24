import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../AppContext";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
import { UserStatus } from "../../models/user/IUser";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import FriendItem from "./friendsItem";



function getSectionColor(sectionName: UserStatus) {
  switch (sectionName) {
    case UserStatus.Null:
      return "bg-blue-100";
    case UserStatus.InGame:
      return "bg-yellow-100";
    case UserStatus.Online:
      return "bg-green-100";
    case UserStatus.Offline:
      return "bg-red-100";
    default:
      return "";
  }
}

function FriendsBar(props: { logged: boolean, relationshipsList: AppUserRelationship[] }) {
  const contextValue = React.useContext(AppContext);

  const [displaySection, setDisplaySection] = useState({
    pendingRequests: true,
    inGameFriends: true,
    onlineFriends: true,
    offlineFriends: true,
  });

  // contextValue.socket?.on('updateRelationship-back', (data: any) => {
  //   // let inf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(id));
  //   // let relationship = contextValue.relationshipsList.find((relation: any) => {
  //   //   return relation.user.id === data?.user_id
  //   // })
  //   // if (relationship) {
      
  //   // }
  //   if (data) {
  //       contextValue.updateOneRelationship(data.user_id, data.type)
  //   }
  //   // console.log(`received updated relationship `, data)
  //   console.log(`received updated relationship from ${data?.user_id}: newType = ${data?.type}`)
  // })

  const getDisplayBoolean = (sectionName: UserStatus) => {
    switch (sectionName) {
      case UserStatus.Null:
        return displaySection.pendingRequests;
      case UserStatus.InGame:
        return displaySection.inGameFriends;
      case UserStatus.Online:
        return displaySection.onlineFriends;
      case UserStatus.Offline:
        return displaySection.offlineFriends;
      default:
        return true;
    }
  }

  const changeSectionDisplayStatus = (
    sectionName: UserStatus
  ) => {
    switch (sectionName) {
      case UserStatus.Null:
        return setDisplaySection({
          ...displaySection,
          pendingRequests: !displaySection.pendingRequests,
        });
      case UserStatus.InGame:
        return setDisplaySection({
          ...displaySection,
          inGameFriends: !displaySection.inGameFriends,
        });
      case UserStatus.Online:
        return setDisplaySection({
          ...displaySection,
          onlineFriends: !displaySection.onlineFriends,
        });
      case UserStatus.Offline:
        return setDisplaySection({
          ...displaySection,
          offlineFriends: !displaySection.offlineFriends,
        });
      default:
        return;
    }
  }

  const displayPendingRequests = (
    relation: AppUserRelationship,
  ) => {
    // console.log("displayPendingRequests",)
    // // TODO: This will be relation.user_id
    let inf = contextValue.user === undefined ? undefined : Number(contextValue.user.id) < Number(relation.user.id);
    if (((inf && relation.relationshipType === UserRelationshipType.pending_second_first) ||
      (!inf && relation.relationshipType === UserRelationshipType.pending_first_second)) &&
      displaySection.pendingRequests
    ) {
      // console.log("displayPendingRequests - TRUE")
      return (
        <FriendItem
          name={relation.user.name}
          status={relation.user.status}
          imgPath={relation.user.imgPath}
        />
      );
    } else {
      return <div></div>;
    }
  }

  const displayRelation = (relation: AppUserRelationship, statusFilter: UserStatus, displayBoolean: boolean) => {
    // console.log(`displayRelationList - ${statusFilter}`)
    if (
      relation.relationshipType === UserRelationshipType.friends &&
      relation.user.status === statusFilter &&
      displayBoolean
    ) {
      return (
        <FriendItem
          name={relation.user.name}
          status={relation.user.status}
          imgPath={relation.user.imgPath}
        />
      );
    } else {
      return <div></div>;
    }
  }


  const displayItemsList = (statusFilter: UserStatus, sectionName: string) => {
    const displayBoolean = getDisplayBoolean(statusFilter);
    const bgColor = getSectionColor(statusFilter);
    return (
      <section className="border-b-2 border-gray-300">
        <button
          className={`flex items-center justify-between w-full py-2 pr-4 ${bgColor}`}
          onClick={() =>
            changeSectionDisplayStatus(
              statusFilter
            )
          }
        >
          <i
            className={
              "pl-4 fas " +
              (displayBoolean
                ? "fa-chevron-down"
                : "fa-chevron-right")
            }
          ></i>
          <h3 className="text-lg text-center first-letter:uppercase">
            {sectionName}
          </h3>
        </button>
        <ul>
          {props.relationshipsList.map((relation) => (
            <div key={relation.user.name}>
              {/* {true ? displayPendingRequests( */}
              {statusFilter === UserStatus.Null ? displayPendingRequests(
                relation,
              ) :
                displayRelation(relation, statusFilter, displayBoolean)}
            </div>
          ))}
        </ul>
      </section>
    )
  }

  if (!props.logged) {
    return (<div></div>)
  } else {
    return (
      <aside className="w-48 bg-neutral">
        <header>
          <h2 className="py-4 text-2xl text-center first-letter:uppercase bg-secondary">
            my friendlist
         </h2>
          <Link to="/users/find">
            <button
              className="flex items-center justify-between w-full p-2 pl-8 text-left border-t-2 border-b-2 border-gray-400"
              type="button"
            >
              <i className="fas fa-plus text-secondary" />
              <span className="flex-grow text-xl text-center first-letter:uppercase">
                add friends
             </span>
            </button>
          </Link>
        </header>
        {displayItemsList(UserStatus.Null, 'pending requests')}
        {displayItemsList(UserStatus.InGame, 'In game friends')}
        {displayItemsList(UserStatus.Online, 'Online friends')}
        {displayItemsList(UserStatus.Offline, 'Offline friends')}

      </aside>
    );
  }
}

export default FriendsBar;
