package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Client
var UserCollection *mongo.Collection
var TaskCollection *mongo.Collection
var TeamCollection *mongo.Collection

func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	// Ping the database to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Database ping failed:", err)
	}

	DB = client
	UserCollection = client.Database("taskforge").Collection("users")
	TaskCollection = client.Database("taskforge").Collection("tasks")
	TeamCollection = client.Database("taskforge").Collection("teams")

	// Create unique index on email
	indexModel := mongo.IndexModel{
		Keys:    bson.D{bson.E{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	_, err = UserCollection.Indexes().CreateOne(ctx, indexModel)
	if err != nil {
		log.Println("Warning: Could not create unique index on email:", err)
	}

	log.Println("Database connected")
}
