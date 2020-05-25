package main

import (
	"net/http"
	"os"
	"log"
	"database/sql"
	//"std/info441sp20-ashraysa/servers/threads/threadssrc"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	addr := os.Getenv("ADDR")

	if len(addr) == 0 {
		addr = ":5001" //not final port
	}
	dsn := os.Getenv("DSN")
	db, err := sql.Open("mysql", dsn)
    if err != nil {
        os.Stdout.WriteString("error opening database")
        os.Exit(1)
	}
	defer db.Close()

	//handlerContext
	mux := http.NewServeMux()
	//handleFunctions
	log.Printf("Server is listening at %s...\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}