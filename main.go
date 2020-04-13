package main

import (
	"github.com/calvinfeng/playground/cmd"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	cmd.Execute()
}
