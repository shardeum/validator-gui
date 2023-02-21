import { useNodeStatus } from '../hooks/useNodeStatus';
import { BarElement, CategoryScale, Chart as ChartJS, ChartOptions, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNodeStatusHistory } from '../hooks/useNodeStatusHistory';
import { nullPlaceholder } from '../utils/null-placerholder';

export const getServerSideProps = () => ({
  props: {apiPort: process.env.PORT},
});

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },
  scales: {
    y: {
      ticks: {
        callback: function (value: number, index: number, ticks: number) {
          if (value === 0) return 'Offline'
          if (value === 1) return 'Online'
          if (value === 2) return 'Validating'
        }
      }
    }
  }
} as any as ChartOptions;

const labels = [
  'January', '', '', '', '', '', '', '', '', '',
  'February', '', '', '', '', '', '', '', '',
  'March', '', '', '', '', '', '', '', '',
  'April', '', '', '', '', '', '', '',
  'May', '', '', '', '', '', '', '', '',
  'June', '', '', '', '', '', '', '', '',
  'July', '', '', '', '', '', '', '', '',]
const mockData = []
for (let i = 0; i < 100; i++) {
  mockData.push(Math.floor(Math.random() * 3))
}

const data = {
  labels,
  datasets: [
    {
      data: mockData,
      barThickness: 2,
      backgroundColor: 'rgba(255, 255, 255)',
    }
  ],
};

export default function Overview({apiPort}: any) {
  const {nodeStatus, isLoading} = useNodeStatus(apiPort)
  const {nodeStatusHistory} = useNodeStatusHistory(apiPort)

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
  );


  // @ts-ignore
  return <>
    {!!nodeStatus && <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-stretch">
                <h1 className="font-semibold mb-3">Node Status</h1>
                <div
                    className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                    <div className="capitalize"><span className='font-semibold'>Status:</span> {nodeStatus.state}</div>
                    <div><span className='font-semibold'>Total time validating:</span> {nullPlaceholder(nodeStatus.totalTimeValidating)}</div>
                    <div><span className='font-semibold'>Time last active:</span> {nullPlaceholder(nodeStatus.lastActive)}</div>
                </div>
            </div>
            <div className="flex flex-col items-stretch">
                <h1 className="font-semibold mb-3">Staked SHM</h1>
                <div
                    className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                    <div><span className='font-semibold'>SHM staked:</span>  {nodeStatus.lockedStake ? nodeStatus.lockedStake + ' SHM' : '-'}</div>
                    <div className="overflow-hidden text-ellipsis"><span className='font-semibold'>Stake
                        address:</span> {nullPlaceholder(nodeStatus.nominatorAddress)}</div>
                    <div><span className='font-semibold'>Stake
                        requirement:</span> {nodeStatus.stakeRequirement ? nodeStatus.stakeRequirement + ' SHM' : '-'}</div>
                </div>
            </div>
            <div className="flex flex-col items-stretch">
                <h1 className="font-semibold mb-3">Reward SHM</h1>
                <div
                    className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                    <div><span className='font-semibold'>Earnings:</span> {nodeStatus.currentRewards ? nodeStatus.currentRewards?.substring(0, 6) + ' SHM' : '-'} </div>
                    <div><span className='font-semibold'>Last payout:</span> {nullPlaceholder(nodeStatus.lastPayout)}</div>
                    <div><span className='font-semibold'>Lifetime
                        earnings:</span> {nodeStatus.lifetimeEarnings ? nodeStatus.lifetimeEarnings + ' SHM' : '-'}</div>
                </div>
            </div>
        </div>

        <h1 className="font-semibold mb-3 py-10">Node Status</h1>
        <div className="h-60">
            <Bar options={options} data={data}/>
        </div>
    </div>
    }
  </>
}
