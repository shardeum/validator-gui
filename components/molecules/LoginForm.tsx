import { SetStateAction, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { EyeIcon } from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { GeistSans } from "geist/font";
import { authService, isFirstTimeUserKey } from "../../services/auth.service";
import { useRouter } from "next/router";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState } = useForm();
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    if (isInputVisible) {
      setIsInputVisible(false);
    } else {
      setIsInputVisible(true);
    }
  };

  const [apiError, setApiError] = useState<Error | null>(null);

  const router = useRouter();
  const login = authService.useLogin();

  const isFirstTimeUser = () => {
    return localStorage.getItem(isFirstTimeUserKey) === "true";
  };

  async function onSubmit({ password }: FieldValues) {
    setApiError(null);

    try {
      await login(password);
      if (isFirstTimeUser()) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    } catch (error) {
      setApiError(error as SetStateAction<Error | null>);
    }
  }

  return (
    <div className="flex flex-col shadow-md border border-gray-100 rounded-md px-2 py-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <label className={GeistSans.className + " block"}>
          <span className="text-gray-900 font-light bg-white">Password</span>
        </label>
        <div>
          <div
            className={
              "flex items-center py-2 px-3 rounded-md border border-b-2 bg-white " +
              (isActive ? "border-b-indigo-500" : "")
            }
          >
            <div className="w-full flex justify-between">
              <input
                type={isInputVisible ? "text" : "password"}
                placeholder="Enter password here"
                className="outline-none flex-1 bg-white"
                {...register("password")}
                onChange={(e) => {
                  const password = e.target.value;
                  if (password.length > 0) {
                    setIsActive(true);
                  } else {
                    setIsActive(false);
                  }
                }}
              />
              <span>
                {isInputVisible ? (
                  <EyeIcon
                    className="cursor-pointer h-4 ml-2"
                    onClick={handleToggle}
                  />
                ) : (
                  <EyeSlashIcon
                    className="cursor-pointer h-4 ml-2"
                    onClick={handleToggle}
                  />
                )}
              </span>
            </div>
          </div>
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
            disabled={formState.isSubmitting}
            className={
              (isActive ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300") +
              " text-white text-sm font-semibold py-2 px-4 w-40 rounded-md flex justify-center " +
              GeistSans.className
            }
            type="submit"
          >
            {formState.isSubmitting ? (
              <ArrowPathIcon className="w-5 spinner" />
            ) : (
              "Connect Securely"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
