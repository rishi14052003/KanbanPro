package models

import "time"

type Activity struct {
	ID        string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	TaskID    string    `gorm:"type:uuid"`
	Action    string
	UserID    string    `gorm:"type:uuid"`
	CreatedAt time.Time
}
