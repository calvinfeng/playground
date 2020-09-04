CREATE TABLE practice_log_entries (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    date timestamp NOT NULL,
    duration INTEGER NOT NULL,
    title TEXT,
    note TEXT
);

CREATE TABLE practice_log_labels (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES practice_log_labels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT name_unique UNIQUE(name)
);

CREATE TABLE join_practice_log_entries_labels(
    id UUID PRIMARY KEY,
    entry_id UUID REFERENCES practice_log_entries(id) ON DELETE CASCADE,
    label_id UUID REFERENCES practice_log_labels(id) ON DELETE CASCADE
);