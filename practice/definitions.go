package practice

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"time"
)

type LogEntry struct {
	ID       uuid.UUID   `json:"id"`
	UserID   string      `json:"user_id"`
	Date     time.Time   `json:"date"`
	Duration int32       `json:"duration"`
	Title    string      `json:"title"`
	Note     string      `json:"note"`
	Labels   []*LogLabel `json:"labels,omitempty"`
}

type LogLabel struct {
	ID       uuid.UUID   `json:"id"`
	ParentID uuid.UUID   `json:"parent_id,omitempty"`
	Name     string      `json:"name"`
	Children []uuid.UUID `json:"children,omitempty"`
}

func (l LogLabel) String() string {
	return fmt.Sprintf("%s %s", l.ID, l.Name)
}

type (
	HTTPService interface {
		ListPracticeLogEntries(echo.Context) error
		ListPracticeLogLabels(echo.Context) error
	}

	LogStore interface {
		SelectLogEntries() ([]*LogEntry, error)
		SelectLogLabels() ([]*LogLabel, error)
		BatchInsertLogLabels(...*LogLabel) (int64, error)
		BatchInsertLogEntries(...*LogEntry) (int64, error)
	}
)
