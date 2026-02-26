CREATE TABLE lyrics_data (
    id         BIGSERIAL PRIMARY KEY,
    artist     VARCHAR(255),
    title      VARCHAR(255),
    content    TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
