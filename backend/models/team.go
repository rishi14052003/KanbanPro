package models

import "time"

type Team struct {
	ID        string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string
	OwnerID   string    `gorm:"type:uuid"`
	CreatedAt time.Time
}
