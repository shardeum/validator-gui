import { useNodeVersion } from '../../hooks/useNodeVersion';
import { Doughnut } from 'react-chartjs-2';
import { useNodeStatus } from '../../hooks/useNodeStatus';
import { useNodePerformance } from '../../hooks/useNodePerformance';
import { mapToDoughnut } from '../../utils/mapToDoughnut';
import { ArrowRightIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import RemoveStakeButton from '../../components/RemoveStakeButton';

export default function Maintenance() {
  const {version} = useNodeVersion()
  const {nodeStatus, startNode, stopNode} = useNodeStatus()
  const {performance} = useNodePerformance()

  return <>{!!(performance && version && nodeStatus) && <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Start / Stop Node</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div>Status: {nodeStatus.state}</div>
                  <div>Total time validating: {nodeStatus.totalTimeValidating}</div>
                  <div>Time since last active: {nodeStatus.lastActive}</div>
                  <div className="flex-grow"/>
                  <div className="flex text-red-500 items-center">
                      <div>
                          <ExclamationCircleIcon className="h-7 w-7"/>
                      </div>
                      <div className="ml-2 font-semibold">
                          If your node is stopped, it will not be part of the network and therefore is not
                          eligible to receive node rewards
                      </div>
                  </div>
                  <div className="flex justify-end">
                    {(nodeStatus.state === 'active' || nodeStatus.state === 'standby') &&
                        <button className="p-3 bg-blue-700 text-stone-200" onClick={() => stopNode()}>
                            Stop Node
                            <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                        </button>
                    }
                    {(nodeStatus.state === 'inactive') &&
                        <button className="p-3 bg-blue-700 text-stone-200 mr-2" onClick={() => startNode()}>
                            Start Node
                            <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                        </button>
                    }
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Update Version</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div>Running version: {version.runningVersion}</div>
                  <div>Minimum version: {version.minimumVersion}</div>
                  <div>Latest version: {version.latestVersion}</div>
                  <div className="flex-grow"/>

                  <div className="flex text-red-500 items-center">
                      <div>
                          <ExclamationCircleIcon className="h-7 w-7"/>
                      </div>
                      <div className="ml-2 font-semibold">
                          Please ensure your node meets the minimum required Software version to continue network
                          participation
                      </div>
                  </div>
                  <div className="flex justify-end">
                      <button className="p-3 bg-blue-700 text-stone-200">
                          Update Node
                          <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                      </button>
                  </div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Benchmark Node</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div className="flex justify-between h-7">
                      <div>CPU usage AVG: {performance[0].cpu}%</div>
                      <Doughnut data={mapToDoughnut(performance[0].cpu, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div>RAM usage AVG: {performance[0].ram}%</div>
                      <Doughnut data={mapToDoughnut(performance[0].ram, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div>Disk usage AVG: {performance[0].disk}</div>
                      <Doughnut data={mapToDoughnut(performance[0].disk, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div>Network usage AVG: {performance[0].network}%</div>
                      <Doughnut data={mapToDoughnut(performance[0].network, {spacing: 2})}/>
                  </div>
                  <div className="flex-grow"/>
                  <div className="flex justify-end">
                      <button className="p-3 bg-blue-700 text-stone-200">
                          Benchmark
                          <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                      </button>
                  </div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Add / Remove Stake</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div>SHM staked: {nodeStatus.lockedStake} SHM</div>
                  <div className="overflow-hidden text-ellipsis">Stake address: {nodeStatus.stakeAddress}</div>
                  <div>Stake requirement: {nodeStatus.stakeRequirement} SHM</div>
                  <div className="flex-grow"/>

                  <div className="flex text-red-500 items-center">
                      <div>
                          <ExclamationCircleIcon className="h-7 w-7"/>
                      </div>
                      <div className="ml-2 font-semibold">
                          Please ensure your stake wallet has enough funds to meet the minimum staking requirement
                      </div>
                  </div>

                  <div className="flex justify-end">
                      <RemoveStakeButton nominee={nodeStatus.nodeInfo?.publicKey}/>
                  </div>
              </div>
          </div>
      </div>

  </div>
  }
  </>
}
