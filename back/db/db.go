package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

var DB *sql.DB

func Init() (err error) {
	env := os.Getenv("ENV")
	if env == "development" {
		godotenv.Load()
	}

	port := 5432
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_NAME")
	dbSetting := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
	log.Println(dbSetting)

	DB, err = sql.Open("postgres", dbSetting)
	if err != nil {
		panic(err)
	}
	log.Println("DB connected")
	return err
}
