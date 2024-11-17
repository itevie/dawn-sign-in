package routes

import (
	"fmt"
	"net/http"
	"time"

	"dawn.rest/dawn-sign-in/models"
	"dawn.rest/dawn-sign-in/util"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

func RegisterAuthRoutes(router *gin.RouterGroup, db *sqlx.DB) {
	router.POST("/register", func(c *gin.Context) {
		var body struct {
			Password string `json:"password" binding:"required"`
			Email    string `json:"email" binding:"required"`
		}

		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": fmt.Sprintf("Invalid body: %s", err.Error()),
			})
			c.Abort()
			return
		}

		var count int
		if err := db.Get(&count, "SELECT COUNT(*) FROM users WHERE email = ?;", body.Email); err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to check if email already exists",
			})
			c.Abort()
			return
		}

		if count != 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Email already exists",
			})
			c.Abort()
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
		if err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to create user",
			})
			c.Abort()
			return
		}

		if _, err := db.Exec("INSERT INTO users (email, password) VALUES (?, ?);", body.Email, string(hashedPassword)); err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to create user",
			})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Account created",
		})
	})

	router.POST("/login", func(c *gin.Context) {
		var body struct {
			Email    string `json:"email" binding:"required"`
			Password string `json:"password" binding:"required"`
		}

		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": fmt.Sprintf("Invalid body: %s", err.Error()),
			})
			c.Abort()
			return
		}

		var user models.User
		if err := db.QueryRowx("SELECT * FROM users WHERE email = ?;", body.Email).StructScan(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Email does not exist",
			})
			c.Abort()
			return
		}

		is_match := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
		if is_match != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid email or password",
			})
			c.Abort()
			return
		}

		token, err := util.GenerateJWT(user.ID, time.Now().Add(time.Minute*5).Unix())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to generate JWT",
			})
			c.Abort()
			return
		}

		c.SetCookie("token", token, 24*60*60, "/", "", true, false)

		c.Status(204)
	})

	router.GET("/get", util.AuthenticateJWT(), func(c *gin.Context) {
		user_id, _ := c.Get("user_id")

		var user models.User
		if err := db.QueryRowx("SELECT * FROM users WHERE id = ?;", user_id).StructScan(&user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to fetch user",
			})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, user)
	})

	router.POST("/access-token", util.AuthenticateJWT(), func(c *gin.Context) {
		user, _ := c.Get("user_id")

		token, err := util.GenerateJWT(int(user.(float64)), time.Now().Add(time.Minute*5).Unix())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to generate JWT",
			})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"access-token": token,
		})
	})

	router.POST("/token", util.AuthenticateJWT(), func(c *gin.Context) {
		user, _ := c.Get("user_id")

		t, err := util.GenerateJWT(int(user.(float64)), time.Now().Add(time.Hour*24).Unix())
		if err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Internal server error",
			})
			c.Abort()
			return
		}

		var token models.Token
		if err := db.QueryRowx("INSERT INTO tokens (token, user) VALUES (?, ?) RETURNING *;", t, user).StructScan(&token); err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Internal server error",
			})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, token)
	})
}
