import React, { useEffect, useState } from "react";

import UserInformation from "../../components/users/userInformation";
import UserSearchForm from "../../components/Forms/userSearchForm";
import IUserSearchFormValues from "../../models/user/SearchUser.dto";
import axios from "axios";
import { IUser } from "../../models/user/IUser";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import AppContext from "../../AppContext";
import UserSearchState from "../../models/user/UserSearchState";
import { IAppContext } from "../../IAppContext";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";

// const updateRelationshipState = (id: number, newType: UserRelationshipType, userInfoForSearch: UserInfoForSearch, setSearchInfo: any) => {
//   let a = userInfoForSearch.user.list.slice();
//   let index = a.findIndex((elem) => Number(elem.user.id) === Number(id));
//   a[index].relationType = newType;
//   setSearchInfo({
//     ...userInfoForSearch.user,
//     list: a
//   });
// }

type UserInfoForSearch = {
  doesUserExist: boolean;
  user: UserSearchState;
  relationshipType: UserRelationshipType;
  showWrongUsernameMessage: boolean;
};

function UserSearch() {
  const contextValue = React.useContext(AppContext);

  const [searchInfo, setSearchInfo] = useState<UserSearchState>({
    list: [],
    username: "",
  });

  const [userRelationshipsInfo, setUserRelationshipsInfo] = useState<
    AppUserRelationship[]
  >(contextValue.relationshipsList);

  useEffect(() => {
    setUserRelationshipsInfo(contextValue.relationshipsList);
  }, [contextValue.relationshipsList]);

  const onSubmit = async (
    values: IUserSearchFormValues,
    searchInfo: UserSearchState,
    setSearchInfo: any,
    contextValue: IAppContext
  ) => {
    console.log("contextValue", contextValue);
    try {
      const data = await axios.get("/api/users?name=" + values.username);
      console.log("search", data);
      let a = data.data.slice();
      a.sort((user1: IUser, user2: IUser) =>
        user1.name.localeCompare(user2.name)
      );
      await a.map(async (elem: any, index: number) => {
        let relation = userRelationshipsInfo.find((relationElem) => {
          return relationElem.user.id === elem.id;
        });
        const type = relation
          ? relation.relationshipType
          : UserRelationshipType.null;
        a[index] = {
          user: elem,
          relationType: type,
        };
      });
      setSearchInfo({
        list: a,
        username: values.username,
      });
    } catch (error) {}
  };

  const updateRelationship = async (
    user_id: number,
    type: UserRelationshipType
  ) => {
    contextValue.socket?.emit("updateRelationship-front", {
      user_id: user_id,
      type: type,
    });
  };

  const addFriend = async (
    id: number,
    userInfoForSearch: UserInfoForSearch,
    setSearchInfo: any,
    contextValue: IAppContext
  ) => {
    let inf =
      contextValue.user === undefined
        ? false
        : Number(contextValue.user.id) < Number(id);
    let relationship = userRelationshipsInfo.find((relation) => {
      return relation.user.id === id;
    });
    let newType = inf
      ? UserRelationshipType.pending_first_second
      : UserRelationshipType.pending_second_first;
    if (relationship) {
      newType |= relationship.relationshipType;
    }
    updateRelationship(id, newType);
  };

  const removeFriend = async (
    id: number,
    userInfoForSearch: UserInfoForSearch,
    setSearchInfo: any,
    contextValue: IAppContext
  ) => {
    let relationship = userRelationshipsInfo.find((relation) => {
      return relation.user.id === id;
    });
    let newType = UserRelationshipType.null;
    if (relationship) {
      newType = relationship.relationshipType & ~UserRelationshipType.friends;
    }
    updateRelationship(id, newType);
  };

  const blockUser = async (
    id: number,
    userInfoForSearch: UserInfoForSearch,
    setSearchInfo: any,
    contextValue: IAppContext
  ) => {
    let inf =
      contextValue.user === undefined
        ? false
        : Number(contextValue.user.id) < Number(id);
    let relationship = userRelationshipsInfo.find((relation) => {
      return relation.user.id === id;
    });
    let newType = inf
      ? UserRelationshipType.block_first_second
      : UserRelationshipType.block_second_first;
    if (relationship) {
      newType |= relationship.relationshipType;
    }
    updateRelationship(id, newType);
  };

  const unblockUser = async (
    id: number,
    userInfoForSearch: UserInfoForSearch,
    setSearchInfo: any,
    contextValue: IAppContext
  ) => {
    let inf =
      contextValue.user === undefined
        ? false
        : Number(contextValue.user.id) < Number(id);
    let relationship = userRelationshipsInfo.find((relation) => {
      return relation.user.id === id;
    });
    let newType = UserRelationshipType.null;
    if (relationship) {
      const typeToRemove = inf
        ? UserRelationshipType.block_first_second
        : UserRelationshipType.block_second_first;
      newType = relationship.relationshipType & ~typeToRemove;
    }
    updateRelationship(id, newType);
  };

  // const setFriendAndBlockBoolean = async () => {
  //   let a = searchInfo.list.slice();
  //   a.map(async (elem, index) => {
  //     let relation = props.relationshipsList.find((relationElem) => {
  //       return relationElem.user.id === elem.user.id
  //     })
  //     const type = relation ? relation.relationshipType : UserRelationshipType.null
  //     a[index] = {
  //       user: elem.user,
  //       relationType: type,
  //     }
  //   });
  //   setSearchInfo({
  //     ...searchInfo,
  //     list: a
  //   });
  // }

  // const updateFriendAndBlockBoolean: any = useCallback(() => {
  //   setFriendAndBlockBoolean(searchInfo, setSearchInfo, contextValue);
  // }, [searchInfo, contextValue])

  // useEffect(() => {
  //   updateFriendAndBlockBoolean()
  // }, [searchInfo, updateFriendAndBlockBoolean, contextValue])

  // useEffect(() => {
  //   const setFriendAndBlockBoolean = async () => {
  //     let a = searchInfo.list.slice();
  //     a.map(async (elem, index) => {
  //       let relation = props.relationshipsList.find((relationElem) => {
  //         return relationElem.user.id === elem.user.id
  //       })
  //       const type = relation ? relation.relationshipType : UserRelationshipType.null
  //       a[index] = {
  //         user: elem.user,
  //         relationType: type,
  //       }
  //     });
  //     setSearchInfo({
  //       ...searchInfo,
  //       list: a
  //     });
  //   }
  // }, [searchInfo]);

  const localOnSubmit = (values: IUserSearchFormValues) => {
    onSubmit(values, searchInfo, setSearchInfo, contextValue);
  };

  return (
    <div className="flex flex-col ">
      <div className="flex justify-center">
        <UserSearchForm onSubmit={localOnSubmit} />
      </div>
      <ul>
        {searchInfo?.list.map((elem) => {
          // if (!elem) {
          //   return (<div></div>);
          // }
          let user = elem.user;
          let isMe =
            contextValue.user === undefined
              ? false
              : Number(user.id) === Number(contextValue.user.id);
          let idInf =
            contextValue.user === undefined
              ? false
              : Number(contextValue.user.id) < Number(user.id);
          let userInfo = {
            doesUserExist: true,
            user: searchInfo,
            relationshipType: elem.relationType,
            showWrongUsernameMessage: false,
          };
          return (
            <li key={user.id} className="flex justify-center my-4 rounded-md ">
              <UserInformation
                id={user.id}
                name={user.name}
                status={user.status}
                nbWin={user.nbWin}
                nbLoss={user.nbLoss}
                imgPath={user.imgPath}
                relationshipsList={userRelationshipsInfo}
                twoFactorAuthEnabled={user.twoFactorAuthEnabled}
                idInf={idInf}
                addFriend={addFriend}
                removeFriend={removeFriend}
                blockUser={blockUser}
                unblockUser={unblockUser}
                isInSearch
                isMe={isMe}
                userInfo={userInfo}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserSearch;
