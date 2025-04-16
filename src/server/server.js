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

app.listen(5400, () => console.log("Локальный Сервер Запущен по адресу: http://localhost:5400"))


