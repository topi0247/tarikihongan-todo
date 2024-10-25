package usecase

import (
	"time"

	"github.com/patrickmn/go-cache"
)

var cacheClient *cache.Cache

func init() {
	cacheClient = cache.New(24*time.Hour, 25*time.Hour)
}

func SetCache(key string, value interface{}) {
	cacheClient.Set(key, value, cache.DefaultExpiration)
}

func GetCache(key string) (interface{}, bool) {
	return cacheClient.Get(key)
}
