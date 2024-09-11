import { SetStateAction, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GeistSans } from "geist/font";
import { authService, isFirstTimeUserKey } from "../../services/auth.service";
import { useRouter } from "next/router";
import { PasswordInput } from "../atoms/PasswordInput";
import { useGlobals } from "../../utils/globals";
import { useDevice } from "../../context/device";

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();
  const [isInputActive, setIsInputActive] = useState(false);
  const passwordInput = watch("password");

  const [apiError, setApiError] = useState<Error | null>(null);
  const { apiBase } = useGlobals();

  const router = useRouter();
  const { isMobile } = useDevice();

  const isFirstTimeUser = () => {
    return localStorage.getItem(isFirstTimeUserKey) !== "false";
  };

  useEffect(() => {
    if (passwordInput && passwordInput.length > 0) {
      setIsInputActive(true);
    } else {
      setIsInputActive(false);
    }
  }, [passwordInput]);

  async function onSubmit({ password }: FieldValues) {
    setApiError(null);
    await authService
      .login(apiBase, password)
      .then(() => {
        if (isFirstTimeUser() && !isMobile) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        setApiError(error as SetStateAction<Error | null>);
      });
  }

  return (
    <div className="flex flex-col shadow-md bg-white border border-gray-100 rounded-md px-2 py-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <label className={GeistSans.className + " block"}>
          <span className="text-gray-900 font-light bg-white">Password</span>
        </label>
        <div>
          <PasswordInput
            inputProps={register("password")}
            isInputActive={isInputActive}
            setIsInputActive={setIsInputActive}
          />
          {apiError && (
            <div className="flex text-red-600 items-center mb-5 mt-1">
              <div className={"font-normal text-xs " + GeistSans.className}>
                {apiError.message}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            disabled={isSubmitting || !isInputActive}
            className={
              (isInputActive && !isSubmitting
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-300") +
              " text-white text-sm font-semibold py-2 px-4 w-40 rounded-md flex justify-center items-center ease-in-out duration-300 " +
              GeistSans.className
            }
            type="submit"
          >
            {isSubmitting ? (
              <>
                <div className="spinner mr-2">
                  <div className="border-2 border-white border-t-transparent rounded-full h-4 w-4 animate-spin"></div>
                </div>
                Logging in...
              </>
            ) : (
              "Connect Securely"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
