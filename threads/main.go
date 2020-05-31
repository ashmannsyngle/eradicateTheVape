package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"std/info441sp20-ashraysa/threads/threadssrc"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	addr := os.Getenv("ADDR")

	if len(addr) == 0 {
		addr = ":5300"
	}
	dsn := os.Getenv("DSN")
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		os.Stdout.WriteString("error opening database")
		os.Exit(1)
	}
	defer db.Close()

	threadsContext := threads.NewHandlerContext(threads.NewSQLStore(db))
	mux := http.NewServeMux()
	mux.HandleFunc("/v1/threads", threadsContext.ThreadsHandler)
	mux.HandleFunc("v1/threads/id/", threadsContext.SpecificThreadsHandler)
	mux.HandleFunc("/v1/posts/", threadsContext.SpecificPostHandler)
	log.Printf("Server is listening at %s...\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
