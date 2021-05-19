CREATE TABLE IF NOT EXISTS rahaf(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    image TEXT,
    house VARCHAR(255),
    patronus VARCHAR(255),
    alive boolean NOT NULL DEFAULT true,
    created_by VARCHAR(255)
)