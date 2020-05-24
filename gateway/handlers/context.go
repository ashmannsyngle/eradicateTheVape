package handlers

import (
	"info441sp20-ashraysa/gateway/models/users"
	"info441sp20-ashraysa/gateway/sessions"
)

// HandlerContext provides the handlers with access to an initialized sessions.Store
// and users.Store, as well as the session signing key
type HandlerContext struct {
	Key          string
	SessionStore sessions.Store
	UserStore    users.Store
}
