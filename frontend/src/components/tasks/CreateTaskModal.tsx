import React, { useState } from 'react'
import { Modal, Button, Input } from '../../components/ui'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (task: any) => void
}

interface FormData {
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo: string
  deadline: string
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate }) => {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
    deadline: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline cannot be in the past'
    }
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onCreate(formData)
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignedTo: '',
      deadline: '',
    })
    setErrors({})
    setIsSubmitting(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: font }}>
        {/* Title */}
        <Input
          label="Task Title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value })
            if (errors.title) setErrors({ ...errors, title: undefined })
          }}
          error={errors.title ? 'Title is required' : undefined}
        />

        {/* Description */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#2C1F14',
              marginBottom: '8px',
            }}
          >
            Description
          </label>
          <textarea
            placeholder="Describe the task..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value })
              if (errors.description) setErrors({ ...errors, description: undefined })
            }}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '11px',
              border: errors.description ? '1.5px solid #DC2626' : '1.5px solid #DDD0BB',
              background: '#FFFFFF',
              color: '#2C1F14',
              fontSize: '13.5px',
              fontFamily: font,
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.15s ease',
              resize: 'vertical',
              minHeight: '100px',
              boxShadow: '0 1px 3px rgba(44,31,20,0.05)',
            }}
            onFocus={(e) => {
              const borderColor = errors.description ? '#DC2626' : '#2C1F14'
              const boxShadow = errors.description ? '0 0 0 3px rgba(220,38,38,0.1)' : '0 0 0 3px rgba(44,31,20,0.08)'
              ;(e.target as HTMLTextAreaElement).style.borderColor = borderColor
              ;(e.target as HTMLTextAreaElement).style.boxShadow = boxShadow
            }}
            onBlur={(e) => {
              const borderColor = errors.description ? '#DC2626' : '#DDD0BB'
              ;(e.target as HTMLTextAreaElement).style.borderColor = borderColor
              ;(e.target as HTMLTextAreaElement).style.boxShadow = '0 1px 3px rgba(44,31,20,0.05)'
            }}
          />
          {errors.description && (
            <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626', fontWeight: 500 }}>
              {errors.description}
            </p>
          )}
        </div>

        {/* Status & Priority Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Status */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C1F14', marginBottom: '8px' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '11px',
                border: '1.5px solid #DDD0BB',
                background: '#FFFFFF',
                color: '#2C1F14',
                fontSize: '13.5px',
                fontFamily: font,
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C1F14', marginBottom: '8px' }}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '11px',
                border: '1.5px solid #DDD0BB',
                background: '#FFFFFF',
                color: '#2C1F14',
                fontSize: '13.5px',
                fontFamily: font,
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Assigned To */}
        <Input
          label="Assigned To"
          placeholder="Enter team member name"
          value={formData.assignedTo}
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
        />

        {/* Deadline */}
        <div>
          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => {
              setFormData({ ...formData, deadline: e.target.value })
              if (errors.deadline) setErrors({ ...errors, deadline: undefined })
            }}
            error={errors.deadline ? 'Deadline cannot be in the past' : undefined}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button type="submit" loading={isSubmitting} style={{ flex: 1 }}>
            Create Task
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateTaskModal
