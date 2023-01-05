type NodeStatus = {
  state: string
  totalTimeValidating: number
  lastActive: string
  stakeAmount: string
  stakeRequirement: string
  stakeAddress: string
  earnings: string
  lastPayout: string
  lifetimeEarnings: string
}

type NodeStatusResponse = NodeStatus | ErrorResponse;

type NodeStatusHistory = {
  state: string
  stakeAmount: string
  lifetimeEarnings: string
  date: string
}

type NodeStatusHistoryResponse = NodeStatusHistory | ErrorResponse;


type NodeVersion = {
  runningVersion: string
  minimumVersion: string
  latestVersion: string
}


type NodeVersionResponse = NodeVersion | ErrorResponse;


type NodePerformance = {
  cpu: number
  ram: number
  disk: number
  network: number
  tpsThroughput: number
  transactionsCount: number
  stateStorage: number
  date: string
}

type NodePerformanceResponse = NodePerformance | ErrorResponse;


type NodeNetwork = {
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

type NodeNetworkResponse = NodeNetwork | ErrorResponse;


type Notification = {
  date: string
  title: string
  content: string
}

type NotificationResponse = Notification[] | ErrorResponse;


type Settings = {
  rewardWalletAddress: string
  stakeWalletAddress: string
  alertEmail: string
  alertPhoneNumber: string
}

type SettingsResponse = Settings | ErrorResponse;


type StakeRequest = {
  amount: string
}