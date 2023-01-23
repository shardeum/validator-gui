import { NodePerformance } from './node-performance';

export interface NodeStatus {
  performance: NodePerformance;
  state: 'active' | 'standby' | 'inactive'
  totalTimeValidating: number
  lastActive: string
  lockedStake: string
  stakeAddress: string
  stakeRequirement: string
  nominatorAddress: string
  currentRewards: string
  lastPayout: string
  lifetimeEarnings: string,
  nodeInfo: {
    externalIp: string
    externalPort: number,
    internalPort: number,
    publicKey: string
  }
}
