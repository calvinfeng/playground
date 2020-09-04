package practicelog

import (
	"github.com/google/uuid"
	"time"
)

type Entry struct {
	ID       uuid.UUID `json:"id"`
	UserID   string    `json:"user_id"`
	Date     time.Time `json:"date"`
	Duration int32     `json:"duration"`
	Title    string    `json:"title"`
	Note     string    `json:"note"`
	Labels   []*Label  `json:"labels,omitempty"`
}

type Label struct {
	ID       uuid.UUID `json:"id"`
	ParentID uuid.UUID `json:"parent_id,omitempty"`
	Name     string    `json:"name"`
	Children []*Label  `json:"children,omitempty"`
}

type (
	Store interface {
		SelectLogEntries() ([]*Entry, error)
		SelectLogLabels() ([]*Label, error)
		BatchInsertLogLabels(...*Label) (int64, error)
		BatchInsertLogEntries(...*Entry) (int64, error)
	}
)
