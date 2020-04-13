package cmd

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

func init() {
	logrus.SetFormatter(&logrus.TextFormatter{
		ForceColors:   true,
		FullTimestamp: true,
	})
}

func Execute() {
	root := &cobra.Command{
		Use:   "calvinblog",
		Short: "this is my blog",
	}

	root.AddCommand(
		&cobra.Command{
			Use:   "reset_db",
			Short: "reset database and re-seed it",
			RunE:  resetDatabaseRunE,
		},
		&cobra.Command{
			Use:   "serve",
			Short: "serve application to clients",
			RunE:  serveRunE,
		},
	)

	if err := root.Execute(); err != nil {
		logrus.Fatal(fmt.Errorf("application server has run into critical error: %w", err))
	}
}
