import React from 'react'
import { Input, Button } from '../../components/ui'
import { Search, X } from 'lucide-react'

interface TaskFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  priorityFilter: string
  onPriorityChange: (priority: string) => void
  onClearAll: () => void
  statusOptions: { value: string; label: string }[]
  priorityOptions: { value: string; label: string }[]
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  onClearAll,
  statusOptions,
  priorityOptions,
}) => {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"
  const isFiltered = searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        background: '#FFFFFF',
        border: '1px solid #EDE8DF',
        borderRadius: '14px',
        fontFamily: font,
      }}
    >
      {/* Search */}
      <Input
        placeholder="Search tasks..."
        icon={<Search size={16} />}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Filter Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Status */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#7C6348',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1.5px solid #DDD0BB',
              background: '#FFFFFF',
              color: '#2C1F14',
              fontSize: '13px',
              fontFamily: font,
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#7C6348',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1.5px solid #DDD0BB',
              background: '#FFFFFF',
              color: '#2C1F14',
              fontSize: '13px',
              fontFamily: font,
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Button */}
      {isFiltered && (
        <Button variant="secondary" onClick={onClearAll} style={{ width: '100%' }}>
          <X size={14} />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}

export default TaskFilters
