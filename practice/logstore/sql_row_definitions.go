package logstore

import (
	"encoding/json"
	"github.com/calvinfeng/playground/practice"
	"github.com/google/uuid"
	"time"
)

const PracticeLogEntryTable = "practice_log_entries"
const PracticeLogLabelTable = "practice_log_labels"
const AssociationPracticeLogEntryLabelTable = "association_practice_log_entries_labels"

type DBPracticeLogEntry struct {
	ID          uuid.UUID       `db:"id"`
	UserID      string          `db:"user_id"`
	Date        time.Time       `db:"date"`
	Duration    int32           `db:"duration"`
	Title       string          `db:"title"`
	Note        string          `db:"note"`
	Assignments json.RawMessage `db:"assignments"`
}

func (row *DBPracticeLogEntry) fromModel(model *practice.LogEntry) *DBPracticeLogEntry {
	row.ID = model.ID
	row.UserID = model.UserID
	row.Date = model.Date
	row.Title = model.Title
	row.Note = model.Note
	row.Duration = model.Duration
	row.Assignments, _ = json.Marshal(model.Assignments)
	return row
}

func (row *DBPracticeLogEntry) toModel() *practice.LogEntry {
	model := &practice.LogEntry{
		ID:          row.ID,
		UserID:      row.UserID,
		Date:        row.Date,
		Duration:    row.Duration,
		Title:       row.Title,
		Note:        row.Note,
		Labels:      nil,
		Assignments: make([]*practice.Assignment, 0),
	}
	_ = json.Unmarshal(row.Assignments, &model.Assignments)
	return model
}

type DBPracticeLogLabel struct {
	ID       uuid.UUID `db:"id"`
	ParentID uuid.UUID `db:"parent_id"`
	Name     string    `db:"name"`
}

type DBReadOnlyPracticeLogLabel struct {
	ID       uuid.UUID `db:"label_id"`
	ParentID uuid.UUID `db:"parent_id"`
	Name     string    `db:"name"`
	EntryID  uuid.UUID `db:"entry_id"`
}

func (row *DBPracticeLogLabel) fromModel(model *practice.LogLabel) *DBPracticeLogLabel {
	row.ID = model.ID
	row.ParentID = model.ParentID
	row.Name = model.Name
	return row
}

func (row *DBPracticeLogLabel) toModel() *practice.LogLabel {
	model := &practice.LogLabel{
		ID:       row.ID,
		ParentID: row.ParentID,
		Name:     row.Name,
		Children: nil,
	}
	return model
}

// DBAssociationPracticeLogEntryLabel represents the row data structure of a LEFT JOIN.
//
type DBAssociationPracticeLogEntryLabel struct {
	AssociationID uuid.UUID `db:"association_id"`
	EntryID       uuid.UUID `db:"entry_id"`
	LabelID       uuid.UUID `db:"label_id"`
	DBPracticeLogLabel
}
