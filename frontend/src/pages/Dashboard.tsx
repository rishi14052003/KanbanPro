import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../services/api'
import {
  Plus,
  Calendar,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Loader2,
  X,
  AlertCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: string
  deadline: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  todo:        { label: 'To Do',       color: '#92600A', bg: '#FEF3C7', dot: '#F59E0B' },
  in_progress: { label: 'In Progress', color: '#9A3412', bg: '#FED7AA', dot: '#F97316' },
  done:        { label: 'Done',        color: '#14532D', bg: '#D1FAE5', dot: '#10B981' },
}

function Dashboard() {
  const [tasks, setTasks]       = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [newTask, setNewTask]   = useState({ title: '', description: '', status: 'todo', deadline: '' })

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true); setError(null)
      const token = localStorage.getItem('token')
      const response = await api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } })
      setTasks(response.data)
    } catch (error: any) {
      setError(error.response?.data?.error || error.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await api.post('/tasks', newTask, { headers: { Authorization: `Bearer ${token}` } })
      setShowModal(false)
      setNewTask({ title: '', description: '', status: 'todo', deadline: '' })
      fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const totalTasks     = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const pendingTasks   = tasks.filter((t) => t.status === 'todo').length
  const progressTasks  = tasks.filter((t) => t.status === 'in_progress').length
  const completionPct  = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  const font = "'DM Sans', 'Helvetica Neue', sans-serif"

  return (
    <DashboardLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        .task-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .task-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(44,31,20,0.10) !important; }
        .stat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(44,31,20,0.09) !important; }
      `}</style>

      {/* ── Error ── */}
      {error && (
        <div style={{
          marginBottom: '24px', padding: '16px 20px',
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '14px',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          fontFamily: font,
        }}>
          <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontWeight: 600, color: '#DC2626', fontSize: '14px' }}>Failed to load tasks</p>
            <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '2px' }}>{error}</p>
            <button
              onClick={fetchTasks}
              style={{
                marginTop: '10px', padding: '7px 14px',
                background: '#DC2626', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                fontFamily: font,
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 0', fontFamily: font }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', margin: '0 auto 16px',
              background: '#F3EDE3', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Loader2 size={26} color="#8B7355" style={{ animation: 'spin 0.8s linear infinite' }} />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C1F14' }}>Loading your workspace...</p>
            <p style={{ fontSize: '13px', color: '#A0917E', marginTop: '4px' }}>Just a moment</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: font }}>

          {/* ── Hero Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#F3EDE3', border: '1px solid #DDD0BB',
                borderRadius: '99px', padding: '5px 12px',
                fontSize: '11px', fontWeight: 600, color: '#7C6348',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                <TrendingUp size={11} />
                Productivity Workspace
              </div>
              <h1 style={{ fontSize: '38px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0 }}>
                My Tasks
              </h1>
              <p style={{ fontSize: '14.5px', color: '#8B7355', marginTop: '8px', lineHeight: 1.6, maxWidth: '420px' }}>
                Stay on top of your work with a clean, focused view of everything on your plate.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px',
                background: '#2C1F14', color: '#F5E6C8',
                border: 'none', borderRadius: '12px',
                fontSize: '13.5px', fontWeight: 600,
                fontFamily: font, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(44,31,20,0.25)',
                transition: 'all 0.15s ease',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1C1209'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#2C1F14'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              <Plus size={16} />
              New Task
            </button>
          </div>

          {/* ── Stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Total Tasks',  value: totalTasks,     icon: ClipboardList, iconBg: '#F3EDE3', iconColor: '#7C6348', badge: 'ALL',      badgeBg: '#F3EDE3',  badgeColor: '#7C6348' },
              { label: 'Completed',    value: completedTasks, icon: CheckCircle2,  iconBg: '#D1FAE5', iconColor: '#059669', badge: 'DONE',     badgeBg: '#D1FAE5',  badgeColor: '#059669' },
              { label: 'Pending',      value: pendingTasks,   icon: Clock3,        iconBg: '#FEF3C7', iconColor: '#D97706', badge: 'TODO',     badgeBg: '#FEF3C7',  badgeColor: '#D97706' },
              { label: 'In Progress',  value: progressTasks,  icon: Loader2,       iconBg: '#FED7AA', iconColor: '#EA580C', badge: 'ACTIVE',   badgeBg: '#FED7AA',  badgeColor: '#EA580C' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="stat-card"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8DF',
                    borderRadius: '18px',
                    padding: '22px',
                    boxShadow: '0 1px 4px rgba(44,31,20,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{
                      width: '44px', height: '44px',
                      background: stat.iconBg, borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={22} color={stat.iconColor} />
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em',
                      color: stat.badgeColor, background: stat.badgeBg,
                      borderRadius: '6px', padding: '3px 8px',
                    }}>
                      {stat.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '34px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#A0917E', marginTop: '5px', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Progress Bar ── */}
          {totalTasks > 0 && (
            <div style={{
              background: '#FFFFFF', border: '1px solid #EDE8DF',
              borderRadius: '18px', padding: '22px 26px',
              boxShadow: '0 1px 4px rgba(44,31,20,0.05)',
              display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#2C1F14' }}>Overall Progress</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>{completionPct}%</span>
                </div>
                <div style={{ height: '8px', background: '#F3EDE3', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${completionPct}%`,
                    background: 'linear-gradient(90deg, #2C1F14, #7C6348)',
                    borderRadius: '99px',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#A0917E', whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700, color: '#1C1209' }}>{completedTasks}</span> of <span style={{ fontWeight: 700, color: '#1C1209' }}>{totalTasks}</span> tasks complete
              </div>
            </div>
          )}

          {/* ── Task List ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.03em', margin: 0, whiteSpace: 'nowrap' }}>
                All Tasks
              </h2>
              <div style={{ height: '1px', flex: 1, background: '#EDE8DF' }} />
              <span style={{ fontSize: '12px', color: '#A0917E', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {tasks.map((task) => {
                const cfg = statusConfig[task.status] || statusConfig.todo
                const daysLeft = Math.ceil((new Date(task.deadline).getTime() - Date.now()) / 86400000)
                const isOverdue = daysLeft < 0 && task.status !== 'done'

                return (
                  <div
                    key={task.id}
                    className="task-card"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #EDE8DF',
                      borderRadius: '18px',
                      padding: '22px',
                      boxShadow: '0 1px 4px rgba(44,31,20,0.05)',
                      display: 'flex', flexDirection: 'column', gap: '12px',
                    }}
                  >
                    {/* Status + Overdue */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.02em',
                        color: cfg.color, background: cfg.bg,
                        borderRadius: '7px', padding: '3px 9px',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                        {cfg.label}
                      </span>
                      {isOverdue && (
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#DC2626', background: '#FEF2F2', borderRadius: '6px', padding: '2px 7px' }}>
                          Overdue
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.3 }}>
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '13px', color: '#8B7355', lineHeight: 1.6, margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {task.description}
                    </p>

                    {/* Deadline */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingTop: '10px', borderTop: '1px solid #F3EDE3',
                      marginTop: 'auto',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isOverdue ? '#DC2626' : '#A0917E' }}>
                        <Calendar size={13} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>
                          {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {task.status !== 'done' && !isOverdue && (
                        <span style={{ fontSize: '11px', color: '#A0917E', fontWeight: 500 }}>
                          {daysLeft}d left
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Empty State ── */}
          {tasks.length === 0 && (
            <div style={{
              background: '#FFFFFF', border: '1px solid #EDE8DF',
              borderRadius: '24px', padding: '72px 32px',
              textAlign: 'center', boxShadow: '0 1px 4px rgba(44,31,20,0.05)',
            }}>
              <div style={{
                width: '72px', height: '72px', margin: '0 auto 20px',
                background: '#F3EDE3', borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ClipboardList size={34} color="#8B7355" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                No tasks yet
              </h3>
              <p style={{ fontSize: '14px', color: '#A0917E', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.65 }}>
                Create your first task and start building momentum on your work.
              </p>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px',
                  background: '#2C1F14', color: '#F5E6C8',
                  border: 'none', borderRadius: '12px',
                  fontSize: '13.5px', fontWeight: 600,
                  fontFamily: font, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(44,31,20,0.2)',
                }}
              >
                <Plus size={16} />
                Create First Task
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(28,18,9,0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
          fontFamily: font,
        }}>
          <div style={{
            width: '100%', maxWidth: '520px',
            background: '#FEFCF8',
            borderRadius: '24px',
            boxShadow: '0 32px 80px rgba(28,18,9,0.25)',
            overflow: 'hidden',
            border: '1px solid #EDE8DF',
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 28px 20px',
              borderBottom: '1px solid #EDE8DF',
              background: '#F6F0E6',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.03em', margin: '0 0 4px' }}>
                  New Task
                </h2>
                <p style={{ fontSize: '13px', color: '#8B7355', margin: 0 }}>Add a task to your workspace</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#EDE4D3', border: 'none', borderRadius: '9px',
                  cursor: 'pointer', color: '#5C4E3E',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#DDD0BB' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#EDE4D3' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTask} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#2C1F14', marginBottom: '7px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  placeholder="What needs to be done?"
                  style={{
                    width: '100%', height: '44px',
                    padding: '0 14px',
                    background: '#FAF7F2', border: '1.5px solid #DDD0BB',
                    borderRadius: '11px', fontSize: '14px', color: '#1C1209',
                    fontFamily: font, outline: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C4A882'
                    e.target.style.boxShadow = '0 0 0 3px rgba(196,168,130,0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#DDD0BB'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#2C1F14', marginBottom: '7px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                  placeholder="Add more context..."
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: '#FAF7F2', border: '1.5px solid #DDD0BB',
                    borderRadius: '11px', fontSize: '14px', color: '#1C1209',
                    fontFamily: font, outline: 'none', resize: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C4A882'
                    e.target.style.boxShadow = '0 0 0 3px rgba(196,168,130,0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#DDD0BB'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Status + Deadline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#2C1F14', marginBottom: '7px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    style={{
                      width: '100%', height: '44px',
                      padding: '0 14px',
                      background: '#FAF7F2', border: '1.5px solid #DDD0BB',
                      borderRadius: '11px', fontSize: '13.5px', color: '#1C1209',
                      fontFamily: font, outline: 'none', cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#2C1F14', marginBottom: '7px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    required
                    style={{
                      width: '100%', height: '44px',
                      padding: '0 14px',
                      background: '#FAF7F2', border: '1.5px solid #DDD0BB',
                      borderRadius: '11px', fontSize: '13.5px', color: '#1C1209',
                      fontFamily: font, outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C4A882'
                      e.target.style.boxShadow = '0 0 0 3px rgba(196,168,130,0.2)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#DDD0BB'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1, height: '46px',
                    background: '#2C1F14', color: '#F5E6C8',
                    border: 'none', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 700,
                    fontFamily: font, cursor: 'pointer',
                    letterSpacing: '-0.01em',
                    transition: 'background 0.15s ease',
                    boxShadow: '0 4px 14px rgba(44,31,20,0.2)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1C1209' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#2C1F14' }}
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, height: '46px',
                    background: '#F3EDE3', color: '#5C4E3E',
                    border: '1.5px solid #DDD0BB', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 600,
                    fontFamily: font, cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#EDE4D3' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#F3EDE3' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Dashboard