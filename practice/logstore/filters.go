package logstore

import (
	"github.com/Masterminds/squirrel"
	"github.com/calvinfeng/playground/practice"
)

func ByID(id string) practice.SQLFilter {
	return func(eq squirrel.Eq) {
		eq["id"] = id
	}
}

func ByLabelIDs(ids []string) practice.SQLFilter {
	return func(eq squirrel.Eq) {
		eq["label_id"] = ids
	}
}