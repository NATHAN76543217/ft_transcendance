import React, { useEffect, useState } from "react";
import UserInformation from "../../components/users/userInformation";
import UserStats from "../../components/users/userStats";
import MatchHistory from "../../components/matchHistory/matchHistory";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { IUser, UserRole, UserStatus } from "../../models/user/IUser";
import IUserChangeNameFormValues from "../../models/user/ChangeUserName.dto";
import AppContext from "../../AppContext";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import UserPageState from "../../models/user/UserPageState";



const onLoad = async (userId: number, userInfo: UserPageState, setUserInfo: any, contextValue: any) => {
  try {
    // REVIEW redondance with userId && this.state.user.id
    if (!isNaN(userId)) {
      const data = await axios.get("/api/users/" + userId);

      if (JSON.stringify(userInfo.user) !== JSON.stringify(data.data)) {
        setUserInfo({
          ...userInfo,
          doesUserExist: true,
          user: data.data,
        });
      }

      // setFriendAndBlockBoolean(userInfo, setUserInfo, contextValue);
      if (userInfo.user.id !== 0) {
        await setFriendAndBlockBoolean(userInfo, setUserInfo, contextValue);
      }
    } else {
      // setUserInfo({
      //   ...userInfo,
      //    doesUserExist: false
      //  });
    }
  } catch (error) {
    // setUserInfo({
    //   ...userInfo,
    //    doesUserExist: false
    //  });
  }
};

const handleClickTwoFactorAuth = async (userInfo: UserPageState, setUserInfo: any) => {
  let newTwoFactorAuth = !userInfo.user.twoFactorAuth;
  try {
    await axios.patch("/api/users/" + userInfo.user.id, {
      twoFactorAuth: newTwoFactorAuth,
    });
    console.log(
      "two factor auth changed to: " + !userInfo.user.twoFactorAuth
    );
    setUserInfo({
      ...userInfo,
      user: {
        ...userInfo.user,
        twoFactorAuth: newTwoFactorAuth,
      }
    });
  } catch (error) { }
}



const getProfilePicture = async (pictureId: number) => {
  try {
    const data = await axios.get("/uploads/" + pictureId);
    return data.request.responseURL;
  } catch (error) { }
}

const onFileChange = async (fileChangeEvent: any, userInfo: UserPageState, setUserInfo: any, setUser: any) => {
  submitForm(fileChangeEvent.target.files[0], userInfo, setUserInfo, setUser);
}

const submitForm = async (valuesCurrentFile: any, userInfo: UserPageState, setUserInfo: any, setUser: any) => {
  if (!valuesCurrentFile) {
    return false;
  }

  let formData = new FormData();

  formData.append("photo", valuesCurrentFile, valuesCurrentFile.name);

  try {
    const data = await axios.post("/api/photos/upload", formData);
    let oldImgPath = userInfo.user.imgPath;
    let newImgPath = data.data.path.replace("uploads/", "");
    setUserInfo({
      ...userInfo,
      user: {
        ...userInfo.user,
        imgPath: newImgPath,
      },
    });
    const dataUser = await axios.patch("/api/users/" + userInfo.user.id, {
      imgPath: newImgPath,
    });
    if (oldImgPath !== 'default-profile-picture.png') {
      await axios.delete("/api/photos/" + oldImgPath);
    }
    setUser(dataUser.data)
  } catch (error) { }
}

const setFriendAndBlockBoolean = async (userInfo: UserPageState, setUserInfo: any, contextValue: any) => {

  let idInf = contextValue.user === undefined ? false : (Number(contextValue.user.id) < Number(userInfo.user.id));
  try {
    let request = idInf ?
      "/api/users/relationships/" + contextValue.user?.id + "/" + userInfo.user.id :
      "/api/users/relationships/" + userInfo.user.id + "/" + contextValue.user?.id

    const data = await axios.get(request);

    if (Number(data.data.type) !== Number(userInfo.relationshipType)) {
      let a = { ...userInfo };
      a.relationshipType = data.data.type;
      setUserInfo(
        a
      );
    }
  } catch (error) {
    if (userInfo.relationshipType !== UserRelationshipType.null) {
      let a = { ...userInfo };
      a.relationshipType = UserRelationshipType.null;
      setUserInfo(
        a
      );
    }
  }
}

