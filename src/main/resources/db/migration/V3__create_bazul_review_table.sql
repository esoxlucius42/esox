CREATE TABLE bazul_review (
    id               BIGSERIAL PRIMARY KEY,
    title            VARCHAR(255),
    image_data       TEXT,
    taste_as_is      INTEGER,
    taste_after_cook INTEGER,
    softness         INTEGER,
    cooked           INTEGER,
    sauce            INTEGER,
    would_buy_again  BOOLEAN,
    total_score      INTEGER,
    review_date      DATE,
    created_at       TIMESTAMP,
    updated_at       TIMESTAMP
);
