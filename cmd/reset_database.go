package cmd

import (
	"fmt"
	"github.com/calvinfeng/playground/datastore"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"os"
)

var databaseFilePath = fmt.Sprintf("./%s.db", datastore.DatabaseName)

// Reset the database, apply migrations and then seed it.
func resetDatabaseRunE(_ *cobra.Command, _ []string) error {
	if fileExists(databaseFilePath) {
		if err := os.Remove(databaseFilePath); err != nil {
			return err
		}
	}

	m, err := migrate.New("file://./migrations", fmt.Sprintf("sqlite3://%s", databaseFilePath))
	if err != nil {
		return err
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to apply migrations: %w", err)
	}

	logrus.Infof("successfully reset database %s", databaseFilePath)
	return seed()
}

func seed() error {
	db, err := sqlx.Open("sqlite3", databaseFilePath)
	if err != nil {
		return err
	}
	db.SetMaxOpenConns(1)
	store := datastore.New(db)
	if numInserted, err := store.BatchInsertRecordings(recordings...); err != nil {
		return fmt.Errorf("failed to perform batch insert %w", err)
	} else {
		logrus.Infof("successfully seeded database with %d records", numInserted)
	}

	recordings, err := store.SelectRecordings(datastore.ByPracticeRecordings())
	if err != nil {
		return err
	}

	for _, recording := range recordings {
		fmt.Printf("Practice Recording %03d %d-%02d-%02d on %s\n",
			recording.ID, recording.RecordedYear, recording.RecordedMonth, recording.RecordedDay, recording.YoutubeURL)
	}

	recordings, err = store.SelectRecordings(datastore.ByMonthlyProgressRecordings())
	if err != nil {
		return err
	}

	for _, recording := range recordings {
		fmt.Printf("Monthly Progress Recording %03d %d-%02d-%02d on %s\n",
			recording.ID, recording.RecordedYear, recording.RecordedMonth, recording.RecordedDay, recording.YoutubeURL)
	}

	return nil
}

// fileExists checks if a file exists and is not a directory before we
// try using it to prevent further errors.
func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
