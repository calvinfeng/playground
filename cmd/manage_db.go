package cmd

import (
	"errors"
	"fmt"
	"github.com/calvinfeng/playground/practicelog"
	"github.com/calvinfeng/playground/practicelog/logstore"
	"github.com/calvinfeng/playground/trelloapi"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jmoiron/sqlx"
	"os"
	"strings"
	"time"

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
	boardID := "woq8deqm"
	api := trelloapi.New(trelloapi.Config{
		TrelloAPIKey:   os.Getenv("TRELLO_API_KEY"),
		TrelloAPIToken: os.Getenv("TRELLO_API_TOKEN"),
	})

	pg, err := sqlx.Open("postgres", databaseAddress())
	if err != nil {
		return err
	}

	store := logstore.New(pg)
	logLabels := []*practicelog.Label{
		{Name: "Songs"},
		{Name: "Scales"},
		{Name: "Finger Exercises"},
		{Name: "Acoustic"},
		{Name: "Blues"},
		{Name: "Guitar Lessons"},
		{Name: "Band"},
	}
	if inserted, err := store.BatchInsertLogLabels(logLabels...); err != nil {
		logrus.WithError(err).Error("failed to batch insert log labels")
	} else {
		logrus.Infof("inserted %d log labels", inserted)
	}

	subLogLabels := []*practicelog.Label{
		{Name: "Acoustic Rhythm", ParentID: logLabels[4].ID},
		{Name: "Barre Chords", ParentID: logLabels[2].ID},
		{Name: "Chord Change", ParentID: logLabels[2].ID},
	}

	if inserted, err := store.BatchInsertLogLabels(subLogLabels...); err != nil {
		logrus.WithError(err).Error("failed to batch insert log labels")
	} else {
		logrus.Infof("inserted %d log labels", inserted)
	}

	logLabelsByName := make(map[string]*practicelog.Label)
	logLabels, err = store.SelectLogLabels()
	if err != nil {
		return err
	}

	for _, logLabel := range logLabels {
		logLabelsByName[logLabel.Name] = logLabel
	}

	trelloLabels, err := api.TrelloLabelsByBoard(boardID)
	if err != nil {
		return err
	}

	trelloLabelsByID := make(map[string]trelloapi.TrelloLabel)
	for _, label := range trelloLabels {
		trelloLabelsByID[label.ID] = label
	}

	cards, err := api.TrelloCardsByBoard(boardID)
	if err != nil {
		return err
	}

	for _, card := range cards {
		if card.IsTemplate {
			continue
		}

		entry := new(practicelog.Entry)
		entry.Title = card.Name
		entry.Note = card.Description
		entry.Labels = make([]*practicelog.Label, 0)
		for _, labelID := range card.LabelIDs {
			label, ok := trelloLabelsByID[labelID]
			if !ok {
				logrus.Fatalf("label %d not found", labelID)
			}

			if strings.HasSuffix(label.Name, "m") {
				duration, err := time.ParseDuration(label.Name)
				if err != nil {
					logrus.WithError(err).Error("failed to parse label name as duration")
				}
				entry.Duration = int32(duration.Minutes())
			} else {
				// Hard coding it is more error proof given the small number.
				switch label.Name {
				case "Barre Chords":
					entry.Labels = append(entry.Labels, logLabelsByName["Barre Chords"])
				case "Chord Change":
					entry.Labels = append(entry.Labels, logLabelsByName["Chord Change"])
				case "Finger Gym":
					entry.Labels = append(entry.Labels, logLabelsByName["Finger Exercises"])
				case "Rhythm":
					entry.Labels = append(entry.Labels, logLabelsByName[""])
				case "Blues":
					entry.Labels = append(entry.Labels, logLabelsByName[""])
				case "Repertoire":
					entry.Labels = append(entry.Labels, logLabelsByName[""])
				case "Music Jam":
					entry.Labels = append(entry.Labels, logLabelsByName[""])
				case "Scales":
					entry.Labels = append(entry.Labels, logLabelsByName[""])
				case "Guitar Lessons":
					entry.Labels = append(entry.Labels, logLabelsByName[""])
				}
			}
		}

		if card.Due == "" {
			logrus.Warnf("card %s %s does not have due date", card.ID, card.Name)
		} else {
			logrus.Infof("card %s due %s", card.ID, card.Due)
		}
	}

	//
	//entries := []*practicelog.Entry{
	//	{
	//		UserID:   "calvin.j.feng@gmail.com",
	//		Date:     time.Now(),
	//		Duration: 30,
	//		Title:    "The Final Countdown 110 BPM",
	//		Note:     "it is getting very difficult to cover the last 10% speed",
	//		Labels:   []*practicelog.Label{labels[0]},
	//	},
	//	{
	//		UserID:   "calvin.j.feng@gmail.com",
	//		Date:     time.Now(),
	//		Duration: 30,
	//		Title:    "Now & Forever outro section",
	//		Note:     "it is difficult to memorize",
	//		Labels:   []*practicelog.Label{labels[0]},
	//	},
	//}
	//
	//if inserted, err := store.BatchInsertLogEntries(entries...); err != nil {
	//	return err
	//} else {
	//	logrus.Infof("inserted %d entries", inserted)
	//}

	return nil
}
