package logstore

import (
	"encoding/json"
	"github.com/calvinfeng/playground/practicelog"
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
	Message     string          `db:"message"`
	Details     string          `db:"details"`
	Assignments json.RawMessage `db:"assignments"`
}

func (row *DBPracticeLogEntry) fromModel(model *practicelog.Entry) *DBPracticeLogEntry {
	row.ID = model.ID
	row.UserID = model.UserID
	row.Date = model.Date
	row.Message = model.Message
	row.Details = model.Details
	row.Duration = model.Duration
	row.Assignments, _ = json.Marshal(model.Assignments)
	return row
}

func (row *DBPracticeLogEntry) toModel() *practicelog.Entry {
	model := &practicelog.Entry{
		ID:          row.ID,
		UserID:      row.UserID,
		Date:        row.Date,
		Duration:    row.Duration,
		Message:     row.Message,
		Details:     row.Details,
		Labels:      nil,
		Assignments: make([]*practicelog.Assignment, 0),
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

func (row *DBPracticeLogLabel) fromModel(model *practicelog.Label) *DBPracticeLogLabel {
	row.ID = model.ID
	row.ParentID = model.ParentID
	row.Name = model.Name
	return row
}

func (row *DBPracticeLogLabel) toModel() *practicelog.Label {
	model := &practicelog.Label{
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
