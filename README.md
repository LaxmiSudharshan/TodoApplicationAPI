# TodoApplicationAPI

# 📝 Todo Application API

This is a simple Express + SQLite based Todo API with full CRUD support and tested using Thunder Client.

## 🔧 Technologies Used
- Node.js
- Express.js
- SQLite
- Thunder Client (API testing)

## 📂 APIs Implemented

- GET `/todos/` → Get all todos (with optional filters)
- GET `/todos/:todoId/` → Get todo by ID
- POST `/todos/` → Add a new todo
- PUT `/todos/:todoId/` → Update an existing todo
- DELETE `/todos/:todoId/` → Delete a todo

## ✅ Screenshots (Thunder Client)

| Method | Route |
|--------|-------|
| POST | /todos/ |
| GET | /todos/ |
| GET | /todos/:id/ |
| PUT | /todos/:id/ |
| DELETE | /todos/:id/ |

---

### 🚀 To Run Locally

```bash
npm install
node app.js
