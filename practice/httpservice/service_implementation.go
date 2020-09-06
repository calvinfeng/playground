package httpservice

import (
	"fmt"
	"github.com/calvinfeng/playground/practice"
	"github.com/labstack/echo/v4"
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

func (s *service) ListPracticeLogEntries(c echo.Context) error {
	resp := new(PracticeLogEntryListJSONResponse)
	entries, err := s.store.SelectLogEntries()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query store%w", err))
	}
	resp.Results = entries
	return c.JSON(http.StatusOK, resp)
}
