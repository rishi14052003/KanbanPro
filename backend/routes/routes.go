package routes

import (
	"saas-task-manager/controllers"
	"saas-task-manager/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	auth := r.Group("/auth")
	{
		auth.POST("/signup", controllers.Signup)
		auth.POST("/login", controllers.Login)
	}

	tasks := r.Group("/tasks")
	tasks.Use(middleware.AuthMiddleware())
	{
		tasks.GET("/", controllers.GetTasks)
		tasks.POST("/", controllers.CreateTask)
		tasks.PUT("/:id", controllers.UpdateTask)
		tasks.DELETE("/:id", controllers.DeleteTask)
	}

	teams := r.Group("/teams")
	teams.Use(middleware.AuthMiddleware())
	{
		teams.GET("/", controllers.GetTeams)
		teams.POST("/", controllers.CreateTeam)
	}
}
