import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../AppContext";
import { IUser } from "../../models/user/IUser";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import FriendItem from "./friendsItem";

function changeSectionDisplayStatus(
  setDisplaySection: any,
  displaySection: any,
  sectionName: string
) {
  switch (sectionName) {
    case "pendingRequests":
      return setDisplaySection({
        ...displaySection,
        pendingRequests: !displaySection.pendingRequests,
      });
    case "inGameFriends":
      return setDisplaySection({
        ...displaySection,
        inGameFriends: !displaySection.inGameFriends,
      });
    case "onlineFriends":
      return setDisplaySection({
        ...displaySection,
        onlineFriends: !displaySection.onlineFriends,
      });
    case "offlineFriends":
      return setDisplaySection({
        ...displaySection,
        offlineFriends: !displaySection.offlineFriends,
      });
    default:
      return;
  }
}

function displayPendingRequests(
  displaySection: any,
  relation: IUser,
  myId: string
) {
  let inf = Number(myId) < Number(relation.id);
  if (
    ((inf &&
      relation.relationshipType & UserRelationshipType.pending_second_first) || // a ajuster
      (!inf &&
        relation.relationshipType &
          UserRelationshipType.pending_first_second)) &&
    displaySection.offlineFriends
  ) {
    return (
      <FriendItem
        name={relation.name}
        status={relation.status}
        imgPath={relation.imgPath}
      />
    );
  } else {
    return <div></div>;
  }
}

function displayInGameFriends(displaySection: any, relation: IUser) {
  if (
    relation.relationshipType & UserRelationshipType.pending_first_second && // a ajuster
    relation.relationshipType & UserRelationshipType.pending_second_first &&
    relation.status === "In game" &&
    displaySection.inGameFriends
  ) {
    return (
      <FriendItem
        name={relation.name}
        status={relation.status}
        imgPath={relation.imgPath}
      />
    );
  } else {
    return <div></div>;
  }
}

// function displayOnlineFriends(displaySection: any, relation: IUser) {
// 	if ((relation.relationshipType & UserRelationshipTypes.pending_first_second) &&	// a ajuster
// 		(relation.relationshipType & UserRelationshipTypes.pending_second_first) &&
// 		(relation.status === "Connected") &&
// displaySection.onlineFriends) {
// 		return (
// 			<FriendItem name={relation.name} status={relation.status} imgPath={relation.imgPath} />
// 		)
// 	}
// 	else { return (<div></div>) }
// }

function displayOnlineFriends(displaySection: any, relation: IUser) {
  // FAKE - For Testing
  if (
    relation.relationshipType & UserRelationshipType.pending_first_second && // a ajuster
    relation.status === "Connected" &&
    displaySection.onlineFriends
  ) {
    return (
      <FriendItem
        name={relation.name}
        status={relation.status}
        imgPath={relation.imgPath}
      />
    );
  } else {
    return <div></div>;
  }
}

function displayofflineFriends(displaySection: any, relation: IUser) {
  if (
    relation.relationshipType & UserRelationshipType.pending_first_second && // a ajuster
    relation.relationshipType & UserRelationshipType.pending_second_first &&
    relation.status === "Offline" &&
    displaySection.offlineFriends
  ) {
    return (
      <FriendItem
        name={relation.name}
        status={relation.status}
        imgPath={relation.imgPath}
      />
    );
  } else {
    return <div></div>;
  }
}

function FriendsBar() {
  // const contextValue = React.useContext(App.appContext);
  const contextValue = React.useContext(AppContext);

  const [displaySection, setDisplaySection] = useState({
    pendingRequests: true,
    inGameFriends: true,
    onlineFriends: true,
    offlineFriends: true,
  });

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
      <section className="border-b-2 border-gray-300">
        <button
          className="flex items-center justify-between w-full py-2 pr-4 bg-blue-100 "
          onClick={() =>
            changeSectionDisplayStatus(
              setDisplaySection,
              displaySection,
              "pendingRequests"
            )
          }
        >
          <i
            className={
              "pl-4 fas " +
              (displaySection.pendingRequests
                ? "fa-chevron-down"
                : "fa-chevron-right")
            }
          ></i>
          <h3 className="text-lg text-center first-letter:uppercase">
            friends requests
          </h3>
        </button>
        <ul>
          {contextValue.relationshipsList.map((relation) => (
            <div key={relation.name}>
              {displayPendingRequests(
                displaySection,
                relation,
                contextValue.user!.id
              )}
            </div>
          ))}
        </ul>
      </section>
      <section className="border-b-2 border-gray-300">
        <button
          className="flex items-center justify-between w-full py-2 pr-4 bg-yellow-100"
          onClick={() =>
            changeSectionDisplayStatus(
              setDisplaySection,
              displaySection,
              "inGameFriends"
            )
          }
        >
          <i
            className={
              "pl-4 fas " +
              (displaySection.inGameFriends
                ? "fa-chevron-down"
                : "fa-chevron-right")
            }
          ></i>
          <h3 className="text-lg text-center first-letter:uppercase">
            In game friends
          </h3>
        </button>
        <ul>
          {contextValue.relationshipsList.map((relation) => (
            <div key={relation.name}>
              {displayInGameFriends(displaySection, relation)}
            </div>
          ))}
        </ul>
      </section>
      <section className="border-b-2 border-gray-300">
        <button
          className="flex items-center justify-between w-full py-2 pr-4 bg-green-100"
          onClick={() =>
            changeSectionDisplayStatus(
              setDisplaySection,
              displaySection,
              "onlineFriends"
            )
          }
        >
          <i
            className={
              "pl-4 fas " +
              (displaySection.onlineFriends
                ? "fa-chevron-down"
                : "fa-chevron-right")
            }
          ></i>
          <h3 className="text-lg text-center first-letter:uppercase">
            Online friends
          </h3>
        </button>
        <ul>
          {contextValue.relationshipsList.map((relation) => (
            <div key={relation.name}>
              {displayOnlineFriends(displaySection, relation)}
            </div>
          ))}
        </ul>
      </section>
      <section className="border-b-2 border-gray-300">
        <button
          className="flex items-center justify-between w-full py-2 pr-4 bg-red-100"
          onClick={() =>
            changeSectionDisplayStatus(
              setDisplaySection,
              displaySection,
              "offlineFriends"
            )
          }
        >
          <i
            className={
              "pl-4 fas " +
              (displaySection.offlineFriends
                ? "fa-chevron-down"
                : "fa-chevron-right")
            }
          ></i>
          <h3 className="text-lg text-center first-letter:uppercase">
            Offline friends
          </h3>
        </button>
        <ul>
          {contextValue.relationshipsList.map((relation) => (
            <div key={relation.name}>
              {displayofflineFriends(displaySection, relation)}
            </div>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export default FriendsBar;
