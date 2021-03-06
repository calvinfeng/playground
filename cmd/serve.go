package cmd

import (
	"fmt"
	"github.com/spf13/viper"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"github.com/calvinfeng/playground/datastore"
	"github.com/calvinfeng/playground/httphandler"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

func serveRunE(_ *cobra.Command, _ []string) error {
	sqlite, err := sqlx.Open("sqlite3", databaseFilePath)
	if err != nil {
		return err
	}
	sqlite.SetMaxOpenConns(1)
	store := datastore.New(sqlite)

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.File("/", "playgroundui/build/index.html")
	e.File("/about", "playgroundui/build/index.html")
	e.File("/fretboard", "playgroundui/build/index.html")
	e.File("/mygear", "playgroundui/build/index.html")

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:   "playgroundui/build/",
		Browse: true,
	}))

	// 	e.Static("/", "./playgroundui/build/")
	e.GET("/api/v1/progress/recordings/", httphandler.ProgressRecordingListHandler(httphandler.Config{Store: store}))
	e.GET("/api/v1/practice/recordings/", httphandler.PracticeRecordingListHandler(httphandler.Config{Store: store}))
	e.GET("/api/v1/summaries/", httphandler.MonthlySummaryListHandler(httphandler.Config{Store: store}))
	e.GET("/api/v1/practice/time/", httphandler.PracticeTimeHandler(httphandler.Config{
		Store:          nil,
		TrelloAPIKey:   os.Getenv("TRELLO_API_KEY"),
		TrelloAPIToken: os.Getenv("TRELLO_API_TOKEN"),
		TrelloBoardID:  "woq8deqm", // This is Guitar Practice 2020. I might need multiple boards in 2021.
	}))

	logrus.Infof("http server is listening on %s", viper.GetString("http.port"))
	return e.Start(fmt.Sprintf(":%s", viper.GetString("http.port")))
}
