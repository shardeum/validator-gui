import { useNodeNetwork } from '../../hooks/useNodeNetwork';

export default function Network() {
  const {network} = useNodeNetwork()

  return <>{!!(network) && <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Network Size</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>Active validators: {network.size.active}</div>
                  <div>Standby validators: {network.size.standBy}</div>
                  <div>Desired network size: {network.size.desired}</div>
                  <div>Joining / Syncing: {network.size.joining} / {network.size.syncing}</div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Network Load</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>Max TPS: {network.load.maxTps}</div>
                  <div>Avg TPS: {network.load.avgTps}</div>
                  <div>Total TXs processed: {network.load.totalProcessed}</div>
                  <div>Network load: {Math.floor(network.load.avgTps / network.load.maxTps * 100)}%</div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Network Health</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>Current A:S Ratio: {network.health.activeStandbyRatio}</div>
                  <div>Target A:S Ratio: {network.health.desiredActiveStandbyRatio}</div>
                  <div>Network health: {Math.floor(network.health.activeStandbyRatio / network.health.desiredActiveStandbyRatio * 100)}%
                  </div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Network Reward</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>Current daily issuance: {network.reward.dailyIssuance}</div>
                  <div>Average daily issuance: {network.reward.avgPerDay}</div>
                  <div>Average daily node reward: {network.reward.avgPerNodeDay}</div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Average APR</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>Your APR: {network.apr.nodeApr}%</div>
                  <div>Network average APR: {network.apr.avgApr}%</div>
              </div>
          </div>
      </div>

  </div>
  }
  </>
}
