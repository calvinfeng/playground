CREATE TABLE monthly_summaries (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    title TEXT,
    subtitle TEXT,
    body TEXT
);

CREATE INDEX monthly_summaries_year_index ON monthly_summaries(year);
CREATE INDEX monthly_summaries_month_index ON monthly_summaries(month);
