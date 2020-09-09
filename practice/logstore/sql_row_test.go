package logstore

import (
	"github.com/calvinfeng/playground/practice"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestLogEntryConversion(t *testing.T) {
	entry := &practice.LogEntry{
		ID:       uuid.New(),
		UserID:   "calvin.j.feng@gmail.com",
		Date:     time.Now(),
		Duration: 90,
		Title:    "Example",
		Note:     "Example 1234",
		Subtasks: map[int]*practice.Subtask{
			0: {
				Name:      "Do A",
				Completed: false,
			},
			1: {
				Name:      "Do B",
				Completed: false,
			},
			2: {
				Name:      "Do C",
				Completed: false,
			},
		},
		Labels: nil,
	}

	row := new(DBPracticeLogEntry).fromModel(entry)
	assert.NotNil(t, row.Subtasks)
	assert.NotEmpty(t, row.Subtasks)

	model := row.toModel()
	assert.NotNil(t, model.Subtasks)
	assert.NotEmpty(t, model.Subtasks)
	require.Len(t, model.Subtasks, 3)
	assert.Equal(t, entry.Subtasks[0], model.Subtasks[0])
	assert.Equal(t, entry.Subtasks[1], model.Subtasks[1])
	assert.Equal(t, entry.Subtasks[2], model.Subtasks[2])
}
