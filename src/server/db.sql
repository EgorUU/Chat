CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),

    -- Комнаты --

    rooms JSONB NOT NULL DEFAULT '[]'::JSONB
);

ALTER TABLE "user" ADD COLUMN rooms JSONB NOT NULL DEFAULT '[]'::JSONB;
