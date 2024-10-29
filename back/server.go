package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"runtime/debug"
	"tarikihongan-todo/db"
	"tarikihongan-todo/internal/auth"
	"tarikihongan-todo/resolvers"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

func main() {
	env := os.Getenv("ENV")
	if env == "development" {
		godotenv.Load()
	}

	auth.Init()
	err := db.Init()
	if err != nil {
		log.Fatal(err)
		panic(err)
	}

	server := handler.NewDefaultServer(db.NewExecutableSchema(db.Config{Resolvers: &resolvers.Resolver{}}))
	server.SetRecoverFunc(func(ctx context.Context, err any) (userMessage error) {
		log.Print(err)
		debug.PrintStack()
		return errors.New("user message")
	})

	router := http.NewServeMux()
	router.HandleFunc("/google", auth.RedirectToGoogleAuth)
	router.HandleFunc("/google/callback", auth.GoogleCallbackHandler)
	router.HandleFunc("/logout", auth.LogoutHandler)
	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", server)
	middleware := auth.Middleware(router)

	frontURL := os.Getenv("FRONT_URL")
	corsOption := cors.New(cors.Options{
		AllowedOrigins:   []string{frontURL},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	log.Fatal(http.ListenAndServe(":8080", corsOption.Handler(middleware)))
}
