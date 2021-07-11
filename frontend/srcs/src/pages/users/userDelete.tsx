import React from "react";

import UserDeleteForm from "../../components/Forms/userDeleteForm";
import axios from "axios";
import { IUser } from "../../models/user/IUser";
import IUserDeleteFormValues from "../../models/user/DeleteUser.dto";

interface UserProps {
  id?: number;
  isMe?: boolean | false;
}

interface UserStates {
  list: IUser[];
  username: string;
}

class UserDelete extends React.Component<UserProps, UserStates> {
  constructor(props: UserProps) {
    super(props);
    this.state = {
      list: [],
      username: "",
    };
  }

  onSubmit = async (values: IUserDeleteFormValues) => {
    try {
      const data = await axios.delete("/api/users/" + values.id);
      console.log(data);
    } catch (error) {}
  };

  render() {
    return (
      <div className="">
        <UserDeleteForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default UserDelete;
