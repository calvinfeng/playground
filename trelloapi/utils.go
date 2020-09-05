package trelloapi

import "time"

func GetDuration(l TrelloLabel) (time.Duration, error) {
	return time.ParseDuration(l.Name)
}
