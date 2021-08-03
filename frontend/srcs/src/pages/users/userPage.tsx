import React, { useCallback, useEffect, useState } from "react";
import UserInformation from "../../components/users/userInformation";
import UserStats from "../../components/users/userStats";
import MatchHistory from "../../components/matchHistory/matchHistory";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { UserRole, UserStatus } from "../../models/user/IUser";
import IUserChangeNameFormValues from "../../models/user/ChangeUserName.dto";
import AppContext from "../../AppContext";
import { UserRelationshipType } from "../../models/user/UserRelationship";
import UserPageState from "../../models/user/UserPageState";
import UserWelcome from "../../components/users/userWelcome";
import { ExceptionData } from "../../models/exceptions/ExceptionData";
import { AppUserRelationship } from "../../models/user/AppUserRelationship";
import { IAppContext } from "../../IAppContext";
import Loading from "../../components/loading/loading";
import { useModal } from "../../components/utilities/useModal";
import { TwoFactorSetupModal } from "../../components/users/TwoFactorSetupModal";
import { IMatch } from "../../models/match/IMatch";

const onLoad = async (
  userId: number,
  userInfo: UserPageState,
  setUserInfo: (info: UserPageState) => void
) => {
  try {
    if (!isNaN(userId)) {
      const data = await axios.get("/api/users/" + userId);

      if (JSON.stringify(userInfo.user) !== JSON.stringify(data.data)) {
        setUserInfo({
          ...userInfo,
          doesUserExist: true,
          user: data.data,
        });
      }
    }
  } catch (error) {}
};

// This has been replaced with two factor setup modal
// const handleClickTwoFactorAuth = async (
//   userInfo: UserPageState,
//   setUserInfo: any
// ) => {
//   let newTwoFactorAuthEnabled = !userInfo.user.twoFactorAuthEnabled;
//   try {
//     await axios.patch("/api/users/" + userInfo.user.id, {
//       twoFactorAuthEnabled: newTwoFactorAuthEnabled,
//     });
//     console.log("two factor auth changed to: " + !userInfo.user.twoFactorAuthEnabled);
//     setUserInfo({
//       ...userInfo,
//       user: {
//         ...userInfo.user,
//         twoFactorAuthEnabled: newTwoFactorAuthEnabled,
//       },
//     });
//   } catch (error) {}
// };

// const getProfilePicture = async (pictureId: number) => {
//   try {
//     const data = await axios.get("/uploads/" + pictureId);
//     return data.request.responseURL;
//   } catch (error) {}
// };

// const updateRelationshipState = async (
//   newType: UserRelationshipType,
//   userInfo: UserPageState,
//   setUserInfo: any
// ) => {
//   setUserInfo({
//     ...userInfo,
//     relationshipType: newType,
//   });
// };

type UserPageParams = {
  id: string;
};

