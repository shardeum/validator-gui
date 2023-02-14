import { useNodeVersion } from '../../hooks/useNodeVersion';
import { Doughnut } from 'react-chartjs-2';
import { useNodeStatus } from '../../hooks/useNodeStatus';
import { mapToDoughnut } from '../../utils/mapToDoughnut';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon, InformationCircleIcon
} from '@heroicons/react/20/solid';
import RemoveStakeButton from '../../components/RemoveStakeButton';
import { nullPlaceholder } from '../../utils/null-placerholder';
import { useNodePerformance } from '../../hooks/useNodePerformance';
import { NodeVersion } from '../../model/node-version';
import React, { useState } from 'react';
import SignMessage from '../../components/SignMessage';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccountStakeInfo } from '../../hooks/useAccountStakeInfo';
import { CHAIN_ID } from '../_app';
import LoadingButton from '../../components/LoadingButton';

export const getServerSideProps = () => ({
  props: {apiPort: process.env.PORT},
});


const versionWarning = (version: NodeVersion) => {
  if (version.runningCliVersion < version.minimumCliVersion
    || version.runningGuiVersion < version.minimumGuiVersion) {
    return (
      <div className="flex text-red-500 items-center">
        <div>
          <ExclamationCircleIcon className="h-7 w-7"/>
        </div>
        <div className="ml-2 font-semibold">
          Please ensure your node meets the minimum required Software version to continue network
          participation!
        </div>
      </div>
    )
  }
  if (version.runningCliVersion < version.latestCliVersion
    || version.runningGuiVersion < version.latestGuiVersion) {
    return (
      <div className="flex text-orange-500 items-center">
        <div>
          <ExclamationTriangleIcon className="h-7 w-7"/>
        </div>
        <div className="ml-2 font-semibold">The running version is not the latest available!</div>
      </div>
    )
  }
}

