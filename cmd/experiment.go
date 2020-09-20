package cmd

import (
	"errors"
	"fmt"
	"github.com/calvinfeng/playground/practice/logstore"
	"github.com/calvinfeng/playground/trelloapi"
	"github.com/calvinfeng/playground/youtubeapi"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"os"
)

func testYouTubeAPI() error {
	srv := youtubeapi.New(youtubeapi.Config{
		APIKey: os.Getenv("GOOGLE_API_KEY"),
	})

	items, err := srv.PlaylistItems("PLvb0sLP6w4rIq7kS4-D4zDcbFPNZOSUhW")
	if err != nil {
		return err
	}

	logrus.Infof("found %d playlist items", len(items))

	for _, item := range items {
		logrus.Infof("%s %s is uploaded on %s", item.ContentDetails.VideoID, item.Snippet.Title, item.ContentDetails.Published)
	}
	return nil
}

func testTrelloAPI() error {
	srv := trelloapi.New(trelloapi.Config{
		TrelloAPIKey:   os.Getenv("TRELLO_API_KEY"),
		TrelloAPIToken: os.Getenv("TRELLO_API_TOKEN"),
	})

	labels, err := srv.TrelloLabelsByBoard("woq8deqm")
	if err != nil {
		return err
	}

	cards, err := srv.TrelloCardsByBoard("woq8deqm")
	if err != nil {
		return err
	}

	lists, err := srv.TrelloChecklistsByBoard("woq8deqm")
	if err != nil {
		return err
	}

	for _, list := range lists {
		logrus.Infof("list %s %s has %d items", list.ID, list.Name, len(list.Items))
		for _, item := range list.Items {
			fmt.Println(item.Name, item.State)
		}
	}

	for _, card := range cards {
		labelNames := make([]string, 0, len(card.LabelIDs))
		for _, labelID := range card.LabelIDs {
			if val, ok := labels[labelID]; ok {
				labelNames = append(labelNames, val.Name)
			}
		}
		logrus.Infof("%s %s %s with labels %s", card.ID, card.Name, card.Description, labelNames)
	}
	return nil
}

func testPracticeLogStoreUpdate() error {
	pg, err := sqlx.Open("postgres", databaseAddress())
	if err != nil {
		return err
	}

	store := logstore.New(pg)

	entries, err := store.SelectLogEntries(20, 0, logstore.ByID("6c9cbb07-9bd6-4cf0-9772-1c9e9753728a"))
	if err != nil {
		return err
	}

	if len(entries) != 1 {
		return errors.New("entry not found")
	}

	target := entries[0]

	logrus.Infof("target %s %s has %d labels", target.ID, target.Message, len(target.Labels))
	for _, label := range target.Labels {
		logrus.Info(label.Name)
	}

	if len(target.Labels) == 0 {
		return errors.New("target entry has no labels")
	}

	logrus.Infof("removing label %s", target.Labels[0].Name)
	target.Labels = target.Labels[1:]

	if err := store.UpdateLogEntry(target); err != nil {
		return err
	}
	return nil
}

func testPracticeLogStoreSelect() error {
	pg, err := sqlx.Open("postgres", databaseAddress())
	if err != nil {
		return err
	}

	store := logstore.New(pg)
	entries, err := store.SelectLogEntries(100, 0, logstore.ByLabelIDs([]string{"a760477b-088d-4e59-a7f6-22601c4817d9"}))
	if err != nil {
		return err
	}

	var dur int32
	for _, entry := range entries {
		logrus.Infof("entry %s %s %s", entry.ID, entry.Date.String(), entry.Message)
		dur += entry.Duration
	}
	logrus.Infof("%d minutes spent", dur)

	return nil
}

func experimentRunE(_ *cobra.Command, _ []string) error {
	return testPracticeLogStoreSelect()
}
