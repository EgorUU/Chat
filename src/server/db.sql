CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);
CREATE TABLE chat_history (
    userId INTEGER,
    userName VARCHAR(255),
    text VARCHAR(255),
    time VARCHAR(255)
)