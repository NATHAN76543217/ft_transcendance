import { TextInput } from "../../components/utilities/TextInput";
import Button from "../../components/utilities/Button";

import { RouteComponentProps, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import urljoin from "url-join";
import { useContext } from "react";
import AppContext from "../../AppContext";
import axios from "axios";
import { ExceptionData } from "../../models/exceptions/ExceptionData";
import { IUser } from "../../models/user/IUser";
import { TwoFactorAuthenticationCodeDto } from "../../models/authentication/TwoFactorAuthenticationCode.dto";

type TwoFactorAuthPageParams = {
  redirPath?: string;
};

type TwoFactorAuthPageProps = RouteComponentProps<TwoFactorAuthPageParams>;

export default function TwoFactorAuth({ match }: TwoFactorAuthPageProps) {
  const history = useHistory();
  const { setUserInit } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TwoFactorAuthenticationCodeDto>();

  const onSubmit = async (values: TwoFactorAuthenticationCodeDto) => {
    try {
      const { data } = await axios.post<IUser>("/api/2fa/authenticate", values);

      console.log("Setting user data: ", data);

      setUserInit(data);

      // TODO
      const redirPath =
        data.imgPath === "default-profile-picture.png" ? "users" : "";

      const url = redirPath ? urljoin("/", redirPath) : "/";
      // const url = match.params.redirPath
      // ? urljoin("/", match.params.redirPath)
      // : "/";
      console.log(`Redirecting to ${url}...`);
      history.push(url);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const details = error.response.data as ExceptionData;
          setError(
            "twoFactorAuthCode",
            { message: details.message },
            { shouldFocus: true }
          );
        } else
          setError(
            "twoFactorAuthCode",
            { message: error.message },
            { shouldFocus: true }
          );
      } else {
        console.error(error);
        setError(
          "twoFactorAuthCode",
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
            name="twoFactorAuthCode"
            register={register}
            required={true}
            error={errors.twoFactorAuthCode}
            labelName="2FA-Code"
            placeholder="XXX XXX"
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
