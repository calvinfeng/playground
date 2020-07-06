package cmd

import (
	"encoding/json"
	"github.com/spf13/cobra"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

type ResourceID struct {
	Kind    string `json:"kind"`
	VideoID string `json:"videoId"`
}

type Snippet struct {
	PlaylistID  string                     `json:"playlistId"`
	Title       string                     `json:"title"`
	Description string                     `json:"description"`
	Thumbnails  map[string]json.RawMessage `json:"thumbnails"`
	Position    int64                      `json:"position"`
	ResourceID  ResourceID
}

type ContentDetails struct {
	VideoID   string `json:"videoId"`
	Published string `json:"videoPublishedAt"`
}

type YouTubePlaylistItemAPIResponse struct {
	Kind          string                `json:"kind"`
	ETag          string                `json:"etag"`
	NextPageToken string                `json:"nextPageToken"`
	Items         []YouTubePlaylistItem `json:"items"`
}

type YouTubePlaylistItem struct {
	ID             string         `json:"id"`
	ETag           string         `json:"etag"`
	Snippet        Snippet        `json:"snippet"`
	ContentDetails ContentDetails `json:"contentDetails"`
}

func experimentRunE(_ *cobra.Command, _ []string) error {
	u := url.URL{
		Scheme: "https",
		Host:   "www.googleapis.com",
		Path:   "youtube/v3/playlistItems",
	}

	q := u.Query()
	q.Set("part", "snippet,contentDetails")
	q.Set("playlistId", "PLvb0sLP6w4rIq7kS4-D4zDcbFPNZOSUhW")
	q.Set("key", os.Getenv("GOOGLE_API_KEY"))
	u.RawQuery = q.Encode()

	log.Println("GET", u.String())

	resp, err := http.Get(u.String())
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var respPayload YouTubePlaylistItemAPIResponse
	if err := json.Unmarshal(body, &respPayload); err != nil {
		return err
	}

	log.Printf("found %d items from list", len(respPayload.Items))
	for _, item := range respPayload.Items {
		uploaded, err := time.Parse(time.RFC3339, item.ContentDetails.Published)
		if err != nil {
			log.Println("failed", err)
			continue
		}
		log.Printf("video uplodated year=%d, month=%d, day=%d", uploaded.Year(), uploaded.Month(), uploaded.Day())
	}

	return nil
}
