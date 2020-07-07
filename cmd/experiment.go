package cmd

import (
	"github.com/calvinfeng/playground/youtubeapi"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"os"
)

func experimentRunE(_ *cobra.Command, _ []string) error {
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
