package main

import (
	"fmt"
	"os"

	"dawn.rest/dawn-sign-in/routes"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	const file string = "database.db"

	db := sqlx.MustConnect("sqlite3", file)
	defer db.Close()

	result, err := os.ReadFile("setup.sql")

	if err != nil {
		panic(fmt.Sprintf("Failed to load setup.sql, %s", err))
	}

	_, err = db.Exec(string(result))

	if err != nil {
		panic(fmt.Sprintf("Failed to execute setup script, %s", err))
	}

	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := router.Group("/api")
	{
		routes.RegisterAuthRoutes(api, db)
	}

	router.Run(":3004")
}
