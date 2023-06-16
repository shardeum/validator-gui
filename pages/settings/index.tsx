import { useNodeLogs } from '../../hooks/useNodeLogs';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { useSettings } from '../../hooks/useSettings';
import React, { useState } from 'react';
import ResetPasswordForm from '../../components/ResetPasswordForm';

export default function Settings() {
  const {logs, downloadLog} = useNodeLogs()
  const {settings, updateSettings} = useSettings()
  const [disableToggle, setDisableToggle] = useState<boolean>(false)

  return <div>
    <h1 className="font-semibold mb-3 text-lg">Settings</h1>
    <div className="form-control w-80">
      <label className="label cursor-pointer">
        <div className="tooltip"
             data-tip="Controls whether the node should automatically restart when it has been cleanly terminated/rotated out of the network.">
          <span className="mr-2">Enable Auto-Restart Node</span>
        </div>
        <input type="checkbox"
               className="toggle toggle-primary disable-animate-input"
               checked={settings?.autoRestart}
               disabled={disableToggle}
               onChange={async () => {
                 setDisableToggle(true)
                 await updateSettings({...settings, autoRestart: !settings?.autoRestart})
                 setDisableToggle(false)
               }}
        />
      </label>
    </div>
    <ResetPasswordForm/>
    {logs && logs.length > 0 && <>
        <h1 className="font-semibold mb-3 text-lg mt-6">Logs</h1>
      {logs?.map((logName, index) =>
        <div key={index}>
          <button className="btn-link leading-normal text-blue-400" onClick={() => downloadLog(logName)}>
            <ArrowDownTrayIcon className="text-sm h-5 inline mr-2"/>{logName}</button>
        </div>
      )}
    </>}
  </div>
}
