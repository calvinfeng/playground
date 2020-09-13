package httpservice

import (
	"fmt"
	"github.com/calvinfeng/playground/practice"
	"github.com/calvinfeng/playground/practice/logstore"
	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"net/http"
)

func New(store practice.LogStore) practice.HTTPService {
	return &service{
		store: store,
	}
}

type service struct {
	store practice.LogStore
}

func (s *service) UpdatePracticeLogAssignments(c echo.Context) error {
	entry := new(practice.LogEntry)
	if err := c.Bind(entry); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest,
			errors.Wrap(err, "failed to parse JSON data").Error())
	}

	for i, assignment := range entry.Assignments {
		if assignment.Position != i {
			return echo.NewHTTPError(http.StatusBadRequest,
				"assignments must have correct position values, [0, ..., N]")
		}
	}

	if err := s.store.UpdateLogAssignments(entry); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError,
			errors.Wrap(err, "failed to update log assignments").Error())
	}

	entryID := c.Param("entry_id")

	entries, err := s.store.SelectLogEntries(1, 0, logstore.ByID(entryID))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError,
			fmt.Errorf("server failed to query store %w", err))
	}

	return c.JSON(http.StatusOK, entries[0])
}

func (s *service) ListPracticeLogEntries(c echo.Context) error {
	count, err := s.store.CountLogEntries()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError,
			errors.Wrap(err, "server failed to query database").Error())
	}

	limit, offset := getLimitOffsetFromContext(c)

	resp := new(PracticeLogEntryListJSONResponse)
	if count > int(limit)+int(offset) {
		resp.More = true
	}

	entries, err := s.store.SelectLogEntries(limit, offset)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError,
			fmt.Errorf("server failed to query store %w", err))
	}
	resp.Results = entries
	resp.Count = len(entries)

	return c.JSON(http.StatusOK, resp)
}

func (s *service) ListPracticeLogLabels(c echo.Context) error {
	resp := new(PracticeLogLabelListJSONResponse)
	labels, err := s.store.SelectLogLabels()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError,
			fmt.Errorf("server failed to query store %w", err))
	}
	resp.Results = labels
	return c.JSON(http.StatusOK, resp)
}
