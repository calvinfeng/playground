package cmd

import (
	"context"
	"fmt"
	"github.com/calvinfeng/playground/trelloapi"
	"github.com/calvinfeng/playground/youtubeapi"
	"github.com/futurenda/google-auth-id-token-verifier"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"google.golang.org/api/oauth2/v2"
	"google.golang.org/api/option"
	"net/http"
	"os"
)

func testYouTubeAPI() error {
	srv := youtubeapi.New(youtubeapi.Config{
		APIKey: os.Getenv("GOOGLE_API_KEY"),
	})

	items, err := srv.PlaylistItems("PLvb0sLP6w4rIq7kS4-D4zDcbFPNZOSUhW")
	if err != nil {
		return err
	}

	logrus.Infof("found %d playlist items", len(items))

	for _, item := range items {
		logrus.Infof("%s %s is uploaded on %s", item.ContentDetails.VideoID, item.Snippet.Title, item.ContentDetails.Published)
	}
	return nil
}

func testTrelloAPI() error {
	srv := trelloapi.New(trelloapi.Config{
		TrelloAPIKey:   os.Getenv("TRELLO_API_KEY"),
		TrelloAPIToken: os.Getenv("TRELLO_API_TOKEN"),
	})

	labels, err := srv.TrelloLabelsByBoard("woq8deqm")
	if err != nil {
		return err
	}

	cards, err := srv.TrelloCardsByBoard("woq8deqm")
	if err != nil {
		return err
	}

	lists, err := srv.TrelloChecklistsByBoard("woq8deqm")
	if err != nil {
		return err
	}

	for _, list := range lists {
		logrus.Infof("list %s %s has %d items", list.ID, list.Name, len(list.Items))
		for _, item := range list.Items {
			fmt.Println(item.Name, item.State)
		}
	}

	for _, card := range cards {
		labelNames := make([]string, 0, len(card.LabelIDs))
		for _, labelID := range card.LabelIDs {
			if val, ok := labels[labelID]; ok {
				labelNames = append(labelNames, val.Name)
			}
		}
		logrus.Infof("%s %s %s with labels %s", card.ID, card.Name, card.Description, labelNames)
	}
	return nil
}

func verifyIdToken(idToken string) (*oauth2.Tokeninfo, error) {
	oauthSrv, err := oauth2.NewService(context.Background(), option.WithHTTPClient(http.DefaultClient))
	if err != nil {
		return nil, err
	}
	tokenInfoCall := oauthSrv.Tokeninfo()
	tokenInfo, err := tokenInfoCall.IdToken(idToken).Do()
	if err != nil {
		return nil, err
	}
	return tokenInfo, nil
}

func experimentRunE(_ *cobra.Command, _ []string) error {
	const IDToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkYTc4NjNlODYzN2Q2NjliYzJhMTI2MjJjZWRlMmE4ODEzZDExYjEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiODE5MDEzNDQzNjcyLXJ0OGVvbXNyMjVqbWtmZWoyb2Rrc2ppaHNib2R1bzZhLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiODE5MDEzNDQzNjcyLXJ0OGVvbXNyMjVqbWtmZWoyb2Rrc2ppaHNib2R1bzZhLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEwODg4MzQxNDE4MDIxNzgwNzU2IiwiZW1haWwiOiJjYWx2aW4uai5mZW5nQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZlMxeDQ5MEw4UkVaczFuZVZfbXBxUSIsIm5hbWUiOiJDYWx2aW4gRmVuZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHZ2ZuanNlQk14MWQ2aXEyYnItZXh3T2RJSEF0d0ZsdEQyeC1lX3d3UT1zOTYtYyIsImdpdmVuX25hbWUiOiJDYWx2aW4iLCJmYW1pbHlfbmFtZSI6IkZlbmciLCJsb2NhbGUiOiJlbiIsImlhdCI6MTYwMjM3MjUxNCwiZXhwIjoxNjAyMzc2MTE0LCJqdGkiOiIzZDYyNDM0Yzg2YzcyZDA4MGU4OGZkNWQ1NTEwOGQyOGU5YjNkODJkIn0.XiEVHSo1sn-k08KDG50l9k8SH8p6T8X3gveiScuWNZk2570r1ePFaO3yMdGbNrN1u2ulv4NgkiYukCFc3_zyaBCDh8i25L5imhKn-A7Vs3BBZR2R30t2njewYpK-qKhOCrVrwez7x4z3UdwFPEcNoH4MXRU3U4ZLpdfxlCcUTvMjk9Tw2nnwlvt3f8lihFzXnNjfKqv_Rk8YgBPEot9y-GC7GPlvDSBlvYyx_QUW0Snd6vSlZeV-WXuuYjxxalwqQjtWxsXiApdcGDwtbEBXpeJchErJpD49QkbFgpK8ttLXuspgQaDJPkQvx76mmQnIShsG946Q-nQNQDAMjW0ciA"
	tokenInfo, err := verifyIdToken(IDToken)
	if err != nil {
		return err
	}
	logrus.Infof("Golang oauth token info %v", tokenInfo)

	v := googleAuthIDTokenVerifier.Verifier{}
	err = v.VerifyIDToken(IDToken, []string{
		"819013443672-rt8eomsr25jmkfej2odksjihsboduo6a.apps.googleusercontent.com",
	})
	if err != nil {
		return err
	}
	claimSet, err := googleAuthIDTokenVerifier.Decode(IDToken)
	if err != nil {
		return err
	}
	logrus.Infof("Golang JWT token claim %v", claimSet)

	return nil
}
