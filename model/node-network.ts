export interface NodeNetwork {
  size: {
    active: number
    standBy: number
    desired: number
    joining: number
    syncing: number
  },
  load: {
    maxTps: number
    avgTps: number
    totalProcessed: number
  },
  health: {
    activeStandbyRatio: number
    desiredActiveStandbyRatio: number
  },
  reward: {
    dailyIssuance: string
    avgPerDay: string
    avgPerNodeDay: string
  },
  apr: {
    nodeApr: number
    avgApr: number
  }
}
