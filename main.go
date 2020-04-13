package main

import (
	"github.com/calvinfeng/calvinblog/cmd"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	cmd.Execute()
	//db, err := sqlx.Open("sqlite3", "./calvinblog.db")
	//if err != nil {
	//	panic(err)
	//}
	//db.SetMaxOpenConns(1)
	//
	//db.MustExec("INSERT INTO people (first_name, last_name) VALUES($1, $2)", "Calvin", "Feng")
	//db.MustExec("INSERT INTO people (first_name, last_name) VALUES($1, $2)", "Carmen", "To")
	//
	//people := []Person{}
	//if err := db.Select(&people, "SELECT * FROM people ORDER BY first_name ASC"); err != nil {
	//	panic(err)
	//}
	//
	//fmt.Println(people)
}
