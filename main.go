package main

import (
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func runMigrations() error {
	m, err := migrate.New("file://./migrations", "sqlite3://./calvinblog.db")
	if err != nil {
		return err
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return err
	}
	return nil
}

type Person struct {
	ID string `db:"id"`
	FirstName string `db:"first_name"`
	LastName string `db:"last_name"`
}

func main() {
	if err := runMigrations(); err != nil {
		panic(err)
	}

	db, err := sqlx.Open("sqlite3", "./calvinblog.db")
	if err != nil {
		panic(err)
	}
	db.SetMaxOpenConns(1)

	db.MustExec("INSERT INTO people (first_name, last_name) VALUES($1, $2)", "Calvin", "Feng")
	db.MustExec("INSERT INTO people (first_name, last_name) VALUES($1, $2)", "Carmen", "To")

	people := []Person{}
	if err := db.Select(&people, "SELECT * FROM people ORDER BY first_name ASC"); err != nil {
		panic(err)
	}

	fmt.Println(people)
}