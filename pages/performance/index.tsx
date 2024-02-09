import { useNodePerformance } from '../../hooks/useNodePerformance';
import { useNodeVersion } from '../../hooks/useNodeVersion';
import { Doughnut } from 'react-chartjs-2';
import { mapToDoughnut } from '../../utils/mapToDoughnut';
import { nullPlaceholder } from '../../utils/null-placerholder';
import { useNodeStatus } from '../../hooks/useNodeStatus';
import { useNodeNetwork } from '../../hooks/useNodeNetwork';

export default function Performance() {
  const {version} = useNodeVersion()
  const {nodeStatus} = useNodeStatus()
  const {performance} = useNodePerformance()
  const {network} = useNodeNetwork()

  return <>{!!(performance && nodeStatus && version) && <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Version Info</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div><span className='font-semibold'>CLI/GUI Running Version:</span> {nullPlaceholder(version.runningCliVersion)} / {nullPlaceholder(version.runningGuiVersion)}</div>
                  <div><span className='font-semibold'>CLI/GUI Latest Version:</span> {nullPlaceholder(version.latestCliVersion)} / {nullPlaceholder(version.latestGuiVersion)}</div>
                  <div><span className='font-semibold'>Validator Running Version:</span> {nullPlaceholder(version.runnningValidatorVersion)}</div>
                  <div><span className='font-semibold'>Active Network Version:</span> {nullPlaceholder(version.activeShardeumVersion)}</div>
                  <div><span className='font-semibold'>Validator Minimum Version:</span> {nullPlaceholder(version.minShardeumVersion)}</div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Performance</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>CPU usage AVG:</span> {nodeStatus.performance?.cpuPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.cpuPercentage, {spacing: 2})}
                                options={{plugins: {tooltip: {enabled: false}}}}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>RAM usage AVG:</span> {nodeStatus.performance?.memPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.memPercentage, {spacing: 2})}
                                options={{plugins: {tooltip: {enabled: false}}}}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>Disk usage AVG:</span> {nodeStatus.performance?.diskPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.diskPercentage, {spacing: 2})}
                      options={{plugins: {tooltip: {enabled: false}}}}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>Network usage AVG:</span> {performance[0]?.network}%</div>
                      <Doughnut data={mapToDoughnut(performance[0]?.network, {spacing: 2})}/>
                  </div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">TPS Overview</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div><span className='font-semibold'>Node
                      throughput:</span> {Number.isFinite(network?.txApplied) ? network?.txApplied + ' TPS' : '-'}</div>
                  <div><span className='font-semibold'>Transaction processed:</span> {Number.isFinite(network?.txProcessed) ? network?.txProcessed : '-'}</div>
                  {/* <div><span className='font-semibold'>State storage usage:</span> {nullPlaceholder(nodeStatus.performance?.stateStorage)}</div> */}
              </div>
          </div>
      </div>

      <h1 className="font-semibold mb-3 py-10">Performance</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">CPU</div>
              <Doughnut data={mapToDoughnut(nodeStatus.performance?.cpuPercentage)}
                        options={{plugins: {tooltip: {enabled: false}}}}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">RAM</div>
              <Doughnut data={mapToDoughnut(nodeStatus.performance?.memPercentage)}
                        options={{plugins: {tooltip: {enabled: false}}}}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">DISK</div>
              <Doughnut data={mapToDoughnut(nodeStatus.performance?.diskPercentage)}
                        options={{plugins: {tooltip: {enabled: false}}}}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">NETWORK</div>
              <Doughnut data={mapToDoughnut(performance[0]?.network)}
                        options={{plugins: {tooltip: {enabled: false}}}}/>
          </div>
      </div>
  </div>
  }
  </>
}
