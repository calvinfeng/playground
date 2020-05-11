package httphandler

import (
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"net/http"
	"net/url"
	"time"
)

func PracticeTimeHandler(cfg Config) echo.HandlerFunc {
	return func(c echo.Context) error {
		resp := new(PracticeTimeJSONResponse)

		labels, err := getTrelloLabelsFromBoard(cfg)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query Trello API %w", err))
		}

		cards, err := getTrelloCardsFromBoard(cfg)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Errorf("server failed to query Trello API %w", err))
		}

		var total time.Duration
		for _, card := range cards {
			if card.IsTemplate {
				continue
			}
			for _, labelID := range card.LabelIDs {
				if label, ok := labels[labelID]; ok {
					total += label.Duration
				}
			}
		}

		resp.TotalMinutes = int64(total.Minutes())
		resp.TotalHours = total.Hours()
		return c.JSON(http.StatusOK, resp)
	}
}

func getTrelloLabelsFromBoard(cfg Config) (map[string]TrelloLabel, error) {
	addr := &url.URL{
		Scheme: "https",
		Host:   "api.trello.com",
		Path:   fmt.Sprintf("/1/boards/%s/labels/", cfg.TrelloBoardID),
	}
	q := addr.Query()
	q.Set("key", cfg.TrelloAPIKey)
	q.Set("token", cfg.TrelloAPIToken)
	addr.RawQuery = q.Encode()

	resp, err := http.Get(addr.String())
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status %d", resp.StatusCode)
	}

	labels := make([]TrelloLabel, 0)
	if err := json.NewDecoder(resp.Body).Decode(&labels); err != nil {
		return nil, err
	}

	m := make(map[string]TrelloLabel)
	for _, label := range labels {
		if dur, err := time.ParseDuration(label.Name); err == nil {
			label.Duration = dur
		}
		m[label.ID] = label
	}

	return m, err
}

func getTrelloCardsFromBoard(cfg Config) ([]TrelloCard, error) {
	addr := &url.URL{
		Scheme: "https",
		Host:   "api.trello.com",
		Path:   fmt.Sprintf("/1/boards/%s/cards/", cfg.TrelloBoardID),
	}
	q := addr.Query()
	q.Set("key", cfg.TrelloAPIKey)
	q.Set("token", cfg.TrelloAPIToken)
	addr.RawQuery = q.Encode()

	resp, err := http.Get(addr.String())
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status %d", resp.StatusCode)
	}

	cards := make([]TrelloCard, 0)
	if err := json.NewDecoder(resp.Body).Decode(&cards); err != nil {
		return nil, err
	}
	return cards, nil
}
