package models

import "time"

type Task struct {
	ID          string    `bson:"_id,omitempty"`
	Title       string    `bson:"title"`
	Description string    `bson:"description"`
	Status      string    `bson:"status"`
	AssignedTo  string    `bson:"assigned_to"`
	TeamID      string    `bson:"team_id"`
	CreatedBy   string    `bson:"created_by"`
	Deadline    time.Time `bson:"deadline"`
	CreatedAt   time.Time `bson:"created_at"`
}
