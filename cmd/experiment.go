package cmd

import (
	"github.com/calvinfeng/playground/practice/logstore"
	"github.com/calvinfeng/playground/trelloapi"
	"github.com/calvinfeng/playground/youtubeapi"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"os"
)

func showPlaylistItems() error {
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

func showTrelloCards() error {
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

func experimentRunE(_ *cobra.Command, _ []string) error {
	pg, err := sqlx.Open("postgres", databaseAddress())
	if err != nil {
		return err
	}

	store := logstore.New(pg)

	entries, err := store.SelectLogEntries(20, 0)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		logrus.Infof("entry %s %s has labels", entry.ID, entry.Title, entry.Labels)
	}
	return nil
}
