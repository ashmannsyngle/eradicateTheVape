package threads

import (
	"encoding/json"
	"fmt"
	"info441sp20-ashraysa/gateway/models/users"
	"net/http"
	"path"
	"strconv"
	"strings"
	"time"
)

//toPost converts an InputPost into a Post
func (newPost *InputPost) toPost(threadID int64) *Post {
	post := &Post{
		ThreadID:  threadID,
		Content:   newPost.Content,
		CreatedAt: time.Now(),
		Creator:   newPost.Creator,
		Anonymous: newPost.Anonymous,
		EditedAt:  time.Now(),
	}
	return post
}

//toThread converts an InputThread into a Thread
func (newThread *InputThread) toThread() *Thread {
	thread := &Thread{
		Name:        newThread.Name,
		Description: newThread.Description,
		CreatedAt:   time.Now(),
		Creator:     newThread.Creator,
		Anonymous:   newThread.Anonymous,
		EditedAt:    time.Now(),
	}
	return thread
}

//ThreadsHandler handles requests to the /v1/threads endpoint
func (ctx *HandlerContext) ThreadsHandler(w http.ResponseWriter, r *http.Request) {
	userHead := r.Header.Get("X-User")
	if len(userHead) == 0 {
		http.Error(w, "You must sign in to view this content.", http.StatusUnauthorized)
		return
	}
	thisUser := &users.User{}
	if err := json.NewDecoder(strings.NewReader(userHead)).Decode(thisUser); err != nil {
		http.Error(w, "error decoding user header", http.StatusBadRequest)
		return
	}
	switch r.Method {
	case http.MethodGet:
		availableThreads, err := ctx.Store.GetMostRecentThreads()
		if err != nil {
			http.Error(w, fmt.Sprintf("Error retrieving threads: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(availableThreads); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case http.MethodPost:
		threadToAdd := &InputThread{}
		if err := json.NewDecoder(r.Body).Decode(threadToAdd); err != nil {
			http.Error(w, "Error decoding new thread JSON", http.StatusInternalServerError)
			return
		}
		threadToAdd.Creator = thisUser
		newThread := threadToAdd.toThread()
		newThread, err := ctx.Store.InsertThread(newThread)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error occurred when posting: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(newThread); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "Method not supported", http.StatusMethodNotAllowed)
		return
	}
}

//SpecificThreadsHandler handles requests to the endpoint /v1/threads/[id_number]
func (ctx *HandlerContext) SpecificThreadsHandler(w http.ResponseWriter, r *http.Request) {
	userHead := r.Header.Get("X-User")
	if len(userHead) == 0 {
		http.Error(w, "You must sign in to view this content.", http.StatusUnauthorized)
		return
	}
	thisUser := &users.User{}
	if err := json.NewDecoder(strings.NewReader(userHead)).Decode(thisUser); err != nil {
		http.Error(w, "error decoding user header", http.StatusBadRequest)
		return
	}
	urlBase := path.Base(r.URL.String())
	idBase, _ := strconv.Atoi(urlBase)
	threadID := int64(idBase)
	switch r.Method {
	case http.MethodGet:
		threadPosts, err := ctx.Store.GetOldestPosts(threadID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Thread not found: %v", err), http.StatusBadRequest)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(threadPosts); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case http.MethodPost:
		postToAdd := &InputPost{}
		if err := json.NewDecoder(r.Body).Decode(postToAdd); err != nil {
			http.Error(w, "Error decoding new post JSON", http.StatusInternalServerError)
			return
		}
		postToAdd.Creator = thisUser
		_, err := ctx.Store.GetThreadByID(threadID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Thread not found: %v", err), http.StatusNotFound)
			return
		}
		newPost := postToAdd.toPost(threadID)
		newPost, err = ctx.Store.InsertPost(newPost)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error occurred when posting: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(newPost); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case http.MethodDelete:
		toDelete, err := ctx.Store.GetThreadByID(threadID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Thread not found: %v", err), http.StatusNotFound)
			return
		}
		if toDelete.Creator.ID != thisUser.ID {
			http.Error(w, fmt.Sprintf("You are not the creator of this thread."), http.StatusUnauthorized)
			return
		}
		err = ctx.Store.DeleteThread(threadID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error deleting thread: %v", err), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Thread successfully deleted."))
	default:
		http.Error(w, "Method not supported", http.StatusMethodNotAllowed)
		return
	}
}

//SpecificPostHandler handles requests to the endpoint /v1/posts/[postID]
func (ctx *HandlerContext) SpecificPostHandler(w http.ResponseWriter, r *http.Request) {
	userHead := r.Header.Get("X-User")
	if len(userHead) == 0 {
		http.Error(w, "You must sign in to view this content.", http.StatusUnauthorized)
		return
	}
	thisUser := &users.User{}
	if err := json.NewDecoder(strings.NewReader(userHead)).Decode(thisUser); err != nil {
		http.Error(w, "error decoding user header", http.StatusBadRequest)
		return
	}
	urlBase := path.Base(r.URL.String())
	idBase, _ := strconv.Atoi(urlBase)
	postID := int64(idBase)
	switch r.Method {
	case http.MethodPatch:
		contentHeader := r.Header.Get("Content-Type")
		if contentHeader != "application/json" {
			http.Error(w, "Request body must be in JSON.", http.StatusUnsupportedMediaType)
			return
		}
		update := &PostUpdates{}
		if err := json.NewDecoder(r.Body).Decode(update); err != nil {
			http.Error(w, "Error decoding new post JSON", http.StatusInternalServerError)
			return
		}
		post, err := ctx.Store.GetPostByID(postID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to find post: %v", err), http.StatusNotFound)
			return
		}
		if post.Creator.ID != thisUser.ID {
			http.Error(w, "You are not the creator of this post", http.StatusUnauthorized)
			return
		}
		updatedPost, err := ctx.Store.UpdatePost(postID, update)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error updating post: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(updatedPost); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case http.MethodDelete:
		toDelete, err := ctx.Store.GetPostByID(postID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Post not found: %v", err), http.StatusNotFound)
			return
		}

		thread, errTwo := ctx.Store.GetThreadByID(toDelete.ThreadID)
		if errTwo != nil {
			http.Error(w, fmt.Sprintf("Thread not found for post: %v", err), http.StatusInternalServerError)
			return
		}

		if thread.Creator.ID != thisUser.ID && toDelete.Creator.ID != thisUser.ID {
			http.Error(w, fmt.Sprintf("You are not the author of this post. %v", err), http.StatusUnauthorized)
			return
		}
		err = ctx.Store.DeletePost(postID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error deleting post: %v", err), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Post successfully deleted."))
	}
}
