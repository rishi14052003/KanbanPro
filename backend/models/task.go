package models

import "time"

type Task struct {
	ID          string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Title       string
	Description string
	Status      string
	AssignedTo  string    `gorm:"type:uuid"`
	TeamID      string    `gorm:"type:uuid"`
	CreatedBy   string    `gorm:"type:uuid"`
	Deadline    time.Time
	CreatedAt   time.Time
}
