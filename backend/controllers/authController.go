package controllers

import (
	"context"
	"errors"
	"net/http"
	"saas-task-manager/config"
	"saas-task-manager/models"
	"saas-task-manager/utils"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Signup(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Validate name
	if len(user.Name) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name must be at least 2 characters"})
		return
	}

	// Validate email format
	if !utils.ValidateEmail(user.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email must end with @gmail.com"})
		return
	}

	// Validate password strength
	if !utils.ValidatePassword(user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters with uppercase, lowercase, and number or special character"})
		return
	}

	// Check if email already exists
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existingUser models.User
	err := config.UserCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// Hash password
	hashed, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = hashed
	user.CreatedAt = time.Now()
	user.ID = primitive.NewObjectID().Hex()

	// Create user
	_, err = config.UserCollection.InsertOne(ctx, user)
	if err != nil {
		// Check for duplicate key error (email already exists)
		if errors.Is(err, errors.New("duplicate key error")) || err.Error() == "duplicate key error" {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Validate email format
	if !utils.ValidateEmail(input.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong Email Entered"})
		return
	}

	// Check if user exists
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := config.UserCollection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong Email Entered"})
		return
	}

	// Validate password
	if !utils.CheckPassword(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong Password Entered"})
		return
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
