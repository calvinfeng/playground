package logstore

import (
	"github.com/Masterminds/squirrel"
	"github.com/calvinfeng/playground/practicelog"
)

func ByID(id string) practicelog.SQLFilter {
	return func(eq squirrel.Eq) {
		eq["id"] = id
	}
}

func ByLabelIDs(ids []string) practicelog.SQLFilter {
	return func(eq squirrel.Eq) {
		eq["label_id"] = ids
	}
}
