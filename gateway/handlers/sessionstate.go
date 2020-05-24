package handlers

import (
	"info441sp20-ashraysa/gateway/models/users"
	"time"
)

// SessionState saves the state sessions for the web server
type SessionState struct {
	Time time.Time   `json:"time"`
	User *users.User `json:"user"`
}
