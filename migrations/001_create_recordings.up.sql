/*
    Technically I could use one table for all videos. I wll do that as soon as I switch to use AWS RDS.
 */

CREATE TABLE practice_recordings (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    youtube_video_id VARCHAR(255) NOT NULL,
    video_orientation VARCHAR(255) NOT NULL,
    title TEXT
);

CREATE INDEX practice_recordings_year_index ON practice_recordings(year);
CREATE INDEX practice_recordings_month_index ON practice_recordings(month);

CREATE TABLE progress_recordings (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    youtube_video_id VARCHAR(255) NOT NULL,
    video_orientation VARCHAR(255) NOT NULL,
    title TEXT,
    description TEXT
);

CREATE INDEX progress_recordings_year_index ON progress_recordings(year);
CREATE INDEX progress_recordings_month_index ON progress_recordings(month);
