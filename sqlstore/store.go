package sqlstore

import (
	"fmt"
	"github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
)

func New(db *sqlx.DB) Store {
	return &store{
		db: db,
	}
}

type store struct {
	db *sqlx.DB
}

func (s *store) SelectRecordings() ([]*PracticeRecording, error) {
	query := squirrel.Select("*").
		From((PracticeRecording{}).Table()).
		OrderBy("recorded_year DESC, recorded_month DESC")

	statement, args, err := query.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to construct query %w", err)
	}

	rows, err := s.db.Queryx(statement, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query database %w", err)
	}

	recordings := make([]*PracticeRecording, 0)
	for rows.Next() {
		recording := new(PracticeRecording)
		err := rows.StructScan(&recording)
		if err != nil {
			return nil, fmt.Errorf("failed to scan recording into struct %w", err)
		}
		recordings = append(recordings, recording)
	}
	return recordings, nil
}

func (s *store) BatchInsertRecordings(recordings ...*PracticeRecording) (int64, error) {
	query := squirrel.Insert((PracticeRecording{}).Table()).
		Columns("recorded_year", "recorded_month", "is_progress_report", "youtube_url", "video_orientation", "title", "description")

	for _, recording := range recordings {
		query = query.Values(
			recording.RecordedYear,
			recording.RecordedMonth,
			recording.IsProgressReport,
			recording.YoutubeURL,
			recording.VideoOrientation,
			recording.Title,
			recording.Description)
	}

	statement, args, err := query.PlaceholderFormat(squirrel.Dollar).ToSql()
	if err != nil {
		return 0, fmt.Errorf("failed to construct query: %w", err)
	}

	res, err := s.db.Exec(statement, args...)
	if err != nil {
		return 0, err
	}
	return res.RowsAffected()
}
