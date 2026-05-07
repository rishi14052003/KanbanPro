import { useState, useEffect } from 'react'
import api from '../services/api'
import DashboardLayout from '../components/layout/DashboardLayout'

interface Task {
  id: string
  title: string
  description: string
  status: string
  deadline: string
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', deadline: '' })

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } })
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return '#f59e0b'
      case 'in_progress': return '#3b82f6'
      case 'done': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem', fontWeight: '600' }}>My Tasks</h2>
          <button onClick={() => setShowModal(true)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>+ New Task</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${getStatusColor(task.status)}` }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.125rem', fontWeight: '600' }}>{task.title}</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.875rem', lineHeight: '1.5' }}>{task.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#888' }}>
                <span style={{ padding: '0.25rem 0.75rem', background: getStatusColor(task.status), color: 'white', borderRadius: '9999px', fontWeight: '500', fontSize: '0.75rem' }}>{task.status.replace('_', ' ').toUpperCase()}</span>
                <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#888', background: 'white', borderRadius: '12px' }}><p style={{ fontSize: '1rem' }}>No tasks yet. Create your first task!</p></div>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#333', fontSize: '1.5rem', fontWeight: '600' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.875rem' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} required rows={4} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Status</label>
                <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.875rem' }}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Deadline</label>
                <input type="date" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.875rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Create Task</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Dashboard
