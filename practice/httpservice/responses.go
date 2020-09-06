package httpservice

import "github.com/calvinfeng/playground/practice"

type PracticeLogEntryListJSONResponse struct {
	Count   int                  `json:"count"`
	Results []*practice.LogEntry `json:"results"`
}
