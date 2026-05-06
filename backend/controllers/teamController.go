package controllers

import (
	"net/http"
	"saas-task-manager/config"
	"saas-task-manager/models"

	"github.com/gin-gonic/gin"
)

func CreateTeam(c *gin.Context) {
	var team models.Team
	userID := c.GetString("user_id")

	if err := c.BindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	team.OwnerID = userID

	if err := config.DB.Create(&team).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team"})
		return
	}

	c.JSON(http.StatusOK, team)
}

func GetTeams(c *gin.Context) {
	var teams []models.Team
	userID := c.GetString("user_id")

	if err := config.DB.Where("owner_id = ?", userID).Find(&teams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch teams"})
		return
	}

	c.JSON(http.StatusOK, teams)
}
