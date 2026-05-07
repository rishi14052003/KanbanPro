package models

import "time"

type Team struct {
	ID        string    `bson:"_id,omitempty"`
	Name      string    `bson:"name"`
	OwnerID   string    `bson:"owner_id"`
	CreatedAt time.Time `bson:"created_at"`
}
