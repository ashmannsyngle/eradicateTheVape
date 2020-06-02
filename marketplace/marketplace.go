package main

import (
	"database/sql"
	"encoding/json"
	"info441sp20-ashraysa/gateway/models/users"
	"net/http"
	"path"
	"strconv"
	"strings"
)

// Marketplace represents a Marketplace struct
type Marketplace struct {
	BadgeID     int    `json:"badgeID"`
	Cost        int    `json:"cost"`
	Name        string `json:"badgeName"`
	Description string `json:"badgeDescription"`
	ImageURL    string `json:"imgURL"`
}

// Badges represents a Badges struct
type Badges struct {
	BadgeID int   `json:"badgeID"`
	UserID  int64 `json:"userID"`
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

// MarketplaceHandler returns a list of badges in the marketplace
func (msq *MySQLStore) MarketplaceHandler(w http.ResponseWriter, r *http.Request) {
	// Get all badges in the marketplace and encode it as an array in the response
	if r.Method == "GET" {
		sqlQuery := "select badgeID, cost, badgeName, badgeDescription, imgURL from Marketplace"
		res, err := msq.db.Query(sqlQuery)
		if err != nil {
			http.Error(w, "Failed to find badges from marketplace", http.StatusInternalServerError)
			return
		}
		var badges []Marketplace
		defer res.Close()
		for res.Next() {
			var badge Marketplace
			if err := res.Scan(&badge.BadgeID, &badge.Cost, &badge.Name, &badge.Description, &badge.ImageURL); err != nil {
				http.Error(w, "Error reading marketplace badges from result", http.StatusInternalServerError)
				return
			}
			badges = append(badges, badge)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		enc := json.NewEncoder(w)
		enc.Encode(badges)
	} else {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		return
	}
}

// BadgeUserHandler updates (add/rempove) the user's profile with the respective badges
func (msq *MySQLStore) BadgeUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-User") != "" {
		decoder := json.NewDecoder(strings.NewReader(r.Header.Get("X-User")))
		user := &users.User{}
		err := decoder.Decode(user)
		if err != nil {
			http.Error(w, "error decoding response body", http.StatusBadRequest)
			return
		}
		urlBase := path.Base(r.URL.String())
		badgeID, _ := strconv.Atoi(urlBase)

		if r.Method == "GET" {
			sqlQuery := "select m.badgeID, cost, badgeName, badgeDescription, imgURL from Badges as b join Marketplace as m on b.badgeID = m.badgeID where b.userID = ?"
			res, err := msq.db.Query(sqlQuery, badgeID)
			var userBadges []Marketplace
			defer res.Close()
			if err != nil {
				http.Error(w, "Failed to find badges for user from marketplace", http.StatusBadRequest)
				return
			}
			for res.Next() {
				var badge Marketplace
				if err := res.Scan(&badge.BadgeID, &badge.Cost, &badge.Name, &badge.Description, &badge.ImageURL); err != nil {
					http.Error(w, "Error reading marketplace badges from result", http.StatusInternalServerError)
					return
				}
				userBadges = append(userBadges, badge)
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			enc := json.NewEncoder(w)
			enc.Encode(userBadges)
		} else if r.Method == "PATCH" {
			// Add the badge to the current user's profile (only ID needed)
			marketplace := &Marketplace{}
			sqlQuery := "select badgeID, cost, badgeName, badgeDescription, imgURL from Marketplace where badgeID = ?"
			res, err := msq.db.Query(sqlQuery, badgeID)
			if err != nil {
				http.Error(w, "Failed to find badge from marketplace", http.StatusBadRequest)
				return
			}
			for res.Next() {
				res.Scan(&marketplace.BadgeID, &marketplace.Cost, &marketplace.Name, &marketplace.Description, &marketplace.ImageURL)
			}
			if user.Points < marketplace.Cost {
				http.Error(w, "User does not have enough points to buy badge", http.StatusBadRequest)
				return
			}
			sqlQueryTwo := "insert into Badges(badgeID, userID) values (?, ?)"
			_, errThree := msq.db.Exec(sqlQueryTwo, badgeID, user.ID)
			if errThree != nil {
				http.Error(w, errThree.Error(), http.StatusInternalServerError)
				return
			}
			sqlQueryThree := "update Users set points = ? where id = ?"
			_, errFour := msq.db.Exec(sqlQueryThree, user.Points-marketplace.Cost, user.ID)
			if errFour != nil {
				http.Error(w, "Error deducting points from User's points in the db", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Badge was successfully added to user profile."))
		} else if r.Method == "DELETE" {
			// Remove the badge from the User's profile (only ID needed)
			sqlQuery := "delete from Badges where badgeID = ? and userID = ?"
			_, err := msq.db.Exec(sqlQuery, badgeID, user.ID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Badge was successfully deleted from user profile."))
		} else {
			http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
			return
		}
	} else {
		http.Error(w, "User is not authenticated", http.StatusUnauthorized)
		return
	}
}
