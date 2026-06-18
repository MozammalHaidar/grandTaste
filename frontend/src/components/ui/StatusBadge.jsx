import { STATUS_COLORS } from '../../utils/constants'

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[status]}`}>
    {status?.replace('_', ' ')}
  </span>
)

export default StatusBadge