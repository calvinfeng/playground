package httphandler

import (
	"time"

	"github.com/calvinfeng/playground/datastore"
)

type Config struct {
	Store          datastore.Store
	TrelloAPIKey   string
	TrelloAPIToken string
	TrelloBoardID  string
}

var monthNames = map[int64]string{
	1:  "January",
	2:  "February",
	3:  "March",
	4:  "April",
	5:  "May",
	6:  "June",
	7:  "July",
	8:  "August",
	9:  "September",
	10: "October",
	11: "November",
	12: "December",
}

type PracticeRecordingListJSONResponse struct {
	Count   int                     `json:"count"`
	Results []PracticeRecordingJSON `json:"results"`
}

type PracticeRecordingJSON struct {
	Year           int64  `json:"year"`
	Month          string `json:"month"`
	Day            int64  `json:"day"`
	Title          string `json:"title,omitempty"`
	Orientation    string `json:"orientation"`
	YouTubeVideoID string `json:"youtube_video_id"`
}

type ProgressRecordingListJSONResponse struct {
	Count   int                     `json:"count"`
	Results []ProgressRecordingJSON `json:"results"`
}

type ProgressRecordingJSON struct {
	Year           int64  `json:"year"`
	Month          string `json:"month"`
	Title          string `json:"title,omitempty"`
	Orientation    string `json:"orientation"`
	YouTubeVideoID string `json:"youtube_video_id"`
}

type SummaryJSON struct {
	Year     int64  `json:"year"`
	Month    string `json:"month"`
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Body     string `json:"body"`
}

type SummaryListJSONResponse struct {
	Count   int           `json:"count"`
	Results []SummaryJSON `json:"results"`
}

type PracticeTimeJSONResponse struct {
	TotalMinutes int64   `json:"total_minutes"`
	TotalHours   float64 `json:"total_hours"`
}

type TrelloLabel struct {
	ID       string `json:"id"`
	BoardID  string `json:"idBoard"`
	Name     string `json:"name"`
	Color    string `json:"color"`
	Duration time.Duration
}

type TrelloCard struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	ShortID    int64    `json:"idShort"`
	BoardID    string   `json:"idBoard"`
	ListID     string   `json:"idList"`
	LabelIDs   []string `json:"idLabels"`
	IsTemplate bool     `json:"isTemplate"`
}
