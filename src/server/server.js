const cors = require('cors');
const express = require('express');
const Pool = require('pg').Pool;
const app = express();
app.use(cors());
app.use(express.json());
const db = new Pool({
    user: "postgres",
    password: "123",
    host: "localhost",
    port: 5000,
    database: 'chat_db'
});

db.connect()
  .then(() => console.log('Подключено к PostgreSQL'))
  .catch(err => console.error('Ошибка подключения:', err));

app.post('/register', async (req, res) => {
    // console.log(req.body);
    
    const {name, email, password} = await req.body;
    console.log(name);
    
    const data = await db.query('INSERT INTO "user" (name, email, password) values ($1, $2, $3) RETURNING *', [name, email, password]);
    res.json(data.rows[0])
})

app.post('/login', async (req, res) => {
  const {email, password} = await req.body;
  console.log(email, password);
  try {
    const data = await db.query('SELECT * from "user" WHERE email = $1 and password = $2', [email, password]);
    console.log(data.rows[0]);
    
    res.json(data.rows[0])
  }
  catch (error) {
    res.json({error})
  }
  
  
})

app.post('/name-verification', async (req, res) => {
  const {name} = req.body
  const query = await db.query('SELECT name from "user" WHERE name = $1 RETURNING *', [name])
  res.json(query.rows[0])
})

app.post('/show_rooms', async (req, res) => {
  
  const {currName} =  req.body;
  const query = await db.query('SELECT rooms from "user" WHERE name = $1', [currName])
  res.json(query.rows[0])
})

app.post('/show-messages', (req, res) => {

})

app.post('/send-message', async (req, res) => {
  console.log('ewq');
  const {message, user} = req.body
  console.log(message, user);
  
  const query = `
UPDATE "user"
SET rooms = jsonb_set(
  rooms,
  ARRAY[
    (SELECT (ordinality-1)::text 
     FROM jsonb_array_elements(rooms) WITH ORDINALITY 
     WHERE (value->>'id')::bigint = $1), 
    'messages'
  ],
  COALESCE(
    (SELECT value->'messages' 
     FROM jsonb_array_elements(rooms) 
     WHERE (value->>'id')::bigint = $1),
    '[]'::jsonb
  ) || $2::jsonb
)
WHERE name = $3
RETURNING *;
  `;
  console.log(message.room);
  
  await db.query(query, [message.room, message, user]);

  res.json({succes: true})
  // console.log(response.rows[0])
})
// (
//   jsonb_column,
//   '{outer_array, 0, nested_array}',
//   (jsonb_column #> '{outer_array, 0, nested_array}') || $1::jsonb
// )
app.post('/add_room', async (req, res) => {

  console.log(req.body);
  
  const {newName, myName} = await req.body
  
  const newRoom = {
    participants: ['@' + newName, myName],
    id: Math.floor(Math.random() * (1000000000 - 1) + 1),
    type: "personal",
    messages: []
  }
  console.log();
  
  await db.query('UPDATE "user" SET rooms = rooms || $1::JSONB WHERE name = $2 RETURNING *;', [newRoom, '@' + newName])

  const query = await db.query('UPDATE "user" SET rooms = rooms || $1::JSONB WHERE name = $2 RETURNING *;', [newRoom, myName])
  console.log(query.rows[0]);
  
  res.json(query.rows[0])
})


app.post('/search-users', async (req, res) => {
  console.log('ewq');
  
  try {
    const name = await req.body.value

    
    const query = await db.query('SELECT * from "user" WHERE name = $1;', [name])
    

    
    
    res.json(query.rows[0])
  }
  catch (err) {
    console.log('error');
    
    res.json({err})
  }
  
})

app.listen(5400, () => console.log("Локальный Сервер Запущен по адресу: http://localhost:5400"))


