CREATE TABLE practice_recordings (
    id INTEGER PRIMARY KEY,
    recorded_year INTEGER NOT NULL,
    recorded_month INTEGER NOT NULL,
    is_progress_report INT2 NOT NULL,
    youtube_url VARCHAR(255) NOT NULL,
    video_orientation VARCHAR(255) NOT NULL,
    title TEXT,
    description TEXT
);

CREATE INDEX year_index ON practice_recordings(recorded_year);
CREATE INDEX month_index ON practice_recordings(recorded_month);
CREATE INDEX is_progress_report_index on practice_recordings(is_progress_report);