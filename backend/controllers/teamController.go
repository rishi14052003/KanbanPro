package controllers

import (
	"context"
	"net/http"
	"saas-task-manager/config"
	"saas-task-manager/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateTeam(c *gin.Context) {
	var team models.Team
	userID := c.GetString("user_id")

	if err := c.BindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	team.OwnerID = userID
	team.ID = primitive.NewObjectID().Hex()
	team.CreatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := config.TeamCollection.InsertOne(ctx, team)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team"})
		return
	}

	c.JSON(http.StatusOK, team)
}

func GetTeams(c *gin.Context) {
	var teams []models.Team
	userID := c.GetString("user_id")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"owner_id": userID}
	cursor, err := config.TeamCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch teams"})
		return
	}

	if err = cursor.All(ctx, &teams); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode teams"})
		return
	}

	c.JSON(http.StatusOK, teams)
}
