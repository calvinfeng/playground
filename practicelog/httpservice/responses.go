package httpservice

import (
	"github.com/calvinfeng/playground/practicelog"
	"github.com/google/uuid"
)

type PracticeLogEntryListJSONResponse struct {
	Count   int                  `json:"count"`
	Results []*practicelog.Entry `json:"results"`
	More    bool                 `json:"more"`
}

type PracticeLogLabelListJSONResponse struct {
	Count   int                  `json:"count"`
	Results []*practicelog.Label `json:"results"`
}

type IDResponse struct {
	ID uuid.UUID `json:"id"`
}
