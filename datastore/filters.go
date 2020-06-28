package datastore

import "github.com/Masterminds/squirrel"

func ByYear(year string) SQLFilter {
	return func(eq squirrel.Eq) {
		eq["year"] = year
	}
}

func ByMonth(month string) SQLFilter {
	return func(eq squirrel.Eq) {
		eq["month"] = month
	}
}
