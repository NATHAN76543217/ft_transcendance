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



const setFriendAndBlockBoolean = async (searchInfo: UserSearchState, setSearchInfo: any, contextValue: IAppContext) => {
  searchInfo.list.map(async (elem, index) => {
    let user = elem.user
    let idInf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(user.id));
    try {
      let request = idInf ?
        "/api/users/relationships/" + contextValue.user?.id + "/" + user.id :
        "/api/users/relationships/" + user.id + "/" + contextValue.user?.id
      const data = await axios.get(request);
      if (Number(data.data.type) !== Number(elem.relationType)) {
        let a = searchInfo.list.slice();
        a[index].relationType = data.data.type;
        setSearchInfo({
          ...searchInfo,
          list: a
        });
      }
    } catch (error) {
      if (Number(UserRelationshipType.null) !== Number(elem.relationType)) {
        let a = searchInfo.list.slice();
        a[index].relationType = UserRelationshipType.null;
        setSearchInfo({
          ...searchInfo,
          list: a
        });
      }
    }
  });
}

const onSubmit = async (values: IUserSearchFormValues, searchInfo: UserSearchState, setSearchInfo: any, contextValue: IAppContext) => {
  try {
    const data = await axios.get("/api/users?name=" + values.username);
    let a = data.data.slice();
    a.sort((user1: IUser, user2: IUser) =>
      user1.name.localeCompare(user2.name)
    );
    await a.map(async (elem: any, index: number) => {
      a[index] = {
        user: elem,
        relationType: UserRelationshipType.null,
      }
    })
    setSearchInfo({
      list: a,
      username: values.username
    });
  } catch (error) { }
};

const updateRelationshipState = (id: number, newType: UserRelationshipType, userInfoForSearch: UserInfoForSearch, setSearchInfo: any) => {
  let a = userInfoForSearch.user.list.slice();
  let index = a.findIndex((elem) => Number(elem.user.id) === Number(id));
  a[index].relationType = newType;
  setSearchInfo({
    ...userInfoForSearch.user,
    list: a
  });
}

const addFriend = async (id: number, userInfoForSearch: UserInfoForSearch, setSearchInfo: any, contextValue: IAppContext) => {
  let inf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(id));
  try {
    let request = inf ?
      "/api/users/relationships/" + contextValue.user?.id + "/" + id :
      "/api/users/relationships/" + id + "/" + contextValue.user?.id
    const currentRel = await axios.get(request);
    if (
      !(
        inf &&
        currentRel.data.type & UserRelationshipType.pending_first_second
      ) &&
      !(
        !inf &&
        currentRel.data.type & UserRelationshipType.pending_second_first
      )
    ) {
      let newType: UserRelationshipType = currentRel.data.type;
      newType |= inf
        ? UserRelationshipType.pending_first_second
        : UserRelationshipType.pending_second_first;
      try {
        await axios.patch("/api/users/relationships/" + currentRel.data.id, {
          type: newType,
        });
        updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
      } catch (error) { }
    }
  } catch (error) {
    let newType: UserRelationshipType = inf
      ? UserRelationshipType.pending_first_second
      : UserRelationshipType.pending_second_first;
    try {
      await axios.post("/api/users/relationships", {
        user1_id: (inf ? contextValue.user?.id + "" : id + ""),
        user2_id: (inf ? id + "" : contextValue.user?.id + ""),
        type: newType,
      });
      updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
    } catch (error) {
      console.log(error);
    }
  }
}

const removeFriend = async (id: number, userInfoForSearch: UserInfoForSearch, setSearchInfo: any, contextValue: IAppContext) => {
  let inf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(id));
  try {
    let request = inf ?
      "/api/users/relationships/" + contextValue.user?.id + "/" + id :
      "/api/users/relationships/" + id + "/" + contextValue.user?.id
    const currentRel = await axios.get(request);
    if (currentRel.data.type & UserRelationshipType.friends) {
      let newType: UserRelationshipType =
        currentRel.data.type & ~UserRelationshipType.friends;
      try {
        if (newType === UserRelationshipType.null) {
          await axios.delete(
            "/api/users/relationships/" + currentRel.data.id
          );
          updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
        } else {
          await axios.patch(
            "/api/users/relationships/" + currentRel.data.id,
            { type: newType }
          );
          updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
        }
      } catch (error) { }
    }
  } catch (error) { }
}

