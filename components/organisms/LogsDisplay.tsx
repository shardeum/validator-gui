import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import dashboardBg from "../../assets/dashboard-bg.webp";
import { useNodeLogs } from "../../hooks/useNodeLogs";
import { LogFrame } from "../molecules/LogFrame";
import { Pagination } from "../molecules/Pagination";
import { useState } from "react";
import { BgImage } from "../atoms/BgImage";

export const LogsDisplay = () => {
  const { logs, downloadAllLogs, clearAllLogs } = useNodeLogs();

  return (
    <div className="grow flex flex-col justify-between">
      <div className="md:px-16 px-4 grow flex flex-col justify-between gap-y-10 mb-20">
        <div className="flex flex-col gap-y-12">
          <div className="flex flex-col gap-y-2">
            <span className="text-2xl font-semibold">Validator Logs</span>
            <span className="text-sm bodyFg">
              View, export, and configure logs of your validating node.
            </span>
          </div>
          <div className="flex flex-col gap-y-3">
            {/* header */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-md">All Logs</span>
              <div className="flex items-center gap-x-3">
                <span
                  className="font-semibold text-md cursor-pointer"
                  onClick={() => {
                    clearAllLogs();
                  }}
                >
                  Clear All<span className="max-md:hidden"> Logs</span>
                </span>
                <button
                  className="border border-gray-300 bg-white px-4 py-1 rounded flex items-center gap-x-2"
                  onClick={() => {
                    downloadAllLogs();
                  }}
                >
                  <ArrowDownTrayIcon className="w-4 h-4 text-black stroke-2" />
                  <span className="text-md font-semibold">
                    Download All<span className="max-md:hidden"> Logs</span>
                  </span>
                </button>
              </div>
            </div>
            {/* logs */}
            <div className="flex flex-col gap-y-1">
              {logs?.map((logId) => (
                <LogFrame logId={logId} key={logId} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <BgImage src={dashboardBg} alt="dashboard-bg" />
    </div>
  );
};
