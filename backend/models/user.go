package models

import "time"

type User struct {
	ID        string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string
	Email     string    `gorm:"unique"`
	Password  string
	CreatedAt time.Time
}
