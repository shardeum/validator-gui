export interface NodeStatusHistory {
  state: 'active' | 'paused' | 'stopped' | 'unknown'
  stakeAmount: string
  lifetimeEarnings: string
  date: string
}
