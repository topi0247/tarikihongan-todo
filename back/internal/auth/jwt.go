package auth

import (
	"fmt"
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var SecretKey = []byte("secret")

func GenerateToken(userId int) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = userId
	claims["expiry"] = time.Now().Add(time.Hour * 24 * 7).Unix()
	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		log.Fatal(err)
		return "", err
	}
	return tokenString, nil
}

func ParseToken(tokenString string) (int, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if userIDFloat, ok := claims["user_id"].(float64); ok {
			userID := int(userIDFloat)
			return userID, nil
		} else {
			return 0, fmt.Errorf("型が無効です")
		}
	} else {
		return 0, err
	}
}
