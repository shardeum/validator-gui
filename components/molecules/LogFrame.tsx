import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useNodeLogs } from "../../hooks/useNodeLogs";
import { ClipboardIcon } from "../atoms/ClipboardIcon";
import { useState } from "react";

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

  return (
    <div className="w-full flex flex-col my-1 border border-bodyFg shadow">
      <div className="flex justify-between p-5 border-b border-bodyFg bg-white rounded">
        <div className="flex gap-x-4">
          <span className="font-semibold text-md">{logId}</span>
          <div className="flex gap-x-3 items-center">
            <ArrowDownTrayIcon
              className="h-3 w-3 text-gray-500 hover:scale-110 cursor-pointer"
              onClick={async () => {
                await downloadLog(logId);
              }}
            />
            <button
              className="h-3 w-3 hover:scale-110"
              onClick={copyLogContent}
            >
              <ClipboardIcon fillColor="#7C7C7B" />
            </button>
          </div>
        </div>
        <div className="flex gap-x-2 items-center">
          <span className="font-light text-sm">
            {isExpanded ? "Collapse" : "View log"}
          </span>
          {isExpanded ? (
            <ChevronUpIcon
              className="h-3 w-3 cursor-pointer"
              onClick={toggleExpansion}
            />
          ) : (
            <ChevronDownIcon
              className="h-3 w-3 cursor-pointer"
              onClick={toggleExpansion}
            />
          )}
        </div>
      </div>
      {isExpanded && logContentFetchedAlready && (
        <div>
          <textarea
            disabled
            className="w-full rounded-b bg-white text-sm bodyFg max-h-96 overflow-scroll px-7 min-h-[16rem]"
          >
            {logContent}
          </textarea>
        </div>
      )}
    </div>
  );
};
