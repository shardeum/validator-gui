import useSWR from 'swr'
import { fetcher } from './fetcher';
import { authService } from '../services/auth.service';
import { useGlobals } from '../utils/globals';

export const useNodeLogs = (): { isLoading: boolean; isError: boolean; downloadLog: (logName: string) => void; logs: string[] | undefined } => {
  const {apiBase} = useGlobals()
  const {data, error, isLoading} = useSWR(`${apiBase}/api/node/logs`, fetcher)

  const downloadLog = (logName: string) => {
    fetch(`${apiBase}/api/node/logs/${logName}`, {
      method: 'GET',
      headers: {"X-Api-Token": authService.authToken!},
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', logName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  }

  return {
    logs: data,
    isLoading: false,
    isError: false,
    downloadLog
  }
};
