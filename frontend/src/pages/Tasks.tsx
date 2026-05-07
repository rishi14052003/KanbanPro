import { useState, useMemo } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import TaskList from '../components/tasks/TaskList'
import CreateTaskModal from '../components/tasks/CreateTaskModal'
import { Button, Input } from '../components/ui'
import {
  Plus,
  Search,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  AlertCircle,
} from 'lucide-react'

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

const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the updated dashboard',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'John Doe',
    deadline: '2026-05-15',
    createdAt: '2026-05-01',
  },
  {
    id: '2',
    title: 'Fix authentication bug',
    description: 'Resolve login issues on mobile devices',
    status: 'done',
    priority: 'high',
    assignedTo: 'Jane Smith',
    deadline: '2026-05-10',
    createdAt: '2026-04-28',
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints and response formats',
    status: 'todo',
    priority: 'medium',
    assignedTo: 'Mike Johnson',
    deadline: '2026-05-20',
    createdAt: '2026-05-02',
  },
  {
    id: '4',
    title: 'Optimize database queries',
    description: 'Improve performance of slow queries',
    status: 'todo',
    priority: 'medium',
    assignedTo: 'John Doe',
    deadline: '2026-05-18',
    createdAt: '2026-05-03',
  },
  {
    id: '5',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated deployments',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Jane Smith',
    deadline: '2026-05-12',
    createdAt: '2026-05-02',
  },
  {
    id: '6',
    title: 'Update user profile page',
    description: 'Add new profile fields and improve UI',
    status: 'done',
    priority: 'low',
    assignedTo: 'Mike Johnson',
    deadline: '2026-05-08',
    createdAt: '2026-04-25',
  },
]

const statusConfig: Record<string, { label: string; badge: 'success' | 'warning' | 'danger' | 'info' }> = {
  todo: { label: 'To Do', badge: 'warning' },
  in_progress: { label: 'In Progress', badge: 'info' },
  done: { label: 'Done', badge: 'success' },
}

const priorityConfig: Record<string, { label: string; badge: 'success' | 'warning' | 'danger' | 'info' }> = {
  low: { label: 'Low', badge: 'info' },
  medium: { label: 'Medium', badge: 'warning' },
  high: { label: 'High', badge: 'danger' },
}

function Tasks() {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'done').length,
    pending: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    overdue: tasks.filter((t) => {
      if (t.status === 'done') return false
      return new Date(t.deadline || '') < new Date()
    }).length,
  }

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks([task, ...tasks])
    setShowModal(false)
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  return (
    <DashboardLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        .filter-btn { transition: all 0.15s ease; }
        .filter-btn.active { background: #2C1F14 !important; color: #F5E6C8 !important; }
        .task-stat { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .task-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(44,31,20,0.09) !important; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: font }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '38px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0 }}>
              Tasks
            </h1>
            <p style={{ fontSize: '14.5px', color: '#8B7355', marginTop: '8px', lineHeight: 1.6, maxWidth: '420px' }}>
              Manage and organize your workflow efficiently.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} />
            New Task
          </Button>
        </div>

        {/* ── SEARCH & FILTERS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Input
                placeholder="Search tasks..."
                icon={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 16px',
                background: showFilters ? '#2C1F14' : '#F3EDE3',
                color: showFilters ? '#F5E6C8' : '#2C1F14',
                border: '1.5px solid ' + (showFilters ? '#2C1F14' : '#DDD0BB'),
                borderRadius: '11px',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: 600,
                fontFamily: font,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!showFilters) {
                  (e.currentTarget as HTMLElement).style.background = '#E8DED0'
                }
              }}
              onMouseLeave={(e) => {
                if (!showFilters) {
                  (e.currentTarget as HTMLElement).style.background = '#F3EDE3'
                }
              }}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Filters Row */}
          {showFilters && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '20px',
              background: '#FFFFFF',
              border: '1px solid #EDE8DF',
              borderRadius: '14px',
            }}>
              {/* Status Filter */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#7C6348',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Status
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['all', 'todo', 'in_progress', 'done'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="filter-btn"
                      style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        border: '1px solid #DDD0BB',
                        background: statusFilter === status ? '#2C1F14' : '#F3EDE3',
                        color: statusFilter === status ? '#F5E6C8' : '#2C1F14',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: font,
                      }}
                    >
                      {status === 'all' ? 'All' : statusConfig[status]?.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#7C6348',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Priority
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['all', 'low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className="filter-btn"
                      style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        border: '1px solid #DDD0BB',
                        background: priorityFilter === priority ? '#2C1F14' : '#F3EDE3',
                        color: priorityFilter === priority ? '#F5E6C8' : '#2C1F14',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: font,
                      }}
                    >
                      {priority === 'all' ? 'All' : priorityConfig[priority]?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Total Tasks', value: stats.total, color: '#7C6348' },
            { label: 'Completed', value: stats.completed, color: '#10B981' },
            { label: 'Pending', value: stats.pending, color: '#F59E0B' },
            { label: 'In Progress', value: stats.inProgress, color: '#EA580C' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="task-stat"
              style={{
                background: '#FFFFFF',
                border: '1px solid #EDE8DF',
                borderRadius: '14px',
                padding: '18px',
                boxShadow: '0 1px 4px rgba(44,31,20,0.05)',
              }}
            >
              <div style={{ fontSize: '13px', color: '#A0917E', fontWeight: 500, marginBottom: '8px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color, letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── VIEW TOGGLE ── */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', background: '#F3EDE3', padding: '6px', borderRadius: '10px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: viewMode === 'list' ? '#2C1F14' : '#8B7355',
                fontFamily: font,
                transition: 'all 0.15s ease',
                boxShadow: viewMode === 'list' ? '0 2px 8px rgba(44,31,20,0.1)' : 'none',
              }}
            >
              <LayoutList size={16} />
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                background: viewMode === 'kanban' ? '#FFFFFF' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: viewMode === 'kanban' ? '#2C1F14' : '#8B7355',
                fontFamily: font,
                transition: 'all 0.15s ease',
                boxShadow: viewMode === 'kanban' ? '0 2px 8px rgba(44,31,20,0.1)' : 'none',
              }}
            >
              <LayoutGrid size={16} />
              Kanban
            </button>
          </div>
          <span style={{ fontSize: '13px', color: '#A0917E', fontWeight: 500 }}>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {/* ── TASK VIEW ── */}
        {filteredTasks.length > 0 ? (
          viewMode === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              statusConfig={statusConfig}
              priorityConfig={priorityConfig}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px dashed #DDD0BB',
              borderRadius: '14px',
              padding: '64px 24px',
              textAlign: 'center',
            }}>
              <LayoutGrid size={40} color="#A0917E" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C1F14', margin: '0 0 4px 0' }}>
                Kanban view coming soon
              </p>
              <p style={{ fontSize: '13px', color: '#A0917E', margin: 0 }}>
                We're building an amazing drag-and-drop experience
              </p>
            </div>
          )
        ) : (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #EDE8DF',
            borderRadius: '14px',
            padding: '64px 24px',
            textAlign: 'center',
          }}>
            <AlertCircle size={40} color="#A0917E" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C1F14', margin: '0 0 4px 0' }}>
              No tasks found
            </p>
            <p style={{ fontSize: '13px', color: '#A0917E', margin: 0 }}>
              Try adjusting your filters or create a new task to get started
            </p>
          </div>
        )}
      </div>

      {/* ── CREATE TASK MODAL ── */}
      <CreateTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateTask}
      />
    </DashboardLayout>
  )
}

export default Tasks
