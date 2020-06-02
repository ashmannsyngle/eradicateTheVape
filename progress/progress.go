package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"info441sp20-ashraysa/gateway/models/users"
	"net/http"
	"strings"
	"time"
)

// Progress represents a Progress struct
type Progress struct {
	ProgressID int       `json:"progressID"`
	DaysSober  int       `json:"daysSober"`
	DateLogged time.Time `json:"dateLogged"`
	UserID     int64     `json:"userID"`
}

// Points represents a Points struct
type Points struct {
	Amount int `json:"amount"`
}

// MySQLStore represents a MySQL store
type MySQLStore struct {
	db *sql.DB
}

//NewMySQLStore constructs and returns a new MySQLStore
func NewMySQLStore(DB *sql.DB) *MySQLStore {
	return &MySQLStore{
		db: DB,
	}
}

// ProgressUserHandler tracks the user's sobriety clock and awards points for each day the user clocks-in
func (msq *MySQLStore) ProgressUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-User") != "" {
		decoder := json.NewDecoder(strings.NewReader(r.Header.Get("X-User")))
		user := &users.User{}
		err := decoder.Decode(user)
		if err != nil {
			http.Error(w, "error decoding response body", http.StatusBadRequest)
			return
		}
		progress := &Progress{}
		var dateLogged []byte

		if r.Method == "GET" {
			sqlQuery := "select progressID, daysSober, dateLogged, userID from Progress where userID = ?"
			res, _ := msq.db.Query(sqlQuery, user.ID)
			for res.Next() {
				res.Scan(&progress.ProgressID, &progress.DaysSober, &dateLogged, &progress.UserID)
			}
			dateLoggedTime, _ := time.Parse("2006-01-02 15:04:05", string(dateLogged))
			progress.DateLogged = dateLoggedTime
			if progress.DaysSober == 0 {
				sqlQueryTwo := "insert into Progress(daysSober, dateLogged, userID) values (?, ?, ?)"
				_, errTwo := msq.db.Exec(sqlQueryTwo, 0, time.Now(), user.ID)
				if errTwo != nil {
					http.Error(w, errTwo.Error(), http.StatusInternalServerError)
					return
				}
				sqlQueryThree := "select progressID, daysSober, dateLogged, userID from Progress where userID = ?"
				res, _ := msq.db.Query(sqlQueryThree, user.ID)
				for res.Next() {
					res.Scan(&progress.ProgressID, &progress.DaysSober, &dateLogged, &progress.UserID)
				}
				dateLoggedTime, _ := time.Parse("2006-01-02 15:04:05", string(dateLogged))
				progress.DateLogged = dateLoggedTime
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			enc := json.NewEncoder(w)
			enc.Encode(progress)
		} else if r.Method == "PATCH" {
			sqlQuery := "select progressID, daysSober, dateLogged, userID from Progress where userID = ?"
			res, err := msq.db.Query(sqlQuery, user.ID)
			if err != nil {
				http.Error(w, "User has not logged any days in the sobriety clock", http.StatusBadRequest)
				return
			}
			for res.Next() {
				res.Scan(&progress.ProgressID, &progress.DaysSober, &dateLogged, &progress.UserID)
			}
			dateLoggedTime, _ := time.Parse("2006-01-02 15:04:05", string(dateLogged))
			progress.DateLogged = dateLoggedTime

			// update daysSober and update points for user
			sqlQueryThree := "update Progress set daysSober = ?, dateLogged = ?  where userID = ?"
			_, errThree := msq.db.Exec(sqlQueryThree, progress.DaysSober+1, time.Now(), user.ID)
			if errThree != nil {
				http.Error(w, "Error updating daySober for current user", http.StatusInternalServerError)
				return
			}
			sqlQueryFour := "update Users set points = ? where id = ?"
			_, errFour := msq.db.Exec(sqlQueryFour, user.Points+100, user.ID)
			if errFour != nil {
				http.Error(w, "Error adding points for the current user", http.StatusInternalServerError)
				return
			}
			sqlQueryFive := "select progressID, daysSober, dateLogged, userID from Progress where userID = ?"
			resTwo, err := msq.db.Query(sqlQueryFive, user.ID)
			if err != nil {
				http.Error(w, "User has not logged any days in the sobriety clock", http.StatusBadRequest)
				return
			}
			for resTwo.Next() {
				resTwo.Scan(&progress.ProgressID, &progress.DaysSober, &dateLogged, &progress.UserID)
			}
			dateLoggedTime, _ = time.Parse("2006-01-02 15:04:05", string(dateLogged))
			progress.DateLogged = dateLoggedTime
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			enc := json.NewEncoder(w)
			enc.Encode(progress)
		} else {
			http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
			return
		}
	} else {
		http.Error(w, "User is not authenticated", http.StatusUnauthorized)
		return
	}
}

// UserPointsHandler updates the points of the user (for creating threads/posts)
func (msq *MySQLStore) UserPointsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-User") != "" {
		decoder := json.NewDecoder(strings.NewReader(r.Header.Get("X-User")))
		user := &users.User{}
		err := decoder.Decode(user)
		if err != nil {
			http.Error(w, "error decoding response body", http.StatusBadRequest)
			return
		}
		if r.Method == "POST" {

			decoder := json.NewDecoder(r.Body)
			amountOfPoints := &Points{}
			decoder.Decode(amountOfPoints)
			sqlQueryFour := "update Users set points = ? where id = ?"
			_, errFour := msq.db.Exec(sqlQueryFour, user.Points+amountOfPoints.Amount, user.ID)
			fmt.Println(amountOfPoints)
			fmt.Println(user.Points + amountOfPoints.Amount)
			if errFour != nil {
				http.Error(w, "Error updating points for the current user", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("User points updated."))
		} else {
			http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
			return
		}
	} else {
		http.Error(w, "User is not authenticated", http.StatusUnauthorized)
		return
	}
}