const updateRelationshipState = async (newType: UserRelationshipType, userInfo: UserPageState, setUserInfo: any) => {
  setUserInfo({
    ...userInfo,
    relationshipType: newType,
  });
}

const addFriend = async (id: number, userInfo: UserPageState, setUserInfo: any, contextValue: any) => {
  // const contextValue = React.useContext(AppContext);
  let inf = contextValue.user ? (contextValue.user.id < id) : false;
  try {
    let request = inf ?
      `/api/users/relationships/${contextValue.user?.id}/${id}` :
      `/api/users/relationships/${id}/${contextValue.user?.id}`
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
        updateRelationshipState(newType, userInfo, setUserInfo);
      } catch (error) { }
    }
  } catch (error) {
    let newType: UserRelationshipType = inf
      ? UserRelationshipType.pending_first_second
      : UserRelationshipType.pending_second_first;
    try {
      await axios.post("/api/users/relationships", {
        user1_id: id + "",
        user2_id: contextValue.user?.id + "",
        type: newType,
      });
      updateRelationshipState(newType, userInfo, setUserInfo);
    } catch (error) { }
  }
}

const removeFriend = async (id: number, userInfo: UserPageState, setUserInfo: any, contextValue: any) => {
  // const contextValue = React.useContext(AppContext);
  let inf = contextValue.user ? (contextValue.user.id < id) : false;
  try {
    let request = inf ?
      `/api/users/relationships/${contextValue.user?.id}/${id}` :
      `/api/users/relationships/${id}/${contextValue.user?.id}`
    const currentRel = await axios.get(request);
    if (currentRel.data.type & UserRelationshipType.friends) {
      let newType: UserRelationshipType =
        currentRel.data.type & ~UserRelationshipType.friends;
      try {
        if (newType === UserRelationshipType.null) {
          await axios.delete(
            "/api/users/relationships/" + currentRel.data.id
          );
          setUserInfo({
            ...userInfo,
            user: {
              ...userInfo.user,
              relationshipType: newType,
            },
          });
        } else {
          await axios.patch(
            "/api/users/relationships/" + currentRel.data.id,
            { type: newType }
          );
          updateRelationshipState(newType, userInfo, setUserInfo);
        }
      } catch (error) { }
    }
  } catch (error) { }
}

const blockUser = async (id: number, userInfo: UserPageState, setUserInfo: any, contextValue: any) => {
  // const contextValue = React.useContext(AppContext);
  let inf = contextValue.user ? (contextValue.user.id < id) : false;
  try {
    let request = inf ?
      `/api/users/relationships/${contextValue.user?.id}/${id}` :
      `/api/users/relationships/${id}/${contextValue.user?.id}`
    const currentRel = await axios.get(request);
    console.log("currentRel : " + currentRel.data);
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
        updateRelationshipState(newType, userInfo, setUserInfo);
      } catch (error) { }
    }
  } catch (error) {
    let newType: UserRelationshipType = inf
      ? UserRelationshipType.block_first_second
      : UserRelationshipType.block_second_first;
    try {
      await axios.post("/api/users/relationships", {
        user1_id: id + "",
        user2_id: contextValue.user?.id,
        type: newType,
      });
      updateRelationshipState(newType, userInfo, setUserInfo);
    } catch (error) { }
  }
}

