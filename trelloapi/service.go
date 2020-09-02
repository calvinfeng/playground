package trelloapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

func New(cfg Config) Service {
	return &service{
		host:   "api.trello.com",
		key: cfg.TrelloAPIKey,
		token: cfg.TrelloAPIToken,
	}
}

type service struct {
	host   string
	token string
	key string
}

func (s *service) TrelloLabelsByBoard(boardID string) (map[string]TrelloLabel, error) {
	addr := &url.URL{
		Scheme: "https",
		Host:   s.host,
		Path:   fmt.Sprintf("/1/boards/%s/labels/", boardID),
	}
	q := addr.Query()
	q.Set("key", s.key)
	q.Set("token", s.token)
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

func (s *service) TrelloCardsByBoard(boardID string) ([]TrelloCard, error) {
	addr := &url.URL{
		Scheme: "https",
		Host:   s.host,
		Path:   fmt.Sprintf("/1/boards/%s/cards/", boardID),
	}
	q := addr.Query()
	q.Set("key", s.key)
	q.Set("token", s.token)
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
