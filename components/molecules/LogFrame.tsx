import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useNodeLogs } from "../../hooks/useNodeLogs";
import { ClipboardIcon } from "../atoms/ClipboardIcon";
import { useEffect, useState } from "react";
import { fileDescriptions } from "../../config/fileDescriptions";

type LogFrameProps = {
  logId: string;
};

export const LogFrame = ({ logId }: LogFrameProps) => {
  const { downloadLog } = useNodeLogs();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logContent, setLogContent] = useState<string>("");
  const [logContentFetchedAlready, setLogContentFetchedAlready] =
    useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [fileDescription, setFileDescription] = useState<string>("");

  useEffect(() => {
    const fetchLogContent = async () => {
      const blob = await downloadLog(logId, true);
      setLogContent(await blob.text());
      setFileSize(blob.size);
      setLogContentFetchedAlready(true);
      setFileDescription(fileDescriptions[logId] || "No description available");
    };

    fetchLogContent();
  }, [logId, downloadLog]);

  const toggleExpansion = async () => {
    setIsLoading(true);
    if (!logContentFetchedAlready && !isExpanded) {
      const blob = await downloadLog(logId, true);
      setLogContent(await blob.text());
      setLogContentFetchedAlready(true);
    }
    setIsExpanded((prevState) => !prevState);
    setIsLoading(false);
  };

  const copyLogContent = async () => {
    if (!document.hasFocus()) {
      window.focus();
    }
    let content = logContent;
    if (!logContentFetchedAlready) {
      const blob = await downloadLog(logId, true);
      content = await blob.text();
      setLogContent(content);
      setLogContentFetchedAlready(true);
    }
    await navigator.clipboard.writeText(content);
  };

  const formatFileSize = (size: number) => {
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <div className={`w-full flex flex-col shadow border border-bodyFg`}>
      <div className="flex justify-between p-3 bg-white">
        <div className="flex flex-col">
          <div className="flex gap-x-4 items-center">
            <span className="font-semibold text-md">{logId}</span>
            <div className="flex gap-x-3 items-center">
              <span className="cursor-pointer hover:scale-110 px-1 py-1 ease-in-out duration-150">
                <ArrowDownTrayIcon
                  className="h-3 w-3 text-gray-500"
                  onClick={async () => {
                    await downloadLog(logId);
                  }}
                />
              </span>
              <span className="hover:scale-110 py-1 px-1 cursor-pointer ease-in-out duration-150">
                <button className="h-3 w-3" onClick={copyLogContent}>
                  <ClipboardIcon fillColor="#7C7C7B" />
                </button>
              </span>
            </div>

            {fileSize !== null && (
              <span className="text-xs text-gray-500">
                | &nbsp; {formatFileSize(fileSize)}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400"></div>
        </div>
        <div
          className="flex gap-x-2 items-center px-3 py-1 cursor-pointer"
          onClick={toggleExpansion}
        >
          <span className="font-light text-sm">
            {isExpanded ? "Collapse" : "View log"}
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="h-3 w-3" />
          ) : (
            <ChevronDownIcon className="h-3 w-3" />
          )}
        </div>
      </div>
      <div className="text-sm bg-white text-gray-400 px-3 pb-3">
        {fileDescription}
      </div>
      {isExpanded && logContentFetchedAlready && (
        <div>
          <textarea
            disabled
            className="w-full bg-white text-sm bodyFg max-h-96 overflow-scroll px-7 min-h-[16rem]"
          >
            {logContent}
          </textarea>
        </div>
      )}
    </div>
  );
};
