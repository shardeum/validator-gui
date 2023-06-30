import { InformationCircleIcon } from '@heroicons/react/20/solid'

export default function StatusBadge({ status }: { status: string }) {
  const statusTip = new Map<string, string>(
    Object.entries({
      active: 'Your node is running and it is participating in the network',
      standby:
        'Shardeum rotates validators between standby and active states. Everything is ok with your node and it will become active eventually',
      stopped: 'Your node is not running and not participating in the network',
      'need-stake': 'Your node is running, but it will not join the network until you stake',
    })
  )

  const statusColor = new Map<string, string>(
    Object.entries({
      active: 'text-success',
      standby: 'text-success',
      stopped: 'text-error',
      'need-stake': 'text-warning',
    })
  )

  return (
    <div className="tooltip normal-case" data-tip={statusTip.get(status)}>
      <InformationCircleIcon className={`h-5 w-5 mb-1 inline ${statusColor.get(status)}`} />
    </div>
  )
}
