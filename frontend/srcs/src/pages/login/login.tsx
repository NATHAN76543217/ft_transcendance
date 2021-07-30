import { TextInput } from "../../components/utilities/TextInput";
import Button from "../../components/utilities/Button";

import { RouteComponentProps, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import urljoin from "url-join";
import { useContext, useState } from "react";
import AppContext from "../../AppContext";
import axios from "axios";
import { ExceptionData } from "../../models/exceptions/ExceptionData";
import { AuthenticationResponseDto } from "../../models/authentication/AuthenticationResponse.dto";
import { IUser } from "../../models/user/IUser";
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
  const { setUserInit } = useContext(AppContext);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginFormValues>();

  const onSubmit = async (values: ILoginFormValues) => {
    try {
      const { data } = await axios.post<AuthenticationResponseDto>(
        "/api/authentication/login",
        { name: values.username, password: values.password }
      );

      if (data.twoFactorAuthEnabled) {
        console.log("2FA required");
        history.push("/login/2fa");
      } else if (data.user !== undefined) {
        const userData: IUser = data.user;
        console.log("Setting user data: ", data.user);

        setUserInit(userData);

        // TODO
        const redirPath =
          userData.firstConnection ? "users" : "";

        const url = redirPath ? urljoin("/", redirPath) : "/";
        // const url = match.params.redirPath
        // ? urljoin("/", match.params.redirPath)
        // : "/";
        console.log(`Redirecting to ${url}...`);
        history.push(url);
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const details = error.response.data as ExceptionData;
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

  const displayShowPasswordButton = (show: boolean, setShow: any) => {
    return (
      <div
        className="absolute items-center justify-between cursor-pointer right-24 top-8"
        onClick={() => setShow(!show)}
      >
        <i className={"fas " + (show ? "fa-eye" : "fa-eye-slash")} />
      </div>
    );
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
            labelName="Username"
          ></TextInput>
          <div className="relative">
            <TextInput
              name="password"
              register={register}
              type={showPassword ? "text" : "password"}
              required={true}
              error={errors.password}
              labelName="Password"
            ></TextInput>
            {displayShowPasswordButton(showPassword, setShowPassword)}
          </div>
          <input
            type="submit"
            value="Login"
            className={
              "rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary hover:bg-secondary-dark"
            }
          ></input>
        </form>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <Button
          content="Login with 42"
          url="https://localhost/api/authentication/oauth2/school42"
          className="px-4 bg-gray-400 whitespace-nowrap hover:bg-gray-500"
        />
        <Button
          content="Login with Google"
          url="https://localhost/api/authentication/oauth2/google"
          className="px-4 bg-gray-400 whitespace-nowrap hover:bg-gray-500"
        />
      </div>
    </section>
  );
}
