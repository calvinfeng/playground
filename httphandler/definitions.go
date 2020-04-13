package httphandler

import (
	"github.com/calvinfeng/calvinblog/datastore"
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
	Year        int64  `json:"year"`
	Month       string `json:"month"`
	Day         int64  `json:"day"`
	YoutubeURL  string `json:"youtube_url"`
	Title       string `json:"title;omitempty'"`
	Description string `json:"description;omitempty"`
}

type RecordingListJSONResponse struct {
	Count   int             `json:"count"`
	Results []RecordingJSON `json:"results"`
}