function UserPage({ match }: RouteComponentProps<UserPageParams>) {
  const contextValue = React.useContext(AppContext);
  const twoFactorSetupModal = useModal();
  const userId =
    match.params.id !== undefined ? match.params.id : contextValue.user?.id;

  const [userRelationshipsInfo, setUserRelationshipsInfo] = useState<
    AppUserRelationship[]
  >(contextValue.relationshipsList);

  useEffect(() => {
    setUserRelationshipsInfo(contextValue.relationshipsList);
  }, [contextValue.relationshipsList]);

  const [userInfo, setUserInfo] = useState<UserPageState>({
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
      twoFactorAuthEnabled: false,
      firstConnection: true,
      status: UserStatus.Null,
      role: UserRole.User,
      channels: [],
      //idInf: false,
    },
    usernameErrorMessage: "",
  });

  const [matchList, setMatchList] = useState<{ list: IMatch[] }>({ list: [] });

  useEffect(() => {
    const getPlayerName = async (user_id: number): Promise<string> => {
      try {
        const dataUser = await axios.get(`/api/users/${user_id}`);
        // console.log('dataUser', dataUser)
        return dataUser.data.name;
      } catch (error) {
        console.log(error);
        return "Unknown player";
      }
    };

    const getAllMatches = async () => {
      try {
        const dataMatches = await axios.get<IMatch[]>(
          `/api/matches/user/${userId}`
        );
        if (!dataMatches.data.length) {
          setMatchList({ list: [] });
          return;
        }
        console.log(`matches for user ${userId}`, dataMatches);
        let a: IMatch[] = [];
        dataMatches.data.map(async (match, index) => {
          const inf = userInfo.user.id === Number(match.player_ids[0]);
          let playerNames: string[] = [];
          if (inf) {
            const nameA = await getPlayerName(match.player_ids[0]);
            const nameB = await getPlayerName(match.player_ids[1]);
            playerNames = [nameA, nameB];
          } else {
            const nameA = await getPlayerName(match.player_ids[0]);
            const nameB = await getPlayerName(match.player_ids[1]);
            playerNames = [nameB, nameA];
            const scoreTemp = match.scores[0];
            match.scores[0] = match.scores[1];
            match.scores[1] = scoreTemp;
          }
          a[index] = {
            id: match.id,
            player_ids: match.player_ids,
            scores: match.scores,
            startedAt: match.startedAt,
            endAt: match.endAt,
            playerNames: playerNames,
          };
          setMatchList({ list: a });
        });
      } catch (error) {
        console.log(error);
      }
    };
    getAllMatches();
  }, [userInfo, userId]);

  const onSubmitChangeUsername = async (
    values: IUserChangeNameFormValues,
    userInfo: UserPageState,
    setUserInfo: any,
    setUser: any
  ) => {
    try {
      //const dataUser =
      await axios.patch("/api/users/" + userInfo.user.id, {
        name: values.username,
      });
      // console.log("dataUser", dataUser);
      contextValue.eventSocket?.emit("updateUserInfo-front", {
        name: values.username,
      });

      setUserInfo({
        ...userInfo,
        user: {
          ...userInfo.user,
          name: values.username,
        },
        usernameErrorMessage: "",
      });
      // setUser(dataUser.data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setUserInfo({
            ...userInfo,
            usernameErrorMessage: (error.response?.data as ExceptionData)
              .message,
          });
        }
      }
    }
  };

  const onFileChange = async (
    fileChangeEvent: any,
    userInfo: UserPageState,
    setUserInfo: any,
    setUser: any
  ) => {
    submitForm(fileChangeEvent.target.files[0], userInfo, setUserInfo, setUser);
  };

  const submitForm = async (
    valuesCurrentFile: any,
    userInfo: UserPageState,
    setUserInfo: any,
    setUser: any
  ) => {
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
      await axios.patch("/api/users/" + userInfo.user.id, {
        imgPath: newImgPath,
      });
      // setUser(dataUser.data);

      contextValue.eventSocket?.emit("updateUserInfo-front", {
        imgPath: newImgPath,
      });

      if (oldImgPath !== "default-profile-picture.png") {
        await axios.delete("/api/photos/" + oldImgPath);
      }
    } catch (error) {}
  };

  const updateOnLoad: any = useCallback(() => {
    onLoad(Number(userId), userInfo, setUserInfo);
  }, [userInfo, userId]);

  useEffect(() => {
    updateOnLoad();
  }, [userInfo, userId, updateOnLoad]);

  const updateRelationship = async (
    user_id: number,
    type: UserRelationshipType
  ) => {
    contextValue.eventSocket?.emit("updateRelationship-front", {
      user_id: user_id,
      type: type,
    });
  };

  const addFriend = async (
    id: number,
    userInfoForSearch: any,
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
    userInfoForSearch: any,
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
    userInfoForSearch: any,
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
    userInfoForSearch: any,
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

  // TODO: Should this be a 404 page?
  if (!userInfo.doesUserExist) {
    return (
      <div className="justify-center px-2 py-2 font-bold text-center">
        <Loading />
        <span className="relative grid pt-16">This user does not exist</span>
      </div>
    );
  }

  let isMe = false;
  if (contextValue.user !== undefined) {
    isMe =
      match.params.id === undefined ||
      Number(userInfo.user.id) === Number(contextValue.user.id);
  }

  let idInf = false;
  if (contextValue.user !== undefined) {
    idInf = contextValue.user.id < userInfo.user.id;
  }

  // const contextValue = React.useContext(AppContext);

  return (
    <div className="overflow-y-scroll h-full">
      <section className="mb-8">
        <UserWelcome
          name={userInfo.user.name}
          isMe={isMe}
          firstConnection={userInfo.user.firstConnection}
        />
      </section>
      <section className="flex justify-center ">
        <UserInformation
          id={userInfo.user.id}
          name={userInfo.user.name}
          status={userInfo.user.status}
          nbWin={userInfo.user.nbWin}
          nbLoss={userInfo.user.nbLoss}
          imgPath={userInfo.user.imgPath}
          isMe={isMe}
          relationshipsList={contextValue.relationshipsList} // A Gerer au niveau de l'update
          idInf={idInf}
          // isFriend
          twoFactorAuthEnabled={userInfo.user.twoFactorAuthEnabled}
          handleClickTwoFactorAuth={twoFactorSetupModal.show}
          onFileChange={onFileChange}
          addFriend={addFriend}
          removeFriend={removeFriend}
          blockUser={blockUser}
          unblockUser={unblockUser}
          changeUsername={onSubmitChangeUsername}
          usernameErrorMessage={userInfo.usernameErrorMessage}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
        <TwoFactorSetupModal
          visible={twoFactorSetupModal.visible}
          hide={(enabled?) => {
            if (enabled !== undefined) {
              setUserInfo({
                ...userInfo,
                ...{
                  user: { ...userInfo.user, twoFactorAuthEnabled: enabled },
                },
              });
            }
            twoFactorSetupModal.hide();
          }}
          twoFactorAuthEnabled={userInfo.user.twoFactorAuthEnabled}
        />
      </section>
      <div className="flex flex-wrap items-center justify-center w-full space-x-8">
        <section className="">
          <UserStats
            nbWin={userInfo.user.nbWin}
            nbLoss={userInfo.user.nbLoss}
          />
        </section>
        <section className="mb-8">
          <MatchHistory
            // id={userInfo.user.id}
            name={userInfo.user.name}
            matchList={matchList.list}
          />
        </section>
      </div>
    </div>
  );
}

export default UserPage;
