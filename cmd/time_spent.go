package cmd

import (
	"errors"
	"fmt"
	"github.com/calvinfeng/playground/practicelog"
	"github.com/calvinfeng/playground/practicelog/logstore"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

func timeSpentRunE(_ *cobra.Command, args []string) error {
	if len(args) < 1 {
		return errors.New("please provide label names")
	}

	pg, err := sqlx.Open("postgres", databaseAddress())
	if err != nil {
		return err
	}

	store := logstore.New(pg)

	labels, err := store.SelectLogLabels()
	if err != nil {
		return err
	}

	labelByName := make(map[string]*practicelog.Label)
	for _, label := range labels {
		labelByName[label.Name] = label
	}

	labelIDs := make([]string, 0)
	for _, name := range args {
		label, ok := labelByName[name]
		if !ok {
			return fmt.Errorf("label %s not found", name)
		}
		logrus.Infof("found label %s", label.Name)
		labelIDs = append(labelIDs, label.ID.String())
	}

	entries, err := store.SelectLogEntries(100, 0, logstore.ByLabelIDs(labelIDs))
	if err != nil {
		return err
	}
	logrus.Infof("query returned %d practicelog log entries", len(entries))

	var dur int32
	for _, entry := range entries {
		year, month, day := entry.Date.Date()
		logrus.Infof("entry %s %04d-%02d-%02d %s", entry.ID, year, month, day, entry.Message)
		dur += entry.Duration
	}
	logrus.Infof("total practicelog time %d hours and %d minutes", dur/60, dur%60)

	return nil
}
