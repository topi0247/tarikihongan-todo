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
)

const (
	UserinfoProfileScope = "https://www.googleapis.com/auth/userinfo.profile"
	UserinfoScope        = "https://www.googleapis.com/oauth2/v3/userinfo"
)

var googleOauthConfig *oauth2.Config

type GoogleUserInfo struct {
	Name string `json:"name"`
	Sub  string `json:"sub"`
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
	url := googleOauthConfig.AuthCodeURL("state", oauth2.AccessTypeOffline)
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

	qm := models.UserWhere.UID.EQ(userInfo.Sub)
	user, err := models.Users(qm).One(context.Background(), db.DB)
	redirectUrl := os.Getenv("FRONT_URL")
	if err == nil {
		log.Printf("User created: %v", user)
		tokenAuth, err := GenerateToken(user.ID)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}
		log.Printf("token: %s", tokenAuth)

		redirectUrl += "?token=" + tokenAuth
		http.Redirect(w, r, redirectUrl, http.StatusSeeOther)
		return
	}

	user = &models.User{
		Name:     userInfo.Name,
		UID:      userInfo.Sub,
		Provider: "google-oauth2",
	}

	if err := user.Insert(context.Background(), db.DB, boil.Infer()); err != nil {
		http.Error(w, "Failed to insert user", http.StatusInternalServerError)
		return
	}
	log.Printf("User created: %v", user)
	tokenAuth, err := GenerateToken(user.ID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}
	log.Printf("token: %s", tokenAuth)
	redirectUrl += "?token=" + tokenAuth
	http.Redirect(w, r, redirectUrl, http.StatusSeeOther)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
