import React, { useState } from 'react'
import { Badge } from '../../components/ui'
import { Calendar, MoreVertical, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  deadline?: string
  createdAt: string
}

interface TaskListProps {
  tasks: Task[]
  statusConfig: Record<string, { label: string; badge: 'success' | 'warning' | 'danger' | 'info' }>
  priorityConfig: Record<string, { label: string; badge: 'success' | 'warning' | 'danger' | 'info' }>
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task['status']) => void
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  statusConfig,
  priorityConfig,
  onDelete,
  onStatusChange,
}) => {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 size={16} color="#10B981" />
      case 'in_progress':
        return <Clock size={16} color="#EA580C" />
      default:
        return <AlertCircle size={16} color="#F59E0B" />
    }
  }

  const isOverdue = (deadline: string | undefined, status: Task['status']) => {
    if (!deadline || status === 'done') return false
    return new Date(deadline) < new Date()
  }

  const daysUntilDeadline = (deadline: string | undefined) => {
    if (!deadline) return null
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    return days
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #EDE8DF',
        borderRadius: '14px',
        overflow: 'hidden',
        fontFamily: font,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 150px 120px 120px 100px 60px',
          gap: '16px',
          padding: '16px 20px',
          background: '#F9F7F3',
          borderBottom: '1px solid #EDE8DF',
          fontSize: '12px',
          fontWeight: 700,
          color: '#7C6348',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        <div>Task</div>
        <div>Priority</div>
        <div>Status</div>
        <div>Assigned</div>
        <div>Due Date</div>
        <div></div>
      </div>

      {/* Rows */}
      {tasks.map((task) => {
        const isOpen = openMenuId === task.id
        const daysLeft = daysUntilDeadline(task.deadline)
        const overdue = isOverdue(task.deadline, task.status)

        return (
          <div
            key={task.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 150px 120px 120px 100px 60px',
              gap: '16px',
              padding: '16px 20px',
              alignItems: 'center',
              borderBottom: '1px solid #EDE8DF',
              background: '#FFFFFF',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#FEFCF8'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#FFFFFF'
            }}
          >
            {/* Task Name */}
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#1C1209',
                  marginBottom: '4px',
                }}
              >
                {task.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#A0917E',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.description}
              </p>
            </div>

            {/* Priority */}
            <div>
              <Badge variant={priorityConfig[task.priority]?.badge || 'info'}>
                {priorityConfig[task.priority]?.label}
              </Badge>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {getStatusIcon(task.status)}
              <Badge variant={statusConfig[task.status]?.badge || 'info'}>
                {statusConfig[task.status]?.label}
              </Badge>
            </div>

            {/* Assigned */}
            <div style={{ fontSize: '13px', color: '#5C4E3E', fontWeight: 500 }}>
              {task.assignedTo || '—'}
            </div>

            {/* Due Date */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: overdue ? '#DC2626' : '#8B7355',
                fontWeight: overdue ? 600 : 500,
              }}
            >
              <Calendar size={14} />
              {task.deadline ? (
                <span title={new Date(task.deadline).toLocaleDateString()}>
                  {daysLeft !== null ? (daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`) : '—'}
                </span>
              ) : (
                '—'
              )}
            </div>

            {/* Actions */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setOpenMenuId(isOpen ? null : task.id)}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isOpen ? '#F3EDE3' : '#FFFFFF',
                  border: `1.5px solid ${isOpen ? '#DDD0BB' : '#EDE8DF'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#7C6348',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    const background = '#F3EDE3'
                    const borderColor = '#DDD0BB'
                    ;(e.currentTarget as HTMLElement).style.background = background
                    ;(e.currentTarget as HTMLElement).style.borderColor = borderColor
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    const background = '#FFFFFF'
                    const borderColor = '#EDE8DF'
                    ;(e.currentTarget as HTMLElement).style.background = background
                    ;(e.currentTarget as HTMLElement).style.borderColor = borderColor
                  }
                }}
              >
                <MoreVertical size={16} />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #EDE8DF',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(44,31,20,0.12)',
                    zIndex: 10,
                    minWidth: '160px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Status Options */}
                  {(['todo', 'in_progress', 'done'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange(task.id, status)
                        setOpenMenuId(null)
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: task.status === status ? '#F3EDE3' : '#FFFFFF',
                        border: 'none',
                        borderBottom: '1px solid #EDE8DF',
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        color: '#1C1209',
                        fontWeight: task.status === status ? 600 : 500,
                        textAlign: 'left',
                        fontFamily: font,
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#F3EDE3'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          task.status === status ? '#F3EDE3' : '#FFFFFF'
                      }}
                    >
                      {statusConfig[status]?.label}
                    </button>
                  ))}

                  {/* Delete Option */}
                  <button
                    onClick={() => {
                      onDelete(task.id)
                      setOpenMenuId(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      color: '#DC2626',
                      fontWeight: 500,
                      textAlign: 'left',
                      fontFamily: font,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#FEF2F2'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#FFFFFF'
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TaskList
