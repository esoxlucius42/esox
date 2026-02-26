CREATE TABLE note_data (
    id         BIGSERIAL PRIMARY KEY,
    title      VARCHAR(255),
    content    TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
