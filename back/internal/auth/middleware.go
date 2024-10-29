package auth

import (
	"context"
	"log"
	"net/http"
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
		cookie, err := r.Cookie("_tarikihongan_todo")
		log.Printf("MiddlewareErr: %v", err)

		if err != nil {
			CurrentUser = nil
			next.ServeHTTP(w, r)
			return
		}

		tokenStr := cookie.Value
		userId, err := ParseToken(tokenStr)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusForbidden)
			return
		}

		qm := models.UserWhere.ID.EQ(userId)
		user, err := models.Users(qm).One(r.Context(), db.DB)
		if err != nil {
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
