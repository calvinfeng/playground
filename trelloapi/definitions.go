package trelloapi

import "time"

type Config struct {
	TrelloAPIKey   string
	TrelloAPIToken string
}

type Service interface {
	TrelloLabelsByBoard(boardID string) (map[string]TrelloLabel, error)
	TrelloCardsByBoard(boardID string) ([]TrelloCard, error)
}

type TrelloLabel struct {
	ID       string `json:"id"`
	BoardID  string `json:"idBoard"`
	Name     string `json:"name"`
	Color    string `json:"color"`
	Duration time.Duration
}

type TrelloCard struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"desc"`
	ShortID     int64    `json:"idShort"`
	BoardID     string   `json:"idBoard"`
	ListID      string   `json:"idList"`
	LabelIDs    []string `json:"idLabels"`
	IsTemplate  bool     `json:"isTemplate"`
	Due         string   `json:"due"`
}
