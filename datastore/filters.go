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

func ByPracticeRecordings() SQLFilter {
	return func(eq squirrel.Eq) {
		eq["is_progress_report"] = 0
	}
}

func ByMonthlyProgressRecordings() SQLFilter {
	return func(eq squirrel.Eq) {
		eq["is_progress_report"] = 1
	}
}
