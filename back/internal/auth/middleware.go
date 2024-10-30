package auth

import (
	"context"
	"log"
	"net/http"
	"strings"
	"tarikihongan-todo/db"
	"tarikihongan-todo/models"
)

var userCtxKey = &contextKey{"user"}

var CurrentUser *models.User

type contextKey struct {
	name string
}

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//cookie, err := r.Cookie("_tarikihongan_todo")
		authHeader := r.Header["Authorization"]
		log.Printf("MiddlewareHeader: %s", authHeader)

		if len(authHeader) == 0 {
			CurrentUser = nil
			next.ServeHTTP(w, r)
			return
		}

		parts := strings.Split(authHeader[0], " ")
		if len(parts) != 2 {
			CurrentUser = nil
			next.ServeHTTP(w, r)
			return
		}
		tokenStr := strings.Split(authHeader[0], " ")[1]
		//tokenStr := cookie.value
		userId, err := ParseToken(tokenStr)
		if err != nil {
			CurrentUser = nil
			next.ServeHTTP(w, r)
			return
		}

		qm := models.UserWhere.ID.EQ(userId)
		user, err := models.Users(qm).One(r.Context(), db.DB)
		log.Printf("User: %v", user)
		if err != nil {
			log.Fatalf("Failed to get user: %v", err)
			CurrentUser = nil
			log.Fatal(err)
			next.ServeHTTP(w, r)
			return
		}
		ctx := context.WithValue(r.Context(), userCtxKey, &user)
		CurrentUser = user

		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func ForContext(ctx context.Context) *models.User {
	raw, _ := ctx.Value(userCtxKey).(*models.User)
	return raw
}