const blockUser = async (id: number, userInfoForSearch: UserInfoForSearch, setSearchInfo: any, contextValue: IAppContext) => {
  let inf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(id));
  try {
    let request = inf ?
      "/api/users/relationships/" + contextValue.user?.id + "/" + id :
      "/api/users/relationships/" + id + "/" + contextValue.user?.id
    const currentRel = await axios.get(request);
    if (
      !(
        inf && currentRel.data.type & UserRelationshipType.block_first_second
      ) &&
      !(
        !inf && currentRel.data.type & UserRelationshipType.block_second_first
      )
    ) {
      let newType: UserRelationshipType = currentRel.data.type;
      newType |= inf
        ? UserRelationshipType.block_first_second
        : UserRelationshipType.block_second_first;
      try {
        await axios.patch("/api/users/relationships/" + currentRel.data.id, {
          type: newType,
        });
        updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
      } catch (error) { }
    }
  } catch (error) {
    let newType: UserRelationshipType = inf
      ? UserRelationshipType.block_first_second
      : UserRelationshipType.block_second_first;
    try {
      await axios.post("/api/users/relationships", {
        user1_id: (inf ? contextValue.user?.id + "" : id + ""),
        user2_id: (inf ? id + "" : contextValue.user?.id + ""),
        type: newType,
      });
      updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
    } catch (error) { }
  }
}

const unblockUser = async (id: number, userInfoForSearch: UserInfoForSearch, setSearchInfo: any, contextValue: IAppContext) => {
  let inf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(id));
  try {
    let request = inf ?
      "/api/users/relationships/" + contextValue.user?.id + "/" + id :
      "/api/users/relationships/" + id + "/" + contextValue.user?.id
    const currentRel = await axios.get(request);
    if (
      !(
        inf &&
        !(currentRel.data.type & UserRelationshipType.block_first_second)
      ) &&
      !(
        !inf &&
        !(currentRel.data.type & UserRelationshipType.block_second_first)
      )
    ) {
      let newType: UserRelationshipType = currentRel.data.type;
      newType &= inf
        ? ~UserRelationshipType.block_first_second
        : ~UserRelationshipType.block_second_first;
      try {
        if (newType === UserRelationshipType.null) {
          await axios.delete(
            "/api/users/relationships/" + currentRel.data.id
          );
          updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
        } else {
          await axios.patch(
            "/api/users/relationships/" + currentRel.data.id,
            { type: newType }
          );
          updateRelationshipState(id, newType, userInfoForSearch, setSearchInfo);
        }
      } catch (error) { }
    }
  } catch (error) { }
}


type UserInfoForSearch = {
  doesUserExist: boolean,
  user: UserSearchState,
  relationshipType: UserRelationshipType,
  showWrongUsernameMessage: boolean,
}

function UserSearch() {

  const contextValue = React.useContext(AppContext);

  const [searchInfo, setSearchInfo] = useState<UserSearchState>({
    list: [],
    username: ""
  })

  useEffect(() => {
    setFriendAndBlockBoolean(searchInfo, setSearchInfo, contextValue);
  }, [searchInfo]);

  const localOnSubmit = (values: IUserSearchFormValues) => {
    onSubmit(values, searchInfo, setSearchInfo, contextValue);
  }

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
          let isMe = contextValue.user === undefined ? false : (Number(user.id) === Number(contextValue.user.id));
          let idInf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(user.id));
          let userInfo = {
            doesUserExist: true,
            user: searchInfo,
            relationshipType: elem.relationType,
            showWrongUsernameMessage: false,
          }
          return (
            <li key={user.id} className="flex justify-center my-4 rounded-md ">
              <UserInformation
                id={user.id}
                name={user.name}
                status={user.status}
                nbWin={user.nbWin}
                nbLoss={user.nbLoss}
                imgPath={user.imgPath}
                relationshipTypes={elem.relationType}
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
          )
        })}
      </ul>
    </div>
  );
}

export default UserSearch;