package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"runtime/debug"
	"tarikihongan-todo/db"
	"tarikihongan-todo/resolvers"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	_ "github.com/lib/pq"
)

func main() {
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

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
