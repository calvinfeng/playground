package cmd

import (
	"github.com/calvinfeng/playground/datastore"
	"github.com/calvinfeng/playground/httphandler"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"net/http"
)

func serveRunE(_ *cobra.Command, _ []string) error {
	db, err := sqlx.Open("sqlite3", databaseFilePath)
	if err != nil {
		return err
	}
	db.SetMaxOpenConns(1)
	store := datastore.New(db)

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.File("/", "playgroundui/build/index.html")
	e.File("/about", "playgroundui/build/index.html")

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:   "playgroundui/build/",
		Browse: true,
	}))

	// 	e.Static("/", "./playgroundui/build/")
	e.GET("/api/recordings/practices/", httphandler.PracticeRecordingListHandler(httphandler.Config{Store: store}))
	e.GET("/api/recordings/progress_reports/", httphandler.MonthlyProgressRecordingListHandler(httphandler.Config{Store: store}))
	logrus.Infof("http server is listening on 8080")
	return e.Start(":8080")
}
