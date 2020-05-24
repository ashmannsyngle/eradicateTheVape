package users

import (
	"database/sql"
	"errors"

	//importing the MySQL driver without creating a local name for the package in our code
	_ "github.com/go-sql-driver/mysql"
)

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

//GetByID returns the User with the given ID
func (msq *MySQLStore) GetByID(id int64) (*User, error) {
	sqlQuery := "select id,email,passHash,username,firstName,lastName,photoUrl from Users where id=?"
	res, err := msq.db.Query(sqlQuery, id)
	if err != nil {
		return nil, err
	}
	var userNew User
	if res.Next() {
		res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName, &userNew.FirstName, &userNew.LastName, &userNew.PhotoURL)
	}
	return &userNew, err
}

//GetByEmail returns the User with the given email
func (msq *MySQLStore) GetByEmail(email string) (*User, error) {
	sqlQuery := "select id,email,passHash,username,firstName,lastName,photoUrl from Users use index (email_index) where email=?"
	res, err := msq.db.Query(sqlQuery, email)
	if err != nil {
		return nil, err
	}
	var userNew User
	if res.Next() {
		res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName, &userNew.FirstName, &userNew.LastName, &userNew.PhotoURL)
	}
	return &userNew, err
}

//GetByUserName returns the User with the given Username
func (msq *MySQLStore) GetByUserName(username string) (*User, error) {
	sqlQuery := "select id,email,passHash,username,firstName,lastName,photoUrl from Users use index (username_index) where username=?"
	res, err := msq.db.Query(sqlQuery, username)
	if err != nil {
		return nil, err
	}
	var userNew User
	if res.Next() {
		res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName, &userNew.FirstName, &userNew.LastName, &userNew.PhotoURL)
	}
	return &userNew, err
}

//Insert inserts the user into the database, and returns
//the newly-inserted User, complete with the DBMS-assigned ID
func (msq *MySQLStore) Insert(user *User) (*User, error) {
	insq := "insert into Users(email, passHash, username, firstName, lastName, photoUrl) values (?, ?, ?, ?, ?, ?)"

	res, err := msq.db.Exec(insq, user.Email, user.PassHash, user.UserName, user.FirstName, user.LastName, user.PhotoURL)
	if err != nil {
		return nil, err
	}

	//get the auto-assigned ID for the new row
	id, errTwo := res.LastInsertId()
	if errTwo != nil {
		return nil, errTwo
	}

	return msq.GetByID(id)
}

//Update applies UserUpdates to the given user ID
//and returns the newly-updated user
func (msq *MySQLStore) Update(id int64, updates *Updates) (*User, error) {
	updq := "update Users set firstName = ?, lastName = ? where id = ? "
	_, err := msq.db.Exec(updq, updates.FirstName, updates.LastName, id)
	if err != nil {
		return nil, errors.New("error updating User")
	}
	return msq.GetByID(id)
}

//Delete deletes the user with the given ID
func (msq *MySQLStore) Delete(id int64) error {
	delq := "delete from users where id = ?"
	_, err := msq.db.Exec(delq, id)
	if err != nil {
		return errors.New("error deleting User")
	}
	return nil
}

//AddSignIn logs all user sign-in attempts, as defined by calls to the
//POST /v1/sessions endpoint.
func (msq *MySQLStore) AddSignIn(id int64, ipAddress string) error {
	signq := "insert into SignIns(id, dTime, ipAddress) values (?, NOW(), ?)"
	_, err := msq.db.Exec(signq, id, ipAddress)
	if err != nil {
		return errors.New("error adding sign-in")
	}
	return nil
}
