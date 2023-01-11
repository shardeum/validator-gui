export interface NodeStatusHistory {
  state: 'active' | 'paused' | 'inactive' | 'unknown'
  stakeAmount: string
  lifetimeEarnings: string
  date: string
}
