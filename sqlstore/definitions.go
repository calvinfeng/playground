package sqlstore

const DatabaseName = "blog"

type Store interface {
	SelectRecordings() ([]*PracticeRecording, error)
	BatchInsertRecordings(...*PracticeRecording) (int64, error)
}

type PracticeRecording struct {
	ID               int64  `db:"id"`
	RecordedYear     int64  `db:"recorded_year"`
	RecordedMonth    int64  `db:"recorded_month"`
	RecordedDay      int64  `db:"recorded_day"`
	IsProgressReport int64  `db:"is_progress_report"`
	VideoOrientation string `db:"video_orientation"`
	YoutubeURL       string `db:"youtube_url"`
	Title            string `db:"title"`
	Description      string `db:"description"`
}

func (PracticeRecording) Table() string {
	return "practice_recordings"
}
