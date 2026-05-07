package main

import (
	"log"
	"saas-task-manager/config"
	"saas-task-manager/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDB()

	r := gin.Default()
	routes.SetupRoutes(r)

	log.Println("Server running on port 3000")
	r.Run(":3000")
}
