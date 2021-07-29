import axios from "axios";
import { useForm } from "react-hook-form";
import urljoin from "url-join";
import { TwoFactorAuthenticationCodeDto } from "../../models/authentication/TwoFactorAuthenticationCode.dto";
import { ExceptionData } from "../../models/exceptions/ExceptionData";
import { Modal } from "../utilities/Modal";
import { TextInput } from "../utilities/TextInput";

export type TwoFactorSetupModalProps = {
  visible: boolean;
  hide: (enabled?: boolean) => void;
  title?: string;
  twoFactorAuthEnabled: boolean;
};

export function TwoFactorSetupModal({
  visible,
  hide,
  title,
  twoFactorAuthEnabled,
}: TwoFactorSetupModalProps) {
  console.log("2fa", twoFactorAuthEnabled);

  const message = !twoFactorAuthEnabled
    ? "To enable 2FA, please scan this code using Google Authenticator, then enter the generated code."
    : "To disable 2FA, please enter the code generated by Google Authenticator.";

  const submitLabel = !twoFactorAuthEnabled ? "Enable 2FA" : "Disable 2FA";

  const submitPath = !twoFactorAuthEnabled ? "enable" : "disable";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TwoFactorAuthenticationCodeDto>();

  const onSubmit = async (data: TwoFactorAuthenticationCodeDto) => {
    try {
      await axios.post(urljoin("/api/2fa/", submitPath), data);
      hide(!twoFactorAuthEnabled);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          setError(
            "twoFactorAuthCode",
            {
              message: (e.response.data as ExceptionData).message,
            },
            { shouldFocus: true }
          );
        }
      }
    }
  };

  return (
    <Modal
      visible={visible}
      hide={hide}
      title={title}
      className="max-w-xl p-4 m-auto bg-white rounded-sm"
    >
      <div className="flex gap-2">
        {!twoFactorAuthEnabled && (
          <img
            className="object-scale-down"
            alt="oauth qr-code"
            src="/api/2fa/generate"
          />
        )}
        <form
          className="flex flex-col justify-around flex-shrink gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p>{message}</p>
          <TextInput
            register={register}
            name="twoFactorAuthCode"
            placeholder="XXX XXX"
            error={errors.twoFactorAuthCode}
            required
            noLabel
          />
          <input
            type="submit"
            value={submitLabel}
            className={
              "rounded-xl text-neutral font-semibold p-2 w-full text-lg bg-secondary hover:bg-secondary-dark"
            }
          ></input>
        </form>
      </div>
    </Modal>
  );
}

TwoFactorSetupModal.defaultProps = {
  title: "Two-Factor Authentication",
};
