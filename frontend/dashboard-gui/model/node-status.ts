export interface NodeStatus {
  state: 'active' | 'paused' | 'inactive' | 'unknown'
  totalTimeValidating: number
  lastActive: string
  stakeAmount: string
  stakeAddress: string
  stakeRequirement: string
  earnings: string
  lastPayout: string
  lifetimeEarnings: string
}
