CREATE TABLE practice_recordings (
    id UUID PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    is_progress_recording BOOLEAN,
    youtube_video_id VARCHAR(255) NOT NULL,
    video_orientation VARCHAR(255) NOT NULL,
    title TEXT,
    description TEXT
);

CREATE INDEX recordings_year_index ON recordings(year);
CREATE INDEX recordings_month_index ON recordings(month);

CREATE TABLE monthly_summaries (
    id UUID PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    title TEXT,
    subtitle TEXT,
    body TEXT
);

CREATE INDEX monthly_summaries_year_index ON monthly_summaries(year);
CREATE INDEX monthly_summaries_month_index ON monthly_summaries(month);
