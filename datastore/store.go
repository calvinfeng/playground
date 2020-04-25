package datastore

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

func (s *store) SelectRecordings(filters ...SQLFilter) ([]*PracticeRecording, error) {
	query := squirrel.Select("*").
		From((PracticeRecording{}).Table()).
		OrderBy("recorded_year DESC, recorded_month DESC, recorded_day DESC")

	eqCondition := squirrel.Eq{}
	for _, f := range filters {
		f(eqCondition)
	}

	statement, args, err := query.Where(eqCondition).PlaceholderFormat(squirrel.Dollar).ToSql()
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
		Columns("recorded_year", "recorded_month", "recorded_day", "is_progress_report", "youtube_video_id", "video_orientation", "title", "description")

	for _, recording := range recordings {
		query = query.Values(
			recording.RecordedYear,
			recording.RecordedMonth,
			recording.RecordedDay,
			recording.IsProgressReport,
			recording.YouTubeVideoID,
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
