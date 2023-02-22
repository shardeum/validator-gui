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
import NodeExitStatus from '../../components/NodeExitStatus';
import { ethers } from 'ethers';

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

  const showStakeWarning = stakeInfo?.stake
    && ethers.utils.parseEther(stakeInfo?.stake).lt(ethers.utils.parseEther(nodeStatus.stakeRequirement))

  return <>{!!(performance && version && nodeStatus) && <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Start / Stop Node</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div className="capitalize"><span className='font-semibold'>Status:</span> {nullPlaceholder(nodeStatus.state)}</div>
                  <div><span className='font-semibold'>Total time validating:</span> {nullPlaceholder(nodeStatus.totalTimeValidating)}</div>
                  <div><span className='font-semibold'>Time last active:</span> {nullPlaceholder(nodeStatus.lastActive)}</div>
                {nodeStatus.exitStatus != null &&
                    <div><span className='font-semibold'>Exit status:</span> {nullPlaceholder(nodeStatus.exitStatus)}</div>}
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
                  <NodeExitStatus nodeStatus={nodeStatus}/>

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
                                 nominee={nodeStatus?.nomineeAddress}
                                 stakeAmount={nodeStatus.stakeRequirement}
                                 apiPort={apiPort}
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
                    <div><span className='font-semibold'>SHM staked:</span> {stakeInfo?.stake ? stakeInfo.stake + ' SHM' : '-'}</div>
                    <div className="overflow-hidden text-ellipsis"><span className='font-semibold'>Stake
                        address:</span> {nullPlaceholder(nodeStatus.nominatorAddress)}</div>
                    <div><span className='font-semibold'>Stake
                        requirement:</span> {nodeStatus.stakeRequirement ? nodeStatus.stakeRequirement + ' SHM' : '-'}</div>
                    <div className="flex-grow"/>
                    {
                      showStakeWarning
                      ? (<div className="flex items-center">
                            <div>
                                <InformationCircleIcon className="h-7 w-7 text-blue-600"/>
                            </div>
                            <div className="ml-2">
                                Please ensure your stake wallet has enough funds to meet the minimum staking requirement
                            </div>
                          </div>)
                      : null
                    }

                  {isConnected
                    && chain?.id === CHAIN_ID
                    && stakeInfo?.stake > '0.0'
                    && nodeStatus?.nomineeAddress != null
                    && stakeInfo?.nominee !== nodeStatus?.nomineeAddress &&
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
                          <RemoveStakeButton nominee={stakeInfo?.nominee} apiPort={apiPort}/>
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
                      <div><span className='font-semibold'>CPU usage AVG:</span> {nodeStatus.performance?.cpuPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.cpuPercentage, {spacing: 2})}
                                options={{plugins: {tooltip: {enabled: false}}}}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>RAM usage AVG:</span> {nodeStatus.performance?.memPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.memPercentage, {spacing: 2})}
                                options={{plugins: {tooltip: {enabled: false}}}}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>Disk usage AVG:</span> {nodeStatus.performance?.diskPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.diskPercentage, {spacing: 2})}
                                options={{plugins: {tooltip: {enabled: false}}}}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>Network usage AVG:</span> {performance[0]?.network}%</div>
                      <Doughnut data={mapToDoughnut(performance[0]?.network, {spacing: 2})}
                                options={{plugins: {tooltip: {enabled: false}}}}/>
                  </div>
                  <div className="flex-grow"/>
                  <div className="flex justify-end">
                      <div className="tooltip" data-tip="Coming Soon!">
                        <button className="btn btn-primary btn-disabled" >
                          Benchmark
                          <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                        </button>
                      </div>
                  </div>
              </div>
          </div>


          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Update Version</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex-grow"/>
                  <div><span className='font-semibold'>CLI/GUI Running version:</span> {nullPlaceholder(version.runningCliVersion)} / {nullPlaceholder(version.runningGuiVersion)}</div>
                  <div><span className='font-semibold'>CLI/GUI Latest version:</span> {nullPlaceholder(version.latestCliVersion)} / {nullPlaceholder(version.latestGuiVersion)}</div>
                  <div><span className='font-semibold'>Validator Running version:</span> {nullPlaceholder(nodeStatus.nodeInfo?.appData?.activeVersion)}</div>
                  <div><span className='font-semibold'>Validator Latest version:</span> {nullPlaceholder(nodeStatus.nodeInfo?.appData?.shardeumVersion)}</div>
                  <div><span className='font-semibold'>Validator Minimum version:</span> {nullPlaceholder(nodeStatus.nodeInfo?.appData?.minVersion)}</div>
                  <div className="flex-grow"/>
                {versionWarning(version)}
                {(version.latestCliVersion > version.runningCliVersion || version.latestCliVersion > version.runningCliVersion) &&
                    <div className="flex justify-end">
                        <button className="p-3 bg-blue-700 text-stone-200 disabled:bg-stone-400"
                                onClick={() => update()}>
                            Update CLI and GUI
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
