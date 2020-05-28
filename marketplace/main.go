package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":80"
	}

	dsn := os.Getenv("DSN")
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Printf("error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	ctx := NewMySQLStore(db)

	r := mux.NewRouter()
	r.HandleFunc("/v1/marketplace", ctx.MarketplaceHandler)
	r.HandleFunc("/v1/marketplace/{badgeID}", ctx.BadgeUserHandler)
	// r.HandleFunc("/v1/channels/{channelID}", ctx.SpecificChannelHandler)
	// r.HandleFunc("/v1/channels/{channelID}/members", ctx.MembersHandler)
	// r.HandleFunc("/v1/messages/{messageID}", ctx.SpecificMessageHandler)

	log.Printf("server is listening at %s...", addr)
	log.Fatal(http.ListenAndServe(addr, r))
}
