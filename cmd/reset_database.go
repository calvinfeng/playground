package cmd

import (
	"fmt"
	"github.com/calvinfeng/playground/youtubeapi"
	"os"
	"strings"

	"github.com/calvinfeng/playground/data"
	"github.com/calvinfeng/playground/datastore"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var databaseFilePath = fmt.Sprintf("./%s.db", datastore.DatabaseName)

// Reset the database, apply migrations and then seed it.
func resetDatabaseRunE(_ *cobra.Command, _ []string) error {
	if fileExists(databaseFilePath) {
		if err := os.Remove(databaseFilePath); err != nil {
			return err
		}
	}

	m, err := migrate.New("file://./migrations", fmt.Sprintf("sqlite3://%s", databaseFilePath))
	if err != nil {
		return err
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to apply migrations: %w", err)
	}

	logrus.Infof("successfully reset database %s", databaseFilePath)
	return seed()
}

func seed() error {
	db, err := sqlx.Open("sqlite3", databaseFilePath)
	if err != nil {
		return err
	}
	db.SetMaxOpenConns(1)
	store := datastore.New(db)

	logrus.Infof("inserting %d monthly summaries", len(data.Summaries))
	if numInserted, err := store.BatchInsertMonthlySummaries(data.Summaries...); err != nil {
		return fmt.Errorf("failed to perform batch insert %w", err)
	} else {
		logrus.Infof("successfully seeded database with %d records", numInserted)
	}

	srv := youtubeapi.New(youtubeapi.Config{
		APIKey: os.Getenv("GOOGLE_API_KEY"),
	})

	practiceRecordings, err := loadPracticeRecordings(srv)
	if err != nil {
		return fmt.Errorf("failed to load practice recordings from YouTube %w", err)
	}

	logrus.Infof("inserting %d practice recordings", len(practiceRecordings))
	if numInserted, err := store.BatchInsertPracticeRecordings(practiceRecordings...); err != nil {
		return fmt.Errorf("failed to perform batch insert %w", err)
	} else {
		logrus.Infof("successfully seeded database with %d records", numInserted)
	}

	practices, err := store.SelectPracticeRecordings()
	if err != nil {
		return err
	}

	for _, recording := range practices {
		fmt.Printf("Practice Recording %03d %d-%02d-%02d %s\n",
			recording.ID, recording.Year, recording.Month, recording.Day, recording.YouTubeVideoID)
	}

	progressRecordings, err := loadProgressRecordings(srv)
	if err != nil {
		return fmt.Errorf("failed to load progress recordings from YouTube %w", err)
	}

	logrus.Infof("inserting %d progress recordings", len(progressRecordings))
	if numInserted, err := store.BatchInsertProgressRecordings(progressRecordings...); err != nil {
		return fmt.Errorf("failed to perform batch insert %w", err)
	} else {
		logrus.Infof("successfully seeded database with %d records", numInserted)
	}

	progresses, err := store.SelectProgressRecordings()
	if err != nil {
		return err
	}

	for _, recording := range progresses {
		fmt.Printf("Monthly Progress Recording %03d %d-%02d %s\n",
			recording.ID, recording.Year, recording.Month, recording.YouTubeVideoID)
	}

	return nil
}

// fileExists checks if a file exists and is not a directory before we
// try using it to prevent further errors.
func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

const progressRecordingPlaylistID = "PLvb0sLP6w4rL8s3iDlfdOdA3_X2QNmMoB"

func loadProgressRecordings(srv youtubeapi.Service) ([]*datastore.ProgressRecording, error) {
	items, err := srv.PlaylistItems(progressRecordingPlaylistID)
	if err != nil {
		return nil, err
	}

	if len(items) == 0 {
		return nil, fmt.Errorf("YouTube API has returned 0 items for playlist %s", progressRecordingPlaylistID)
	}
	
	recordings := make([]*datastore.ProgressRecording, 0, len(items))
	for _, item := range items {
		recording := &datastore.ProgressRecording{
			ID:               item.Snippet.Position,
			Year:             int64(item.ContentDetails.Published.Year()),
			Month:            int64(item.ContentDetails.Published.Month()),
			VideoOrientation: data.Landscape,
			YouTubeVideoID:   item.ContentDetails.VideoID,
			Title:            item.Snippet.Title,
		}
		// Optionally save thumbnail URL in the future
		if strings.Contains(recording.Title, "AR 9:16") {
			recording.VideoOrientation = data.Portrait
		}
		recordings = append(recordings, recording)
	}
	return recordings, nil
}

const practiceRecordingPlaylistID = "PLvb0sLP6w4rIq7kS4-D4zDcbFPNZOSUhW"

func loadPracticeRecordings(srv youtubeapi.Service) ([]*datastore.PracticeRecording, error) {
	items, err := srv.PlaylistItems(practiceRecordingPlaylistID)
	if err != nil {
		return nil, err
	}

	if len(items) == 0 {
		return nil, fmt.Errorf("YouTube API has returned 0 items for playlist %s", practiceRecordingPlaylistID)
	}

	recordings := make([]*datastore.PracticeRecording, 0, len(items))
	for _, item := range items {
		recording := &datastore.PracticeRecording{
			Year:             int64(item.ContentDetails.Published.Year()),
			Month:            int64(item.ContentDetails.Published.Month()),
			Day:              int64(item.ContentDetails.Published.Day()),
			VideoOrientation: data.Landscape,
			YouTubeVideoID:   item.ContentDetails.VideoID,
			Title:            item.Snippet.Title,
		}
		// Optionally save thumbnail URL in the future
		if strings.Contains(recording.Title, "AR 9:16") {
			recording.VideoOrientation = data.Portrait
		}
		recordings = append(recordings, recording)
	}
	return recordings, nil
}
