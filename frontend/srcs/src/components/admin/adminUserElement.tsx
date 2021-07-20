import { NavLink } from "react-router-dom";
import { UserRole } from "../../models/user/IUser";
import CustomButton from "../utilities/CustomButton";

type UserElementProps = {
  id: number;
  name: string;
  role: UserRole;
  myRole?: UserRole;
  banUser: any;
  unbanUser: any;
  setAdmin: any;
  unsetAdmin: any;
  isChannelUserElement?: boolean | false;
  adminInfo: any;
  setAdminInfo: any;
};

function displayRole(role: UserRole) {
  // axios.patch("/api/users/1", { "role": 2 });

  const divClass = "italic text-sm ";
  switch (role) {
    case UserRole.owner:
      return (
        <div className={divClass + "text-blue-600 font-semibold"}>Owner</div>
      );
    case UserRole.admin:
      return <div className={divClass + "text-green-600"}>Admin</div>;
    case UserRole.ban:
      return <div className={divClass + "text-red-600"}>Banned</div>;
    default:
      return <div className={divClass + "text-gray-700"}>standard</div>;
  }
}

function isMyRoleAbove(user: UserElementProps) {
  let myRole = user.myRole;
  let role = user.role;
  if (user.isChannelUserElement) {
    return true;
  }
  if (myRole !== undefined && myRole & UserRole.owner && !(role & UserRole.owner)) {
    return true;
  }
  if (
    myRole === UserRole.admin &&
    role !== UserRole.owner &&
    role !== UserRole.admin
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
        !(user.role & UserRole.ban) ? (
          <CustomButton
            content="Ban user"
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
            content="Unban user"
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

function displayAdminButton(user: UserElementProps) {
  const setAdmin = async (id: number) => {
    await user.setAdmin(id, user.adminInfo, user.setAdminInfo);
  };

  const unsetAdmin = async (id: number) => {
    await user.unsetAdmin(id, user.adminInfo, user.setAdminInfo);
  };

  if (!(user.role & UserRole.ban) && isMyRoleAbove(user) &&
    user.myRole !== undefined && user.myRole & UserRole.owner) {
    return (
      <div className="relative inline-flex items-center justify-center w-32 h-6 text-center">
        {!(user.role & UserRole.owner) ? (
          !(user.role & UserRole.admin) ? (
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
        {displayBanButton(user)}
      </div>
    </div>
  );
}

export default AdminUserElement;
