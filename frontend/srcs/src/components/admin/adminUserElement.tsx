import { NavLink } from "react-router-dom";
import { ChannelRelationshipType } from "../../models/channel/ChannelRelationship";
import { UserRole } from "../../models/user/IUser";
import CustomButton from "../utilities/CustomButton";

type UserElementProps = {
  id: number;
  name: string;
  role: UserRole | ChannelRelationshipType;
  myRole?: UserRole | undefined | ChannelRelationshipType;
  banUser: any;
  unbanUser: any;
  muteUser: any;
  unmuteUser: any;
  kickUser: any;
  setAdmin: any;
  unsetAdmin: any;
  isChannelUserElement?: boolean | false;
  adminInfo: any;
  setAdminInfo: any;
};

function displayRole(role: UserRole | ChannelRelationshipType) {
  const divClass = "italic text-sm ";
  switch (role) {
    case UserRole.Owner:
      return (
        <div className={divClass + "text-blue-600 font-semibold"}>Owner</div>
      );
    case UserRole.Admin:
      return <div className={divClass + "text-green-600"}>Admin</div>;
    case UserRole.Banned:
      return <div className={divClass + "text-red-600"}>Banned</div>;
    case ChannelRelationshipType.Muted:
      return <div className={divClass + "text-purple-600"}>Muted</div>;
    default:
      return <div className={divClass + "text-gray-700"}>standard</div>;
  }
}

function isMyRoleAbove(user: UserElementProps) {
  let myRole = user.myRole;
  let role = user.role;
  if (
    myRole !== undefined &&
    myRole & UserRole.Owner &&
    !(role & UserRole.Owner)
  ) {
    return true;
  }
  if (
    myRole === UserRole.Admin &&
    role !== UserRole.Owner &&
    role !== UserRole.Admin
  ) {
    return true;
  }
  return false;
}

function displayBanButton(user: UserElementProps) {
  const banUser = async (id: number) => {
    await user.banUser(id, user.adminInfo, user.setAdminInfo);
  };

  const unbanUser = async (id: number) => {
    await user.unbanUser(id, user.adminInfo, user.setAdminInfo);
  };

  return (
    <div className="relative inline-flex items-center justify-center w-24 h-6 text-center">
      {isMyRoleAbove(user) ? (
        !(user.role & UserRole.Banned) ? (
          <CustomButton
            content="Ban"
            // url="/users/block"
            onClickFunctionId={banUser}
            argId={user.id}
            bg_color="bg-unset"
            // bg_hover_color="bg-secondary-dark"
            dark_text
            text_size="text-sm"
          />
        ) : (
          <CustomButton
            content="Unban"
            // url="/users/unblock"
            onClickFunctionId={unbanUser}
            argId={user.id}
            bg_color="bg-secondary"
            // bg_hover_color="bg-unset-dark"
            dark_text
            text_size="text-sm"
          />
        )
      ) : (
        <div className="relative inline-flex items-center justify-center w-32 h-6 text-center"></div>
      )}
    </div>
  );
}

function displayMuteButton(user: UserElementProps) {
  const muteUser = async (id: number) => {
    await user.muteUser(id, user.adminInfo, user.setAdminInfo);
  };

  const unmuteUser = async (id: number) => {
    await user.unmuteUser(id, user.adminInfo, user.setAdminInfo);
  };
  if (user.isChannelUserElement) {
    return (
      <div className="relative inline-flex items-center justify-center w-24 h-6 text-center">
        {isMyRoleAbove(user) ? (
          !(user.role & ChannelRelationshipType.Muted) ? (
            <CustomButton
              content="Mute"
              // url="/users/block"
              onClickFunctionId={muteUser}
              argId={user.id}
              bg_color="bg-purple-400"
              // bg_hover_color="bg-secondary-dark"
              dark_text
              text_size="text-sm"
            />
          ) : (
            <CustomButton
              content="Unmute"
              // url="/users/unblock"
              onClickFunctionId={unmuteUser}
              argId={user.id}
              bg_color="bg-secondary"
              // bg_hover_color="bg-unset-dark"
              dark_text
              text_size="text-sm"
            />
          )
        ) : (
          <div className="relative inline-flex items-center justify-center w-32 h-6 text-center"></div>
        )}
      </div>
    );
  }
}

function displayKickButton(user: UserElementProps) {
  const kickUser = async (id: number) => {
    await user.kickUser(id, user.adminInfo, user.setAdminInfo);
  };

  if (user.isChannelUserElement) {
    return (
      <div className="relative inline-flex items-center justify-center w-24 h-6 text-center">
        {isMyRoleAbove(user) ? (
          <CustomButton
            content="Kick"
            // url="/users/block"
            onClickFunctionId={kickUser}
            argId={user.id}
            bg_color="bg-unset"
            // bg_hover_color="bg-secondary-dark"
            dark_text
            text_size="text-sm"
          />
        ) : (
          <div className="relative inline-flex items-center justify-center w-32 h-6 text-center"></div>
        )}
      </div>
    );
  }
}

function displayAdminButton(user: UserElementProps) {
  const setAdmin = async (id: number) => {
    await user.setAdmin(id, user.adminInfo, user.setAdminInfo);
  };

  const unsetAdmin = async (id: number) => {
    await user.unsetAdmin(id, user.adminInfo, user.setAdminInfo);
  };

  if (
    !(user.role & UserRole.Banned) &&
    isMyRoleAbove(user) &&
    user.myRole !== undefined &&
    user.myRole & UserRole.Owner
  ) {
    return (
      <div className="relative inline-flex items-center justify-center w-32 h-6 text-center">
        {!(user.role & UserRole.Owner) ? (
          !(user.role & UserRole.Admin) ? (
            <CustomButton
              content="Set admin"
              // url="/users/block"
              onClickFunctionId={setAdmin}
              argId={user.id}
              bg_color="bg-secondary"
              // bg_hover_color="bg-secondary-dark"
              dark_text
              text_size="text-sm"
            />
          ) : (
            <CustomButton
              content="Unset admin"
              // url="/users/unblock"
              onClickFunctionId={unsetAdmin}
              argId={user.id}
              bg_color="bg-unset"
              // bg_hover_color="bg-unset-dark"
              dark_text
              text_size="text-sm"
            />
          )
        ) : (
          <div />
        )}
      </div>
    );
  } else {
    return (
      <div className="relative inline-flex items-center justify-center w-32 h-6 text-center"></div>
    );
  }
}

function AdminUserElement(user: UserElementProps) {
  return (
    <div className="inline-flex h-8 ">
      <div className="flex">
        <div className="flex justify-center w-24">{displayRole(user.role)}</div>
        <div className="w-44">
          <NavLink
            to={"/users/" + user.id}
            className="font-bold text-md whitespace-nowrap hover:underline"
          >
            {user.name}
          </NavLink>
        </div>
      </div>
      <div className={"flex w-56"}>
        {displayAdminButton(user)}
        {displayMuteButton(user)}
        {displayKickButton(user)}
        {displayBanButton(user)}
      </div>
    </div>
  );
}

AdminUserElement.defaultProps = {
  muteUser: () => {},
  unmuteUser: () => {},
  kickUser: () => {},
};

export default AdminUserElement;
