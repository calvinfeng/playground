package youtubeapi

import "time"

type Config struct {
	APIKey string
}

type Service interface {
	PlaylistItems(playlistID string) ([]PlaylistItem, error)
}

type resourceID struct {
	Kind    string `json:"kind"`
	VideoID string `json:"videoId"`
}

type thumbnail struct {
	URL    string `json:"url"`
	Width  int64  `json:"width"`
	Height int64  `json:"height"`
}

type Snippet struct {
	DateAdded   time.Time            `json:"publishedAt"`
	ChannelID   string               `json:"channelId"`
	Position    int64                `json:"position"`
	PlaylistID  string               `json:"playlistId"`
	Title       string               `json:"title"`
	Description string               `json:"description"`
	Thumbnails  map[string]thumbnail `json:"thumbnails"`
	ResourceID  resourceID           `json:"resourceId"`
}

type ContentDetails struct {
	VideoID   string    `json:"videoId"`
	Published time.Time `json:"videoPublishedAt"`
}

type PlaylistItem struct {
	ID             string         `json:"id"`
	ETag           string         `json:"etag"`
	Snippet        Snippet        `json:"snippet"`
	ContentDetails ContentDetails `json:"contentDetails"`
}

type PageInfo struct {
	Total   int64 `json:"totalResults"`
	PerPage int64 `json:"resultsPerPage"`
}

type PlaylistItemResponse struct {
	Kind          string         `json:"kind"`
	ETag          string         `json:"etag"`
	NextPageToken string         `json:"nextPageToken"`
	PrevPageToken string         `json:"prevPageToken"`
	PageInfo      PageInfo       `json:"pageInfo"`
	Items         []PlaylistItem `json:"items"`
}
