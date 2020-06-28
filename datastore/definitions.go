package datastore

import "github.com/Masterminds/squirrel"

const DatabaseName = "blog"

type SQLFilter func(squirrel.Eq)

type Store interface {
	SelectPracticeRecordings(...SQLFilter) ([]*PracticeRecording, error)
	SelectProgressRecordings(...SQLFilter) ([]*ProgressRecording, error)
	SelectMonthlySummaries(...SQLFilter) ([]*MonthlySummary, error)
	BatchInsertPracticeRecordings(...*PracticeRecording) (int64, error)
	BatchInsertProgressRecordings(...*ProgressRecording) (int64, error)
	BatchInsertMonthlySummaries(...*MonthlySummary) (int64, error)
}

type ProgressRecording struct {
	ID               int64  `db:"id"`
	Year             int64  `db:"year"`
	Month            int64  `db:"month"`
	VideoOrientation string `db:"video_orientation"`
	YouTubeVideoID   string `db:"youtube_video_id"`
	Title            string `db:"title"`
}

func (ProgressRecording) Table() string {
	return "progress_recordings"
}

type PracticeRecording struct {
	ID               int64  `db:"id"`
	Year             int64  `db:"year"`
	Month            int64  `db:"month"`
	Day              int64  `db:"day"`
	VideoOrientation string `db:"video_orientation"`
	YouTubeVideoID   string `db:"youtube_video_id"`
	Title            string `db:"title"`
}

func (PracticeRecording) Table() string {
	return "practice_recordings"
}

type MonthlySummary struct {
	ID       int64  `db:"id"`
	Year     int64  `db:"year"`
	Month    int64  `db:"month"`
	Title    string `db:"title"`
	Subtitle string `db:"subtitle"`
	Body     string `db:"body"`
}

func (MonthlySummary) Table() string {
	return "monthly_summaries"
}
