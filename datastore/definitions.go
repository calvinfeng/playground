package datastore

import "github.com/Masterminds/squirrel"

const DatabaseName = "blog"

type SQLFilter func(squirrel.Eq)

type Store interface {
	SelectRecordings(...SQLFilter) ([]*PracticeRecording, error)
	SelectMonthlySummaries(...SQLFilter) ([]*MonthlySummary, error)
	BatchInsertRecordings(...*PracticeRecording) (int64, error)
	BatchInsertMonthlySummaries(...*MonthlySummary) (int64, error)
}

type PracticeRecording struct {
	ID               int64  `db:"id"`
	Year             int64  `db:"year"`
	Month            int64  `db:"month"`
	Day              int64  `db:"day"`
	IsProgressReport int64  `db:"is_progress_report"`
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
