import React from "react";

import UserCreateForm from "../../components/Forms/userCreateForm";
import axios from "axios";
import { IUser } from "../../models/user/IUser";
import IUserCreateFormValues from "../../models/user/CreateUser.dto";

interface UserProps {
  id?: number;
  isMe?: boolean | false;
}

interface UserState {
  list: IUser[];
  username: string;
}

// interface UserCreateFormData {
//     username: string,
// }

class UserCreate extends React.Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props);
    this.state = {
      list: [],
      username: "",
    };
  }

  onSubmit = async (values: IUserCreateFormValues) => {
    try {
      const data = await axios.post("/api/users", values);
      // console.log(data);
    } catch (error) {}
  };

  render() {
    return (
      <div className="">
        <UserCreateForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default UserCreate;
