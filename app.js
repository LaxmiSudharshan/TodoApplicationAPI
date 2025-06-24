const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null

// Initialize DB & Server
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // ✅ Create table if not exists
    await db.run(`
      CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT,
        priority TEXT,
        status TEXT
      );
    `);

    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer()

app.get('/', (req, res) => {
  res.send('Successfully runned server')
})

// API 1: Get Todos with Filters
app.get('/todos/', async (request, response) => {
  try {
    const { search_q = '', status, priority } = request.query

    let query = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`

    if (status !== undefined) {
      query += ` AND status = '${status}'`
    }

    if (priority !== undefined) {
      query += ` AND priority = '${priority}'`
    }

    console.log("📥 Final SQL:", query)

    const data = await db.all(query)
    response.send(data)

  } catch (error) {
    console.error("❌ SQL Error:", error.message)
    response.status(500).send("Internal Server Error")
  }
})


// API 2: Get todo by ID
app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const todo = await db.get(`SELECT * FROM todo WHERE id = ${todoId}`)
  response.send(todo)
})

// API 3: Add a new todo
app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body
  const insertQuery = `
    INSERT INTO todo (id, todo, priority, status)
    VALUES (${id}, '${todo}', '${priority}', '${status}')`
  await db.run(insertQuery)
  response.send('Todo Successfully Added')
})

// API 4: Update a todo
app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {todo, status, priority} = request.body

  const previousTodo = await db.get(`SELECT * FROM todo WHERE id = ${todoId}`)

  const updatedTodo = todo ?? previousTodo.todo
  const updatedStatus = status ?? previousTodo.status
  const updatedPriority = priority ?? previousTodo.priority

  const updateQuery = `
    UPDATE todo
    SET todo = '${updatedTodo}', status = '${updatedStatus}', priority = '${updatedPriority}'
    WHERE id = ${todoId}`
  await db.run(updateQuery)

  if (status) {
    response.send('Status Updated')
  } else if (priority) {
    response.send('Priority Updated')
  } else if (todo) {
    response.send('Todo Updated')
  }
})

// API 5: Delete a todo
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  await db.run(`DELETE FROM todo WHERE id = ${todoId}`)
  response.send('Todo Deleted')
})

// ✅ Important: Export app for testing
module.exports = app
