package httphandler

import (
	"fmt"
	"net/http"

	"github.com/calvinfeng/playground/datastore"
	"github.com/labstack/echo/v4"
)

func MonthlyProgressRecordingListHandler(cfg Config) echo.HandlerFunc {
	return func(c echo.Context) error {
		recordings, err := cfg.Store.SelectRecordings(datastore.ByMonthlyProgressRecordings())
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query database %w", err))
		}

		resp := new(RecordingListJSONResponse)
		resp.Count = len(recordings)
		resp.Results = make([]RecordingJSON, 0, len(recordings))
		for _, recording := range recordings {
			month, ok := monthNames[recording.Month]
			if !ok {
				continue
			}
			resp.Results = append(resp.Results, RecordingJSON{
				Year:           recording.Year,
				Month:          month,
				Day:            recording.Day,
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
		filters = append(filters, datastore.ByPracticeRecordings())
		recordings, err := cfg.Store.SelectRecordings(filters...)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query database %w", err))
		}

		resp := new(RecordingListJSONResponse)
		resp.Count = len(recordings)
		resp.Results = make([]RecordingJSON, 0, len(recordings))
		for _, recording := range recordings {
			month, ok := monthNames[recording.Month]
			if !ok {
				continue
			}
			resp.Results = append(resp.Results, RecordingJSON{
				Year:           recording.Year,
				Month:          month,
				Day:            recording.Day,
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

	return filters
}
