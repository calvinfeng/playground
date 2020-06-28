package httphandler

import (
	"fmt"
	"net/http"

	"github.com/calvinfeng/playground/datastore"
	"github.com/labstack/echo/v4"
)

func ProgressRecordingListHandler(cfg Config) echo.HandlerFunc {
	return func(c echo.Context) error {
		filters := buildFiltersFromContext(c)

		recordings, err := cfg.Store.SelectProgressRecordings(filters...)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query database %w", err))
		}

		resp := new(PracticeRecordingListJSONResponse)
		resp.Count = len(recordings)
		resp.Results = make([]PracticeRecordingJSON, 0, len(recordings))
		for _, recording := range recordings {
			month, ok := monthNames[recording.Month]
			if !ok {
				continue
			}
			resp.Results = append(resp.Results, PracticeRecordingJSON{
				Year:           recording.Year,
				Month:          month,
				YouTubeVideoID: recording.YouTubeVideoID,
				Title:          recording.Title,
				Orientation:    recording.VideoOrientation,
			})
		}

		return c.JSON(http.StatusOK, resp)
	}
}

func PracticeRecordingListHandler(cfg Config) echo.HandlerFunc {
	return func(c echo.Context) error {
		filters := buildFiltersFromContext(c)

		recordings, err := cfg.Store.SelectPracticeRecordings(filters...)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query database %w", err))
		}

		resp := new(ProgressRecordingListJSONResponse)
		resp.Count = len(recordings)
		resp.Results = make([]ProgressRecordingJSON, 0, len(recordings))
		for _, recording := range recordings {
			month, ok := monthNames[recording.Month]
			if !ok {
				continue
			}
			resp.Results = append(resp.Results, ProgressRecordingJSON{
				Year:           recording.Year,
				Month:          month,
				Title:          recording.Title,
				Orientation:    recording.VideoOrientation,
				YouTubeVideoID: recording.YouTubeVideoID,
			})
		}

		return c.JSON(http.StatusOK, resp)
	}
}

func buildFiltersFromContext(c echo.Context) []datastore.SQLFilter {
	filters := make([]datastore.SQLFilter, 0)

	if c.QueryParam("year") != "" {
		filters = append(filters, datastore.ByYear(c.QueryParam("year")))
	}

	if c.QueryParam("month") != "" {
		filters = append(filters, datastore.ByMonth(c.QueryParam("month")))
	}

	if c.QueryParam("id") != "" {
		filters = append(filters, datastore.ByID(c.QueryParam("id")))
	}

	return filters
}
