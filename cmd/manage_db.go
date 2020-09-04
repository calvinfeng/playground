package cmd

import (
	"errors"
	"fmt"
	"github.com/calvinfeng/playground/practicelog"
	"github.com/calvinfeng/playground/practicelog/logstore"
	"github.com/jmoiron/sqlx"
	"time"

	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"github.com/golang-migrate/migrate/v4"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

// Reset the database, apply migrationsV1 and then seed it.
func manageDBRunE(_ *cobra.Command, args []string) error {
	if len(args) < 1 {
		return errors.New("provide an argument to manage database [reset, migrate, seed]")
	}

	switch args[0] {
	case "reset":
		m, err := migrate.New("file://./migrationsV2", databaseAddress())
		if err != nil {
			return err
		}
		if err := m.Drop(); err != nil && err != migrate.ErrNoChange {
			return fmt.Errorf("failed to drop V2 migrations: %w", err)
		}
		if version, dirty, err := m.Version(); err != nil && err != migrate.ErrNilVersion {
			return err
		} else {
			logrus.Infof("successfully reset database to version %d, dirty=%v", version, dirty)
		}
		return nil
	case "migrate":
		m, err := migrate.New("file://./migrationsV2", databaseAddress())
		if err != nil {
			return err
		}
		if err := m.Up(); err != nil && err != migrate.ErrNoChange {
			return fmt.Errorf("failed to apply V2 migrations: %w", err)
		}
		if version, dirty, err := m.Version(); err != nil {
			return err
		} else {
			logrus.Infof("successfully migrated database to version %d, dirty=%v", version, dirty)
		}
		return nil
	case "seed":
		return seedFromTrello()
	default:
		return fmt.Errorf("%s is not a recognized command", args[0])
	}
}

func seedFromTrello() error {
	pg, err := sqlx.Open("postgres", databaseAddress())
	if err != nil {
		return err
	}
	store := logstore.New(pg)

	labels := []*practicelog.Label{
		{
			Name: "Song",
		},
		{
			Name: "Scales",
		},
		{
			Name: "Finger Gym",
		},
	}

	if inserted, err := store.BatchInsertLogLabels(labels...); err != nil {
		return err
	} else {
		logrus.Infof("inserted %d labels", inserted)
	}

	entries := []*practicelog.Entry{
		{
			UserID:   "calvin.j.feng@gmail.com",
			Date:     time.Now(),
			Duration: 30,
			Title:    "The Final Countdown 110 BPM",
			Note:     "it is getting very difficult to cover the last 10% speed",
			Labels:   []*practicelog.Label{labels[0]},
		},
		{
			UserID:   "calvin.j.feng@gmail.com",
			Date:     time.Now(),
			Duration: 30,
			Title:    "Now & Forever outro section",
			Note:     "it is difficult to memorize",
			Labels:   []*practicelog.Label{labels[0]},
		},
	}

	if inserted, err := store.BatchInsertLogEntries(entries...); err != nil {
		return err
	} else {
		logrus.Infof("inserted %d entries", inserted)
	}

	return nil
}
