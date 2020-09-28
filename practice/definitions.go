package practice

import (
	"fmt"
	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"time"
)

type LogEntry struct {
	ID          uuid.UUID        `json:"id"`
	UserID      string           `json:"user_id" validate:"required,email"`
	Date        time.Time        `json:"date" validate:"required"`
	Duration    int32            `json:"duration" validate:"required"`
	Labels      []*LogLabel      `json:"labels,omitempty" validate:"required,min=1"`
	Message     string           `json:"message" validate:"required"`
	Details     string           `json:"details"`
	Assignments []*LogAssignment `json:"assignments,omitempty"`
}

type LogAssignment struct {
	Position  int    `json:"position"`
	Name      string `json:"name"`
	Completed bool   `json:"completed"`
}

type LogLabel struct {
	ID       uuid.UUID   `json:"id"`
	ParentID uuid.UUID   `json:"parent_id,omitempty"`
	Name     string      `json:"name" validate:"required"`
	Children []uuid.UUID `json:"children,omitempty"`
}

func (l LogLabel) String() string {
	return fmt.Sprintf("%s %s", l.ID, l.Name)
}

type (
	HTTPService interface {
		ListPracticeLogEntries(echo.Context) error
		ListPracticeLogLabels(echo.Context) error
		UpdatePracticeLogAssignments(echo.Context) error
		CreatePracticeLogEntry(echo.Context) error
		UpdatePracticeLogEntry(echo.Context) error
	}

	SQLFilter func(squirrel.Eq)

	LogStore interface {
		CountLogEntries(...SQLFilter) (int, error)
		SelectLogEntries(limit, offset uint64, filters ...SQLFilter) ([]*LogEntry, error)
		SelectLogLabels() ([]*LogLabel, error)
		BatchInsertLogLabels(...*LogLabel) (int64, error)
		BatchInsertLogEntries(...*LogEntry) (int64, error)
		UpdateLogEntry(*LogEntry) error
		UpdateLogAssignments(*LogEntry) error
	}
)