const unblockUser = async (id: number, userInfo: UserPageState, setUserInfo: any, contextValue: any) => {
  // const contextValue = React.useContext(AppContext);
  let inf = contextValue.user ? (contextValue.user.id < id) : false;
  try {
    let request = inf ?
      `/api/users/relationships/${contextValue.user?.id}/${id}` :
      `/api/users/relationships/${id}/${contextValue.user?.id}`
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
          updateRelationshipState(newType, userInfo, setUserInfo);
        } else {
          await axios.patch(
            "/api/users/relationships/" + currentRel.data.id,
            { type: newType }
          );
          updateRelationshipState(newType, userInfo, setUserInfo);
        }
      } catch (error) { }
    }
  } catch (error) { }
}

const onSubmitChangeUsername = async (values: IUserChangeNameFormValues, userInfo: UserPageState, setUserInfo: any, setUser: any) => {
  try {
    const dataUser = await axios.patch("/api/users/" + userInfo.user.id, {
      name: values.username,
    });

    console.log("dataUser", dataUser)

    setUserInfo({
      ...userInfo,
      user: {
        ...userInfo.user,
        name: values.username,
      },
      showWrongUsernameMessage: false,
    });
    setUser(dataUser.data)
    return true;
  } catch (error) {
    setUserInfo({
      ...userInfo,
      showWrongUsernameMessage: true,
    });
  }
};


type UserPageParams = {
  id: string;
};

function UserPage({
  match,
}: RouteComponentProps<UserPageParams>) {
  const contextValue = React.useContext(AppContext);
  const userId = match.params.id !== undefined ? match.params.id : contextValue.user?.id;

  const [userInfo, setUserInfo] = useState({
    // id: 0,
    doesUserExist: false,
    user: {
      id: 0,
      name: "",
      password: "",
      nbWin: 0,
      nbLoss: 0,
      stats: 0,
      imgPath: "",
      twoFactorAuth: false,
      status: UserStatus.null,
      role: UserRole.null,
      channels: [],
      idInf: false,
    },
    relationshipType: UserRelationshipType.null,
    showWrongUsernameMessage: false,
  })

  useEffect(() => {
    onLoad(Number(userId), userInfo, setUserInfo, contextValue);
  }, [userInfo, userId]);

  if (!userInfo.doesUserExist) {
    return (
      <div className="px-2 py-2 font-bold">This user does not exist</div>
    );
  }

  let isMe = false;
  if (contextValue.user !== undefined) {
    isMe =
      match.params.id === undefined || Number(userInfo.user.id) === Number(contextValue.user.id);
  }

  let idInf = false;
  if (contextValue.user !== undefined) {
    idInf = (contextValue.user.id < userInfo.user.id)
  }

  // const contextValue = React.useContext(AppContext);

  return (
    <div className="">
      <section className="relative w-full">
        <UserInformation
          id={userInfo.user.id}
          name={userInfo.user.name}
          status={userInfo.user.status}
          nbWin={userInfo.user.nbWin}
          nbLoss={userInfo.user.nbLoss}
          imgPath={userInfo.user.imgPath}
          isMe={isMe}
          relationshipTypes={userInfo.relationshipType} // A Gerer au niveau de l'update
          idInf={idInf}
          // isFriend
          twoFactorAuth={userInfo.user.twoFactorAuth}
          handleClickTwoFactorAuth={handleClickTwoFactorAuth}
          onFileChange={onFileChange}
          addFriend={addFriend}
          removeFriend={removeFriend}
          blockUser={blockUser}
          unblockUser={unblockUser}
          changeUsername={onSubmitChangeUsername}
          showWrongUsernameMessage={userInfo.showWrongUsernameMessage}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      </section>
      <div className="relative flex flex-wrap justify-center w-full">
        <section className="relative">
          <UserStats
            nbWin={userInfo.user.nbWin}
            nbLoss={userInfo.user.nbLoss}
          />
        </section>
        <section className="relative">
          <MatchHistory />
        </section>
      </div>
    </div>
  );
}


export default UserPage;
