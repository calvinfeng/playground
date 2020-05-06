package httphandler

import (
	"github.com/calvinfeng/playground/datastore"
)

type Config struct {
	Store datastore.Store
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

type RecordingJSON struct {
	Year           int64  `json:"year"`
	Month          string `json:"month"`
	Day            int64  `json:"day"`
	Title          string `json:"title,omitempty"`
	Orientation    string `json:"orientation"`
	YouTubeVideoID string `json:"youtube_video_id"`
}

type RecordingListJSONResponse struct {
	Count   int             `json:"count"`
	Results []RecordingJSON `json:"results"`
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
