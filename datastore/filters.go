package datastore

import "github.com/Masterminds/squirrel"

func ByRecordedYear(year string) SQLFilter {
	return func(eq squirrel.Eq) {
		eq["recorded_year"] = year
	}
}

func ByRecordedMonth(month string) SQLFilter {
	return func(eq squirrel.Eq) {
		eq["recorded_month"] = month
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
