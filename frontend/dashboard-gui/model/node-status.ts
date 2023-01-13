export interface NodeStatus {
  state: 'active' | ' standby' | 'syncing'
  totalTimeValidating: number
  lastActive: string
  stakeAmount: string
  stakeAddress: string
  stakeRequirement: string
  earnings: string
  lastPayout: string
  lifetimeEarnings: string,
  nodeInfo: {
    externalIp: string
    externalPort: number,
    internalPort: number,
    publicKey: string
  }
}
