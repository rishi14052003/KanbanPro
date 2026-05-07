import React, { useState, useMemo } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import TaskList from '../components/tasks/TaskList'
import CreateTaskModal from '../components/tasks/CreateTaskModal'
import { Button, Badge, Input, Loader } from '../components/ui'
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
    overdue: tasks.filter((t) => {\n      if (t.status === 'done') return false\n      return new Date(t.deadline || '') < new Date()\n    }).length,
  }

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {\n      ...newTask,\n      id: Date.now().toString(),\n      createdAt: new Date().toISOString(),\n    }\n    setTasks([task, ...tasks])\n    setShowModal(false)\n  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))\n  }

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
              style={{\n                display: 'flex',\n                alignItems: 'center',\n                gap: '8px',\n                padding: '11px 16px',\n                background: showFilters ? '#2C1F14' : '#F3EDE3',\n                color: showFilters ? '#F5E6C8' : '#2C1F14',\n                border: '1.5px solid ' + (showFilters ? '#2C1F14' : '#DDD0BB'),\n                borderRadius: '11px',\n                cursor: 'pointer',\n                fontSize: '13.5px',\n                fontWeight: 600,\n                fontFamily: font,\n                transition: 'all 0.15s ease',\n              }}\n              onMouseEnter={(e) => {\n                if (!showFilters) {\n                  (e.currentTarget as HTMLElement).style.background = '#E8DED0'\n                }\n              }}\n              onMouseLeave={(e) => {\n                if (!showFilters) {\n                  (e.currentTarget as HTMLElement).style.background = '#F3EDE3'\n                }\n              }}\n            >\n              <SlidersHorizontal size={16} />\n              Filters\n            </button>\n          </div>

          {/* Filters Row */}
          {showFilters && (\n            <div style={{\n              display: 'grid',\n              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',\n              gap: '16px',\n              padding: '20px',\n              background: '#FFFFFF',\n              border: '1px solid #EDE8DF',\n              borderRadius: '14px',\n            }}>\n              {/* Status Filter */}\n              <div>\n                <label style={{\n                  display: 'block',\n                  fontSize: '12px',\n                  fontWeight: 600,\n                  color: '#7C6348',\n                  marginBottom: '8px',\n                  textTransform: 'uppercase',\n                  letterSpacing: '0.05em',\n                }}>\n                  Status\n                </label>\n                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>\n                  {['all', 'todo', 'in_progress', 'done'].map((status) => (\n                    <button\n                      key={status}\n                      onClick={() => setStatusFilter(status)}\n                      className=\"filter-btn\"\n                      style={{\n                        padding: '7px 12px',\n                        borderRadius: '8px',\n                        border: '1px solid #DDD0BB',\n                        background: statusFilter === status ? '#2C1F14' : '#F3EDE3',\n                        color: statusFilter === status ? '#F5E6C8' : '#2C1F14',\n                        fontSize: '12px',\n                        fontWeight: 500,\n                        cursor: 'pointer',\n                        fontFamily: font,\n                      }}\n                    >\n                      {status === 'all' ? 'All' : statusConfig[status]?.label}\n                    </button>\n                  ))}\n                </div>\n              </div>\n\n              {/* Priority Filter */}\n              <div>\n                <label style={{\n                  display: 'block',\n                  fontSize: '12px',\n                  fontWeight: 600,\n                  color: '#7C6348',\n                  marginBottom: '8px',\n                  textTransform: 'uppercase',\n                  letterSpacing: '0.05em',\n                }}>\n                  Priority\n                </label>\n                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>\n                  {['all', 'low', 'medium', 'high'].map((priority) => (\n                    <button\n                      key={priority}\n                      onClick={() => setPriorityFilter(priority)}\n                      className=\"filter-btn\"\n                      style={{\n                        padding: '7px 12px',\n                        borderRadius: '8px',\n                        border: '1px solid #DDD0BB',\n                        background: priorityFilter === priority ? '#2C1F14' : '#F3EDE3',\n                        color: priorityFilter === priority ? '#F5E6C8' : '#2C1F14',\n                        fontSize: '12px',\n                        fontWeight: 500,\n                        cursor: 'pointer',\n                        fontFamily: font,\n                      }}\n                    >\n                      {priority === 'all' ? 'All' : priorityConfig[priority]?.label}\n                    </button>\n                  ))}\n                </div>\n              </div>\n            </div>\n          )}\n        </div>

        {/* ── STATS ── */}\n        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>\n          {[\n            { label: 'Total Tasks', value: stats.total, color: '#7C6348' },\n            { label: 'Completed', value: stats.completed, color: '#10B981' },\n            { label: 'Pending', value: stats.pending, color: '#F59E0B' },\n            { label: 'In Progress', value: stats.inProgress, color: '#EA580C' },\n          ].map((stat) => (\n            <div\n              key={stat.label}\n              className=\"task-stat\"\n              style={{\n                background: '#FFFFFF',\n                border: '1px solid #EDE8DF',\n                borderRadius: '14px',\n                padding: '18px',\n                boxShadow: '0 1px 4px rgba(44,31,20,0.05)',\n              }}\n            >\n              <div style={{ fontSize: '13px', color: '#A0917E', fontWeight: 500, marginBottom: '8px' }}>\n                {stat.label}\n              </div>\n              <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color, letterSpacing: '-0.02em' }}>\n                {stat.value}\n              </div>\n            </div>\n          ))}\n        </div>

        {/* ── VIEW TOGGLE ── */}\n        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>\n          <div style={{ display: 'flex', gap: '8px', background: '#F3EDE3', padding: '6px', borderRadius: '10px' }}>\n            <button\n              onClick={() => setViewMode('list')}\n              style={{\n                display: 'flex',\n                alignItems: 'center',\n                gap: '6px',\n                padding: '7px 14px',\n                background: viewMode === 'list' ? '#FFFFFF' : 'transparent',\n                border: 'none',\n                borderRadius: '8px',\n                cursor: 'pointer',\n                fontSize: '13px',\n                fontWeight: 600,\n                color: viewMode === 'list' ? '#2C1F14' : '#8B7355',\n                fontFamily: font,\n                transition: 'all 0.15s ease',\n                boxShadow: viewMode === 'list' ? '0 2px 8px rgba(44,31,20,0.1)' : 'none',\n              }}\n            >\n              <LayoutList size={16} />\n              List\n            </button>\n            <button\n              onClick={() => setViewMode('kanban')}\n              style={{\n                display: 'flex',\n                alignItems: 'center',\n                gap: '6px',\n                padding: '7px 14px',\n                background: viewMode === 'kanban' ? '#FFFFFF' : 'transparent',\n                border: 'none',\n                borderRadius: '8px',\n                cursor: 'pointer',\n                fontSize: '13px',\n                fontWeight: 600,\n                color: viewMode === 'kanban' ? '#2C1F14' : '#8B7355',\n                fontFamily: font,\n                transition: 'all 0.15s ease',\n                boxShadow: viewMode === 'kanban' ? '0 2px 8px rgba(44,31,20,0.1)' : 'none',\n              }}\n            >\n              <LayoutGrid size={16} />\n              Kanban\n            </button>\n          </div>\n          <span style={{ fontSize: '13px', color: '#A0917E', fontWeight: 500 }}>\n            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}\n          </span>\n        </div>

        {/* ── TASK VIEW ── */}\n        {filteredTasks.length > 0 ? (\n          viewMode === 'list' ? (\n            <TaskList\n              tasks={filteredTasks}\n              statusConfig={statusConfig}\n              priorityConfig={priorityConfig}\n              onDelete={handleDeleteTask}\n              onStatusChange={handleStatusChange}\n            />\n          ) : (\n            <div style={{\n              background: '#FFFFFF',\n              border: '1.5px dashed #DDD0BB',\n              borderRadius: '14px',\n              padding: '64px 24px',\n              textAlign: 'center',\n            }}>\n              <LayoutGrid size={40} color=\"#A0917E\" style={{ margin: '0 auto 16px' }} />\n              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C1F14', margin: '0 0 4px 0' }}>\n                Kanban view coming soon\n              </p>\n              <p style={{ fontSize: '13px', color: '#A0917E', margin: 0 }}>\n                We're building an amazing drag-and-drop experience\n              </p>\n            </div>\n          )\n        ) : (\n          <div style={{\n            background: '#FFFFFF',\n            border: '1px solid #EDE8DF',\n            borderRadius: '14px',\n            padding: '64px 24px',\n            textAlign: 'center',\n          }}>\n            <AlertCircle size={40} color=\"#A0917E\" style={{ margin: '0 auto 16px' }} />\n            <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C1F14', margin: '0 0 4px 0' }}>\n              No tasks found\n            </p>\n            <p style={{ fontSize: '13px', color: '#A0917E', margin: 0 }}>\n              Try adjusting your filters or create a new task to get started\n            </p>\n          </div>\n        )}\n      </div>\n\n      {/* ── CREATE TASK MODAL ── */}\n      <CreateTaskModal\n        isOpen={showModal}\n        onClose={() => setShowModal(false)}\n        onCreate={handleCreateTask}\n      />\n    </DashboardLayout>\n  )\n}\n\nexport default Tasks\n