package auth

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"tarikihongan-todo/db"
	"tarikihongan-todo/models"

	"github.com/volatiletech/sqlboiler/v4/boil"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"crypto/rand"
	"math/big"
)

const (
	UserinfoProfileScope = "https://www.googleapis.com/auth/userinfo.profile"
	UserinfoScope        = "https://www.googleapis.com/oauth2/v3/userinfo"
)

var googleOauthConfig *oauth2.Config

type GoogleUserInfo struct {
	Name string `json:"name"`
	UID  string `json:"id"`
}

func Init() {
	log.Printf("GOOGLE_CLIENT_ID: %s", os.Getenv("GOOGLE_CLIENT_ID"))
	googleOauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("REDIRECT_URL"),
		Scopes:       []string{UserinfoProfileScope},
		Endpoint:     google.Endpoint,
	}
}

func RedirectToGoogleAuth(w http.ResponseWriter, r *http.Request) {
	random, err := generateRandomState()
	if err != nil {
		http.Error(w, "Failed to generate random state", http.StatusInternalServerError)
		return
	}
	url := googleOauthConfig.AuthCodeURL(random, oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func GoogleCallbackHandler(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Code not found", http.StatusBadRequest)
		return
	}

	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		log.Printf("Unable to retrieve token from web: %v", err)
		http.Error(w, "Unable to retrieve token", http.StatusInternalServerError)
		return
	}

	client := googleOauthConfig.Client(context.Background(), token)
	res, err := client.Get(UserinfoScope)
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer res.Body.Close()

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(res.Body).Decode(&userInfo); err != nil {
		http.Error(w, "Failed to decode user info", http.StatusInternalServerError)
		return
	}

	qm := models.UserWhere.UID.EQ(userInfo.UID)
	user, err := models.Users(qm).One(context.Background(), db.DB)
	redirectUrl := os.Getenv("FRONT_URL")
	if err == nil {
		tokenAuth, err := GenerateToken(user.ID)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}
		r.Header.Set("Authorization", tokenAuth)
		log.Printf("header: %s", r.Header.Get("Authorization"))
		setCookie(w, tokenAuth)
		http.Redirect(w, r, redirectUrl, http.StatusTemporaryRedirect)
		return
	}

	user = &models.User{
		Name:     userInfo.Name,
		UID:      userInfo.UID,
		Provider: "google-oauth2",
	}

	if err := user.Insert(context.Background(), db.DB, boil.Infer()); err != nil {
		http.Error(w, "Failed to insert user", http.StatusInternalServerError)
		return
	}
	log.Print("User created")
	authToken, err := GenerateToken(user.ID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}
	r.Header.Set("Authorization", authToken)
	setCookie(w, authToken)
	http.Redirect(w, r, redirectUrl, http.StatusTemporaryRedirect)
}

func setCookie(w http.ResponseWriter, tokenAuth string) {
	secure := true
	if os.Getenv("ENV") == "development" {
		secure = false
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "_tarikihongan_todo",
		Value:    tokenAuth,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
	})
}

func generateRandomState() (string, error) {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const length = 32
	state := make([]byte, length)
	for i := range state {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(letters))))
		if err != nil {
			return "", err
		}
		state[i] = letters[num.Int64()]
	}
	return string(state), nil
}