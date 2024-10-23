package resolvers

import "golang.org/x/crypto/bcrypt"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{}

func bcryptPassword(password string) string {
	pass := []byte(password)
	hashedPassword, _ := bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
	return string(hashedPassword)
}