export default function Maintenance({apiPort}: any) {
  const {version, update} = useNodeVersion(apiPort)
  const {nodeStatus, isLoading, startNode, stopNode} = useNodeStatus(apiPort)
  const {address, isConnected} = useAccount()
  const {stakeInfo} = useAccountStakeInfo(apiPort, address)
  const {performance} = useNodePerformance(apiPort)
  const [showStakeForm, setShowStakeForm] = useState<boolean>(false)
  const {chain} = useNetwork()
  const {switchNetwork} = useSwitchNetwork()

  return <>{!!(performance && version && nodeStatus) && <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Start / Stop Node</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div className="capitalize">Status: {nullPlaceholder(nodeStatus.state)}</div>
                  <div>Total time validating: {nullPlaceholder(nodeStatus.totalTimeValidating)}</div>
                  <div>Time since last active: {nullPlaceholder(nodeStatus.lastActive)}</div>
                {nodeStatus.exitStatus != null &&
                    <div>Exit status: {nullPlaceholder(nodeStatus.exitStatus)}</div>}
                  <div className="flex-grow"/>

                {nodeStatus.state === 'stopped' &&
                    <div className="flex items-center">
                        <div>
                            <InformationCircleIcon className="h-7 w-7 text-blue-600"/>
                        </div>
                        <div className="ml-2">
                            If your node is stopped, it will not be part of the network and therefore is not
                            eligible to receive node rewards
                        </div>
                    </div>
                }

                {nodeStatus.exitStatus != null &&
                    <div className="flex text-red-500 items-center">
                        <div>
                            <ExclamationCircleIcon className="h-7 w-7"/>
                        </div>
                        <div className="ml-2 font-semibold">
                            Node exited with following message: {nodeStatus.exitMessage}
                        </div>
                    </div>}

                  <div className="flex justify-end">
                    {(nodeStatus.state === 'active' || nodeStatus.state === 'standby') &&
                        <LoadingButton className="btn btn-error"
                                       isLoading={isLoading}
                                       onClick={() => stopNode()}>
                            Stop Node
                            <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                        </LoadingButton>
                    }
                    {(nodeStatus.state === 'stopped') &&
                        <LoadingButton className="btn btn-primary"
                                       isLoading={isLoading}
                                       onClick={() => startNode()}>
                            Start Node
                            <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                        </LoadingButton>
                    }
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Add / Remove Stake</h1>
            {showStakeForm &&
                <div
                    className="bg-white text-stone-500	rounded-xl p-8 text-sm relative">
                    <SignMessage nominator={address!}
                                 nominee={nodeStatus?.nodeInfo?.publicKey}
                                 stakeAmount={nodeStatus.stakeRequirement ? +nodeStatus.stakeRequirement : 0}
                                 onStake={() => setShowStakeForm(false)}/>
                    <button className="btn btn-primary btn-outline mr-2 absolute bottom-8"
                            onClick={() => setShowStakeForm(false)}>
                        <ArrowLeftIcon className="h-5 w-5 inline mr-2"/>
                        Cancel
                    </button>
                </div>
            }
            {!showStakeForm &&
                <div
                    className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                    <div className="flex-grow"/>
                    <div>SHM staked: {stakeInfo?.stake ? stakeInfo.stake + ' SHM' : '-'}</div>
                    <div className="overflow-hidden text-ellipsis">Stake
                        address: {nullPlaceholder(nodeStatus.nominatorAddress)}</div>
                    <div>Stake
                        requirement: {nodeStatus.stakeRequirement ? nodeStatus.stakeRequirement + ' SHM' : '-'}</div>
                    <div className="flex-grow"/>

                    <div className="flex text-red-500 items-center">
                        <div>
                            <ExclamationCircleIcon className="h-7 w-7"/>
                        </div>
                        <div className="ml-2 font-semibold">
                            Please ensure your stake wallet has enough funds to meet the minimum staking requirement
                        </div>
                    </div>

                  {isConnected
                    && chain?.id === CHAIN_ID
                    && stakeInfo?.stake > '0.0'
                    && nodeStatus?.nodeInfo?.publicKey != null
                    && stakeInfo?.nominee !== nodeStatus?.nodeInfo?.publicKey &&
                      <div className="flex text-red-500 items-center">
                          <div>
                              <ExclamationCircleIcon className="h-7 w-7"/>
                          </div>
                          <div className="ml-2 font-semibold">
                              This wallet already has an active stake on a different node.
                              Remove your stake first if you wish to stake for the current node.
                          </div>
                      </div>
                  }

                    <div className="flex justify-end">
                      {isConnected
                        && chain?.id === CHAIN_ID
                        && stakeInfo?.stake > '0.0' &&
                          <RemoveStakeButton nominee={stakeInfo?.nominee}/>
                      }

                      {isConnected
                        && chain?.id === CHAIN_ID
                        && nodeStatus?.state !== 'stopped' &&
                          <button className="btn btn-primary ml-2"
                                  onClick={() => setShowStakeForm(true)}>
                              Add Stake
                              <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                          </button>
                      }

                      {isConnected
                        && chain?.id !== CHAIN_ID
                        &&
                          <button className="btn btn-primary ml-2"
                                  onClick={() => switchNetwork?.(CHAIN_ID)}>
                              Switch Network
                              <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                          </button>
                      }

                      {!isConnected &&
                          <ConnectButton></ConnectButton>
                      }
                    </div>
                </div>
            }
          </div>

          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Benchmark Node</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div className="flex justify-between h-7">
                      <div>CPU usage AVG: {nodeStatus.performance?.cpuPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.cpuPercentage, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div>RAM usage AVG: {nodeStatus.performance?.memPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.memPercentage, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div>Disk usage AVG: {nodeStatus.performance?.diskPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.diskPercentage, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div>Network usage AVG: {performance[0]?.network}%</div>
                      <Doughnut data={mapToDoughnut(performance[0]?.network, {spacing: 2})}/>
                  </div>
                  <div className="flex-grow"/>
                  <div className="flex justify-end">
                      <button className="btn btn-primary">
                          Benchmark - Coming Soon
                          <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                      </button>
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Update Version</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div>Running version
                      (CLI/GUI): {nullPlaceholder(version.runningCliVersion)} / {nullPlaceholder(version.runningGuiVersion)}</div>
                  <div>Minimum version
                      (CLI/GUI): {nullPlaceholder(version.minimumCliVersion)} / {nullPlaceholder(version.minimumGuiVersion)}</div>
                  <div>Latest version
                      (CLI/GUI): {nullPlaceholder(version.latestCliVersion)} / {nullPlaceholder(version.latestGuiVersion)}</div>
                  <div className="flex-grow"/>
                {versionWarning(version)}
                {(version.latestCliVersion > version.runningCliVersion || version.latestCliVersion > version.runningCliVersion) &&
                    <div className="flex justify-end">
                        <button className="p-3 bg-blue-700 text-stone-200 disabled:bg-stone-400"
                                onClick={() => update()}>
                            Update Node
                            <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                        </button>
                    </div>
                }
              </div>
          </div>
      </div>

  </div>
  }
  </>
}
