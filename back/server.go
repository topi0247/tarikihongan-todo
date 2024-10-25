package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"runtime/debug"
	"tarikihongan-todo/db"
	"tarikihongan-todo/resolvers"
	"tarikihongan-todo/usecase"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	env := os.Getenv("ENV")
	if env == "development" {
		godotenv.Load()
	}

	usecase.Init()
	err := db.Init()
	if err != nil {
		log.Fatal(err)
		panic(err)
	}
	srv := handler.NewDefaultServer(db.NewExecutableSchema(db.Config{Resolvers: &resolvers.Resolver{}}))
	srv.SetRecoverFunc(func(ctx context.Context, err any) (userMessage error) {
		log.Print(err)
		debug.PrintStack()
		return errors.New("user message")
	})

	http.HandleFunc("/google", usecase.RedirectToGoogleAuth)
	http.HandleFunc("/google/callback", usecase.GoogleCallbackHandler)
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
