import { useNodeLogs } from '../../hooks/useNodeLogs';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

export default function Settings() {
  const {logs, downloadLog} = useNodeLogs()

  return <div>
    <h1 className="font-semibold mb-3 text-lg">Logs</h1>
    {logs?.map((logName, index) =>
      <div key={index}>
        <button className="btn-link leading-normal text-blue-400" onClick={() =>downloadLog(logName)}>
          <ArrowDownTrayIcon className="text-sm h-5 inline mr-2"/>{logName}</button>
      </div>
    )}
  </div>
}
