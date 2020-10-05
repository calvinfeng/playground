package cmd

import (
	"github.com/calvinfeng/playground/practice/httpservice"
	"github.com/calvinfeng/playground/practice/logstore"
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

	pg, err := sqlx.Open("postgres", databaseAddress())
	if err != nil {
		return err
	}
	logrus.Infof("pg is up %s", pg)

	srv := httpservice.New(logstore.New(pg))

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.File("/", "playgroundui/build/index.html")
	e.File("/about", "playgroundui/build/index.html")
	e.File("/practicelog", "playgroundui/build/index.html")
	e.File("/fretboard", "playgroundui/build/index.html")

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:   "playgroundui/build/",
		Browse: true,
	}))

	// 	e.Static("/", "./playgroundui/build/")
	e.GET("/api/v1/progress/recordings/", httphandler.ProgressRecordingListHandler(httphandler.Config{Store: store}))
	e.GET("/api/v1/summaries/", httphandler.MonthlySummaryListHandler(httphandler.Config{Store: store}))
	e.GET("/api/v1/practice/recordings/", httphandler.PracticeRecordingListHandler(httphandler.Config{Store: store}))
	e.GET("/api/v1/practice/time/", httphandler.PracticeTimeHandler(httphandler.Config{
		Store:          nil,
		TrelloAPIKey:   os.Getenv("TRELLO_API_KEY"),
		TrelloAPIToken: os.Getenv("TRELLO_API_TOKEN"),
		TrelloBoardID:  "woq8deqm", // This is Guitar Practice 2020. I might need multiple boards in 2021.
	}))
	e.GET("/api/v2/practice/log/labels/", srv.ListPracticeLogLabels)
	e.POST("/api/v2/practice/log/labels/", srv.CreatePracticeLogLabel)
	e.PUT("/api/v2/practice/log/labels/:label_id/", srv.UpdatePracticeLogLabel)

	e.GET("/api/v2/practice/log/entries/", srv.ListPracticeLogEntries)
	e.POST("/api/v2/practice/log/entries/", srv.CreatePracticeLogEntry)
	e.PUT("/api/v2/practice/log/entries/:entry_id/assignments/", srv.UpdatePracticeLogAssignments)
	e.PUT("/api/v2/practice/log/entries/:entry_id/", srv.UpdatePracticeLogEntry)

	logrus.Infof("http server is listening on 8080")
	return e.Start(":8080")
}
