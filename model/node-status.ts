import { NodePerformance } from './node-performance';

export interface NodeStatus {
  performance: NodePerformance;
  state: 'active' | 'standby' | 'stopped' | 'active-syncing'
  exitStatus: 'Exit with warning' | 'Exited cleanly'|'Exit with error',
  exitMessage: string,
  totalTimeValidating: number
  lastActive: string
  lockedStake: string
  stakeAddress: string
  stakeRequirement: string
  nominatorAddress: string
  currentRewards: string
  lastPayout: string
  lifetimeEarnings: string
  nodeInfo: {
    appData: {
      activeVersion: string
      minVersion: string
      shardeumVersion: string
    }
    externalIp: string
    externalPort: number,
    internalPort: number,
    publicKey: string
  }
}
