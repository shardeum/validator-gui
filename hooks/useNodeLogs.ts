import useSWR from "swr";
import { authService } from "../services/auth.service";
import { useGlobals } from "../utils/globals";
import { useContext } from "react";
import { FetcherContext } from "../components/FetcherContextProvider";
import JSZip from "jszip";

type NodeLogsResponse = {
  isLoading: boolean;
  isError: boolean;
  logs: string[] | undefined;
  downloadLog: Function;
  downloadAllLogs: Function;
};

export const useNodeLogs = (): NodeLogsResponse => {
  const { apiBase } = useGlobals();
  const fetcher = useContext(FetcherContext);

  const { data, error } = useSWR<string[], Error>(
    `${apiBase}/api/node/logs`,
    fetcher
  );

  const downloadLog = (logName: string): void => {
    fetch(`${apiBase}/api/node/logs/${logName}`, {
      method: "GET",
      credentials: 'include'
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", logName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  };

  const downloadAllLogs = async (): Promise<void> => {
    const zip = new JSZip();
    let fileName = "allLogs.zip";

    if (data && data.length > 0) {
      for (const logName of data) {
        try {
          const response = await fetch(`${apiBase}/api/node/logs/${logName}`, {
            method: "GET",
            credentials: 'include'
          });

          if (!response.ok) {
            // Handle unsuccessful fetch by adding a log with the "downloaderror" prefix
            const errorLogName = `downloaderror_${logName}`;
            const errorText = `Failed to download ${logName}: ${response.statusText}`;
            zip.file(errorLogName, errorText);
          } else {
            const blob = await response.blob();
            zip.file(logName, blob, { binary: true });
          }
        } catch (error) {
          console.error(`Error while fetching ${logName}:`, error);
        }
      }

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Trigger the download of the zip file
      const zipUrl = window.URL.createObjectURL(zipBlob);
      const zipLink = document.createElement("a");
      zipLink.href = zipUrl;
      zipLink.setAttribute("download", fileName);
      document.body.appendChild(zipLink);
      zipLink.click();
      zipLink.parentNode?.removeChild(zipLink);
    }
  };

  return {
    logs: data,
    isLoading: !data && !error,
    isError: !!error,
    downloadLog,
    downloadAllLogs,
  };
};
