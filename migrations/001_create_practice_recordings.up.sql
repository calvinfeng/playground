CREATE TABLE practice_recordings (
    id INTEGER PRIMARY KEY,
    recorded_year INTEGER NOT NULL,
    recorded_month INTEGER NOT NULL,
    recorded_day INTEGER NOT NULL,
    is_progress_report INT2 NOT NULL,
    youtube_video_id VARCHAR(255) NOT NULL,
    video_orientation VARCHAR(255) NOT NULL,
    title TEXT
);

CREATE INDEX practice_recordings_year_index ON practice_recordings(recorded_year);
CREATE INDEX practice_recordings_month_index ON practice_recordings(recorded_month);
CREATE INDEX is_progress_report_index on practice_recordings(is_progress_report);