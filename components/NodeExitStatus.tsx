import { NodeStatus } from '../model/node-status';
import { ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';

export default function NodeExitStatus({nodeStatus}: { nodeStatus: NodeStatus }) {
  return <>{nodeStatus.exitStatus != null &&
      <>
        {nodeStatus.exitStatus === 'Exited cleanly' &&
            <div className="flex items-center">
                <div>
                    <InformationCircleIcon className="h-7 w-7 text-blue-600"/>
                </div>
                <div className="ml-2">
                    Node exited with following message: {nodeStatus.exitMessage}
                </div>
            </div>
        }
        {nodeStatus.exitStatus === 'Exit with warning' &&
            <div className="flex items-center">
                <div>
                    <ExclamationTriangleIcon className="h-7 w-7 text-yellow-500"/>
                </div>
                <div className="ml-2">
                    Node exited with following message: {nodeStatus.exitMessage}
                </div>
            </div>
        }

        {nodeStatus.exitStatus === 'Exit with error' &&
            <div className="flex text-red-500 items-center">
                <div>
                    <ExclamationCircleIcon className="h-7 w-7"/>
                </div>
                <div className="ml-2 font-semibold">
                    Node exited with following message: {nodeStatus.exitMessage}
                </div>
            </div>
        }
      </>
  }
  </>
}
