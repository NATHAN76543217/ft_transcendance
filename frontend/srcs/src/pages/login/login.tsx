import { TextInput } from "../../components/utilities/TextInput";
import Button from "../../components/utilities/Button";

import { RouteComponentProps, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import urljoin from "url-join";
import { useContext } from "react";
import AppContext from "../../AppContext";
import axios from "axios";
import { AuthenticatedUser } from "../../models/user/AuthenticatedUser";
import { UserStatus } from "../../models/user/IUser";
interface ILoginFormValues {
  username: string;
  password: string;
}

type LoginPageParams = {
  redirPath?: string;
};

type LoginPageProps = RouteComponentProps<LoginPageParams>;

export default function Login({ match }: LoginPageProps) {
  const history = useHistory();
  const { setUser } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginFormValues>();

  const onSubmit = async (values: ILoginFormValues) => {
    try {
      const { data } = await axios.post<AuthenticatedUser>(
        "/api/authentication/login",
        { name: values.username, password: values.password },
        { withCredentials: true }
      );
      console.log("Setting user data: ", data);

      setUser(data);

      const dataUpdate = await axios.patch(
        `/api/users/${data.id}`,
        { status: UserStatus.online }
      );
      // console.log("data Update login: ",dataUpdate)

      const url = match.params.redirPath
        ? urljoin("/", match.params.redirPath)
        : "/";
      console.log(`Redirecting to ${url}...`);
      history.push(url);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const details = error.response.data as {
            statusCode: number;
            message: string;
          };
          setError(
            "password",
            { message: details.message },
            { shouldFocus: true }
          );
        } else
          setError(
            "password",
            { message: error.message },
            { shouldFocus: true }
          );
      } else {
        console.error(error);
        setError(
          "password",
          { message: "Please try again later." },
          { shouldFocus: false }
        );
      }
    }
  };

  return (
    <section className="flex flex-col max-w-sm p-4 m-auto mt-32 rounded-xl bg-neutral">
      <div className="mb-8">
        <h1 className="m-4 text-6xl text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="username"
            register={register}
            required={true}
            error={errors.username}
          ></TextInput>
          <TextInput
            name="password"
            register={register}
            type="password"
            required={true}
            error={errors.password}
          ></TextInput>
          <input
            type="submit"
            value="Login"
            className={
              "rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary hover:bg-secondary-dark"
            }
          ></input>
        </form>
      </div>
      <div className="flex items-center">
        {/* <button type="button" onClick={() => {
        const newTab = window.open("https://localhost/api/authentication/oauth2/school42");
      }}>
      content="Login with 42"
    </button> */}
        {/* TODO up: button with new tab    bellow: button on the same tab */}
        <Button
          content="Login with 42"
          url="https://localhost/api/authentication/oauth2/school42"
          className="bg-gray-400 whitespace-nowrap hover:bg-gray-500"
        />
        <Button
          content="Login with Google"
          url="https://localhost/api/authentication/oauth2/google"
          className="bg-gray-400 whitespace-nowrap hover:bg-gray-500"
        />
      </div>
    </section>
  );
}
