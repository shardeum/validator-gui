import { fetcher } from './fetcher';
import { useGlobals } from '../utils/globals';
import { useContext, useState } from 'react';
import { hashSha256 } from '../utils/sha256-hash';
import { ToastContext } from '../components/ToastContextProvider';

export type ChangePasswordResult = {
  isLoading: boolean,
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

export const usePassword = (): ChangePasswordResult => {
  const {apiBase} = useGlobals()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { showErrorMessage } = useContext(ToastContext);
  const {showTemporarySuccessMessage, showTemporaryErrorMessage} = useContext(ToastContext);

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    setIsLoading(true)
    if(currentPassword === newPassword){
      showTemporaryErrorMessage("The new password must differ from the existing password.")
      setIsLoading(false)
      return;
    }
    try {
      const currentPwSha256digest = await hashSha256(currentPassword)
      const newPwSha256digest = await hashSha256(newPassword)
      await fetcher(`${apiBase}/api/password`, {
        method: 'POST',
        body: JSON.stringify({currentPassword: currentPwSha256digest, newPassword: newPwSha256digest})
      }, showErrorMessage)
      showTemporarySuccessMessage('Password changed successfully!')
    } catch (e) {
      console.error(e)
      if (typeof e === 'string') {
        showTemporaryErrorMessage(e)
      }
    }
    setIsLoading(false)
  }

  return {
    isLoading,
    changePassword
  }
};
