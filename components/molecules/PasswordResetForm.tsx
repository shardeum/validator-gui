import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { usePassword } from "../../hooks/usePasswordChange";
import { Card } from "../layouts/Card";
import { PasswordInput } from "../atoms/PasswordInput";
import { GeistSans } from "geist/font";

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const PasswordResetForm = () => {
  const { register, handleSubmit, formState, setError, reset } =
    useForm<FormData>({
      mode: "onChange",
    });
  const { changePassword, isLoading } = usePassword();
  const [isCurrentPasswordInputActive, setIsCurrentPasswordInputActive] =
    useState(false);
  const [isNewPasswordInputActive, setIsNewPasswordInputActive] =
    useState(false);
  const [isConfirmNewPasswordInputActive, setIsConfirmNewPasswordInputActive] =
    useState(false);

  const [areAllInputsActive, setAreAllInputsActive] = useState(false);

  const resetForm = () => {
    reset();
    setIsCurrentPasswordInputActive(false);
    setIsNewPasswordInputActive(false);
    setIsConfirmNewPasswordInputActive(false);
  };

  useEffect(() => {
    setAreAllInputsActive(
      isCurrentPasswordInputActive &&
        isNewPasswordInputActive &&
        isConfirmNewPasswordInputActive
    );
  }, [
    isCurrentPasswordInputActive,
    isNewPasswordInputActive,
    isConfirmNewPasswordInputActive,
  ]);

  const onSubmit = async (data: FormData) => {
    if (data.confirmNewPassword != data.newPassword) {
      setError(
        `confirmNewPassword`,
        { message: "Doesn't match the New Password" },
        { shouldFocus: true }
      );
    } else {
      await changePassword(data.currentPassword, data.newPassword);
      resetForm();
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <span className="font-semibold">Password Reset</span>
      <Card>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full p-5 flex flex-col gap-y-4"
        >
          <div className="flex flex-col justify-between gap-y-1">
            <label htmlFor="currentPassword" className="text-xs">
              Enter Current Password
            </label>
            <PasswordInput
              inputProps={register("currentPassword", {
                required: "This field is required",
              })}
              isInputActive={isCurrentPasswordInputActive}
              setIsInputActive={setIsCurrentPasswordInputActive}
            />
            <span className="text-right text-sm text-warning">
              {formState.errors.currentPassword && (
                <p>{formState.errors.currentPassword.message}</p>
              )}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-y-1">
            <label htmlFor="newPassword" className="text-xs">
              Enter New Password
            </label>
            <PasswordInput
              inputProps={register("newPassword", {
                required: "This field is required",
              })}
              isInputActive={isNewPasswordInputActive}
              setIsInputActive={setIsNewPasswordInputActive}
            />
            <span className="text-right text-sm text-warning">
              {formState.errors.newPassword && (
                <p>{formState.errors.newPassword.message}</p>
              )}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-y-1">
            <label htmlFor="confirmNewPassword" className="text-xs">
              Re-Enter New Password
            </label>
            <PasswordInput
              inputProps={register("confirmNewPassword", {
                required: "This field is required",
              })}
              isInputActive={isConfirmNewPasswordInputActive}
              setIsInputActive={setIsConfirmNewPasswordInputActive}
            />
            <span className="text-right text-sm text-warning">
              {formState.errors.confirmNewPassword && (
                <p>{formState.errors.confirmNewPassword.message}</p>
              )}
            </span>
          </div>

          <div className="flex justify-end">
            {!formState.isSubmitting && (
              <button
                disabled={
                  formState.isSubmitting || !areAllInputsActive || isLoading
                }
                className={
                  (areAllInputsActive
                    ? "bg-primary hover:bg-indigo-700"
                    : "bg-gray-300") +
                  " text-white text-sm font-semibold py-2 px-4 w-40 rounded-md flex justify-center ease-in-out duration-300 " +
                  GeistSans.className
                }
                type="submit"
              >
                Reset Password
              </button>
            )}
            {formState.isSubmitting && (
              <button
                className="border border-gray-300 rounded px-4 py-2 w-40 flex items-center justify-center text-sm font-medium"
                disabled={true}
              >
                <div className="spinner flex items-center justify-center mr-3">
                  <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                </div>{" "}
                Confirming
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PasswordResetForm;
