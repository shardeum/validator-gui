import { useNodePerformance } from '../../hooks/useNodePerformance';
import { useNodeVersion } from '../../hooks/useNodeVersion';
import { Doughnut } from 'react-chartjs-2';
import { mapToDoughnut } from '../../utils/mapToDoughnut';

export default function Performance() {
  const {version} = useNodeVersion()
  const {performance} = useNodePerformance()

  return <>{!!(performance && version) && <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Version Info</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>Running version: {version.runningVersion}</div>
                  <div>Minimum version: {version.minimumVersion}</div>
                  <div>Latest version: {version.latestVersion}</div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Performance</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>CPU usage AVG: {performance[0].cpu}%</div>
                  <div>RAM usage AVG: {performance[0].ram}%</div>
                  <div>Disk usage AVG: {performance[0].disk}</div>
                  <div>Network usage AVG: {performance[0].network}%</div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">TPS Overview</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div>Node throughput: {performance[0].tpsThroughput} TPS</div>
                  <div>Last payout: {performance[0].transactionsCount}</div>
                  <div>Lifetime earnings: {performance[0].stateStorage}</div>
              </div>
          </div>
      </div>

      <h1 className="font-semibold mb-3 py-10">Performance</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">CPU</div>
              <Doughnut data={mapToDoughnut(performance[0].cpu)}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">RAM</div>
              <Doughnut data={mapToDoughnut(performance[0].ram)}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">DISK</div>
              <Doughnut data={mapToDoughnut(performance[0].disk)}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">NETWORK</div>
              <Doughnut data={mapToDoughnut(performance[0].network)}/>
          </div>
      </div>
  </div>
  }
  </>
}
