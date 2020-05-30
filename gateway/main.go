package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"info441sp20-ashraysa/gateway/handlers"
	"info441sp20-ashraysa/gateway/models/users"
	"info441sp20-ashraysa/gateway/sessions"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
	"sync/atomic"

	"github.com/go-redis/redis"
	"github.com/patrickmn/go-cache"
)

// Director directs HTTPS to HTTP
type Director func(r *http.Request)

// CustomDirector creates a custom director
func CustomDirector(c *handlers.HandlerContext, targets []*url.URL) Director {
	var counter int32
	counter = 0
	return func(r *http.Request) {
		currSession := &handlers.SessionState{}
		_, err := sessions.GetState(r, c.Key, c.SessionStore, currSession)
		if err == nil {
			currID := currSession.User.ID
			user, _ := c.UserStore.GetByID(currID)
			encodedUser, _ := json.Marshal(user)
			r.Header.Add("X-User", string(encodedUser))
		} else {
			r.Header.Set("X-User", "")
		}

		targ := targets[int(counter)%len(targets)]
		atomic.AddInt32(&counter, 1)
		r.Header.Add("X-Forwarded-Host", r.Host)
		r.Host = targ.Host
		r.URL.Host = targ.Host
		r.URL.Scheme = targ.Scheme
	}
}

//main is the main entry point for the server
func main() {
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":443"
	}

	tlsCertPath := os.Getenv("TLSCERT")
	tlsKeyPath := os.Getenv("TLSKEY")
	key := os.Getenv("SESSIONKEY")
	redisAddr := os.Getenv("REDISADDR")
	dsn := os.Getenv("DSN")

	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	rStore := sessions.NewRedisStore(rdb, cache.DefaultExpiration)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Printf("error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	handlerctx := &handlers.HandlerContext{
		Key:          key,
		SessionStore: rStore,
		UserStore:    users.NewMySQLStore(db),
	}

	marketplaceAddresses := strings.Split(os.Getenv("MARKETPLACEADDR"), ",")
	// summaryAddresses := strings.Split(os.Getenv("SUMMARYADDR"), ",")

	var marketplaceURLs []*url.URL
	// var summaryURLs []*url.URL

	for _, v := range marketplaceAddresses {
		marketplaceURLs = append(marketplaceURLs, &url.URL{Scheme: "http", Host: v})
	}

	// for _, v := range summaryAddresses {
	// 	summaryURLs = append(summaryURLs, &url.URL{Scheme: "http", Host: v})
	// }

	// summaryProxy := &httputil.ReverseProxy{Director: CustomDirector(handlerctx, summaryURLs)}
	marketplaceProxy := &httputil.ReverseProxy{Director: CustomDirector(handlerctx, marketplaceURLs)}

	if len(tlsCertPath) == 0 || len(tlsKeyPath) == 0 {
		os.Stdout.Write([]byte("Environment variables are not set"))
		os.Exit(1)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/v1/users", handlerctx.UsersHandler)
	mux.HandleFunc("/v1/users/", handlerctx.SpecificUserHandler)

	mux.HandleFunc("/v1/sessions", handlerctx.SessionsHandler)
	mux.HandleFunc("/v1/sessions/", handlerctx.SpecificSessionHandler)
	// mux.Handle("/v1/summary", summaryProxy)
	// mux.Handle("/v1/channels", marketplaceProxy)
	// mux.Handle("/v1/channels/", marketplaceProxy)
	mux.Handle("/v1/marketplace", marketplaceProxy)
	mux.Handle("/v1/marketplace/", marketplaceProxy)
	wrappedMux := handlers.NewResponseHeader(mux)

	log.Printf("server is listening at %s...", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, wrappedMux))

}
