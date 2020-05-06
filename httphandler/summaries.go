package httphandler

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"net/http"
)

func MonthlySummaryListHandler(cfg Config) echo.HandlerFunc {
	return func(c echo.Context) error {
		filters := buildFiltersFromContext(c)

		summaries, err := cfg.Store.SelectMonthlySummaries(filters...)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query database %w", err))
		}

		resp := new(SummaryListJSONResponse)
		resp.Count = len(summaries)
		resp.Results = make([]SummaryJSON, 0, len(summaries))
		for _, summary := range summaries {
			month, ok := monthNames[summary.Month]
			if !ok {
				continue
			}
			resp.Results = append(resp.Results, SummaryJSON{
				Year:     summary.Year,
				Month:    month,
				Title:    summary.Title,
				Subtitle: summary.Subtitle,
				Body:     summary.Body,
			})
		}

		return c.JSON(http.StatusOK, resp)
	}
}
