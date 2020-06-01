package threads

import (
	"database/sql"
	"errors"
	"info441sp20-ashraysa/gateway/models/users"
	"time"

	//importing the MySQL driver without creating a local name for the package in our code
	_ "github.com/go-sql-driver/mysql"
)

//SQLStore holds mysql db
type SQLStore struct {
	db *sql.DB
}

//NewSQLStore creates and returns a new SQLStore
func NewSQLStore(db *sql.DB) SQLStore {
	return SQLStore{db}
}

//Thread represents a thread on the forum
type Thread struct {
	ID          int64       `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Creator     *users.User `json:"creator"`
	CreatedAt   time.Time   `json:"createdAt"`
	EditedAt    time.Time   `json:"editedAt"`
}

//InputThread is a thread to be created on the forum
type InputThread struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Creator     *users.User `json:"creator"`
}

//Post represents a post made on a specific thread
type Post struct {
	ID        int64       `json:"id"`
	ThreadID  int64       `json:"threadID"`
	Content   string      `json:"content"`
	CreatedAt time.Time   `json:"createdAt"`
	Creator   *users.User `json:"creator"`
	EditedAt  time.Time   `json:"editedAt"`
}

//InputPost represents a post someone is about to submit
type InputPost struct {
	Content string      `json:"content"`
	Creator *users.User `json:"creator"`
}

//PostUpdates represents the changes made to a particular post
type PostUpdates struct {
	Content string `json:"content"`
}

//GetMostRecentThreads returns the most recent 50 threads --WILL LIKELY INCLUDE BEFORE QUERY--
func (store SQLStore) GetMostRecentThreads() ([]Thread, error) {
	var output []Thread
	inq := "select threadID, threadName, threadDescription, userWhoCreatedID, timeCreated, editedAt from Threads order by timeCreated desc"
	threadRows, err := store.db.Query(inq)
	if err != nil {
		return nil, err
	}
	defer threadRows.Close()
	for threadRows.Next() {
		var thisThread Thread
		thisThread.Creator = &users.User{}
		var createDate []byte
		var editDate []byte
		if err := threadRows.Scan(&thisThread.ID, &thisThread.Name, &thisThread.Description, &thisThread.Creator.ID,
			&createDate, &editDate); err != nil {
			return nil, err
		}
		thisThread.Creator, err = store.GetCreator(thisThread.Creator.ID)
		if err != nil {
			return nil, err
		}
		createDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(createDate))
		editDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(editDate))
		thisThread.CreatedAt = createDateConvert
		thisThread.EditedAt = editDateConvert
		output = append(output, thisThread)
	}
	if err = threadRows.Err(); err != nil {
		return nil, err
	}
	return output, nil
}

//GetThreadByID retrieves the thread that has the given id
func (store SQLStore) GetThreadByID(id int64) (*Thread, error) {
	inq := "select threadID, threadName, threadDescription, userWhoCreatedID, timeCreated, editedAt from Threads where threadID=?"
	threadRows, err := store.db.Query(inq, id)
	if err != nil {
		return nil, err
	}
	defer threadRows.Close()
	thisThread := &Thread{}
	thisThread.Creator = &users.User{}
	var createDate []byte
	var editDate []byte
	for threadRows.Next() {
		if err := threadRows.Scan(&thisThread.ID, &thisThread.Name, &thisThread.Description, &thisThread.Creator.ID,
			&createDate, &editDate); err != nil {
			return nil, err
		}
		thisThread.Creator, err = store.GetCreator(thisThread.Creator.ID)
		if err != nil {
			return nil, err
		}
		createDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(createDate))
		editDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(editDate))
		thisThread.CreatedAt = createDateConvert
		thisThread.EditedAt = editDateConvert
	}
	if err = threadRows.Err(); err != nil {
		return nil, err
	}
	return thisThread, nil
}

//GetOldestPosts retrieves the first 25 posts of the thread with the given ID --WILL LIKELY INCLUDE AFTER QUERY--
func (store SQLStore) GetOldestPosts(threadID int64) ([]Post, error) {
	var output []Post
	postInq := "select postID, threadID, content, userWhoCreatedID, timeCreated, editedAt from Posts where threadID=? order by timeCreated asc"
	postRows, err := store.db.Query(postInq, threadID)
	if err != nil {
		return nil, err
	}
	defer postRows.Close()
	for postRows.Next() {
		var thisPost Post
		thisPost.Creator = &users.User{}
		var createDate []byte
		var editDate []byte
		if err := postRows.Scan(&thisPost.ID, &thisPost.ThreadID, &thisPost.Content, &thisPost.Creator.ID, &createDate,
			&editDate); err != nil {
			return nil, err
		}
		thisPost.Creator, err = store.GetCreator(thisPost.Creator.ID)
		if err != nil {
			return nil, err
		}
		createDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(createDate))
		editDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(editDate))
		thisPost.CreatedAt = createDateConvert
		thisPost.EditedAt = editDateConvert
		output = append(output, thisPost)
	}
	if postRows.Err() != nil {
		return nil, err
	}
	return output, nil
}

//GetPostByID returns the post with the given ID within the given thread (realized we might not need this one oops)
func (store SQLStore) GetPostByID(postID int64) (*Post, error) {
	postInq := "select postID, threadID, content, userWhoCreatedID, timeCreated, editedAt from Posts where postID=?"
	postRows, err := store.db.Query(postInq, postID)
	if err != nil {
		return nil, err
	}
	defer postRows.Close()
	thisPost := &Post{}
	thisPost.Creator = &users.User{}
	var createDate []byte
	var editDate []byte
	for postRows.Next() {
		if err := postRows.Scan(&thisPost.ID, &thisPost.ThreadID, &thisPost.Content, &thisPost.Creator.ID, &createDate,
			&editDate); err != nil {
			return nil, err
		}
		thisPost.Creator, err = store.GetCreator(thisPost.Creator.ID)
		if err != nil {
			return nil, err
		}
		createDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(createDate))
		editDateConvert, _ := time.Parse("2006-01-02 15:04:05", string(editDate))
		thisPost.CreatedAt = createDateConvert
		thisPost.EditedAt = editDateConvert
	}
	if postRows.Err() != nil {
		return nil, err
	}
	return thisPost, nil
}

//GetCreator returns a User with the given id (helper method)
func (store SQLStore) GetCreator(id int64) (*users.User, error) {
	userInq := "select id, email, passHash, username, firstName, lastName, bio, points, photoUrl from Users where id=?"
	userRows, err := store.db.Query(userInq, id)
	if err != nil {
		return nil, err
	}
	defer userRows.Close()
	thisUser := &users.User{}
	for userRows.Next() {
		if err := userRows.Scan(&thisUser.ID, &thisUser.Email, &thisUser.PassHash, &thisUser.UserName, &thisUser.FirstName,
			&thisUser.LastName, &thisUser.Bio, &thisUser.Points, &thisUser.PhotoURL); err != nil {
			return nil, err
		}
	}
	if err = userRows.Err(); err != nil {
		return nil, err
	}
	return thisUser, nil
}

//InsertThread inserts a new thread into the Threads table of the database
func (store SQLStore) InsertThread(newThread *Thread) (*Thread, error) {
	threadExec := "insert into Threads(threadName, threadDescription, userWhoCreatedID, timeCreated, editedAt) values (?, ?, ?, ?, ?)"
	res, err := store.db.Exec(threadExec, newThread.Name, newThread.Description, newThread.Creator.ID, newThread.CreatedAt,
		newThread.EditedAt)
	if err != nil {
		return nil, errors.New("Cannot create a thread with a duplicate thread name")
	}
	newID, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	newThread.ID = newID
	return newThread, nil
}

//InsertPost inserts a new post into the Posts table of the database
func (store SQLStore) InsertPost(newPost *Post) (*Post, error) {
	postExec := "insert into Posts(threadID, content, userWhoCreatedID, timeCreated, editedAt) values (?, ?, ?, ?, ?)"
	res, err := store.db.Exec(postExec, newPost.ThreadID, newPost.Content, newPost.Creator.ID, newPost.CreatedAt, newPost.EditedAt)
	if err != nil {
		return nil, err
	}
	newID, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	newPost.ID = newID
	return newPost, nil
}

//UpdatePost updates the post with the given ID
func (store SQLStore) UpdatePost(id int64, updates *PostUpdates) (*Post, error) {
	postExec := "update Posts set content=?, editedAt=? where postID=?"
	_, err := store.db.Exec(postExec, updates.Content, time.Now(), id)
	if err != nil {
		return nil, err
	}
	updatedPost, err := store.GetPostByID(id)
	if err != nil {
		return nil, err
	}
	return updatedPost, nil
}

//DeleteThread deletes the thread with the given ID from the threads table of the database
func (store SQLStore) DeleteThread(id int64) error {
	store.DeleteAllPosts(id)
	threadExec := "delete from Threads where threadID=?"
	_, err := store.db.Exec(threadExec, id)
	if err != nil {
		return err
	}
	return nil
}

//DeletePost deletes the post with the given ID from the posts table of the database
func (store SQLStore) DeletePost(id int64) error {
	postExec := "delete from Posts where postID=?"
	_, err := store.db.Exec(postExec, id)
	if err != nil {
		return err
	}
	return nil
}

//DeleteAllPosts deletes all the posts from the posts table for a given thread of the database
func (store SQLStore) DeleteAllPosts(id int64) error {
	postExec := "delete from Posts where threadID=?"
	_, err := store.db.Exec(postExec, id)
	if err != nil {
		return err
	}
	return nil
}

//Still Needed: DeleteThread
//Could do but will need to adjust schema: get pinned threads, get threads by tag name
