# Todo App API Documentation

## Base URL
`http://localhost:5001/api`

---

## 📋 Todos Endpoints

### Create Todo
- **POST** `/todos`
- **Body**: `{ title, description }`
- **Response**: Created todo object

### Get All Todos
- **GET** `/todos`
- **Query**: `search`, `sort`, `page`, `limit`
- **Response**: Array of todos with pagination

### Get Single Todo
- **GET** `/todos/:id`
- **Response**: Todo object

### Update Todo
- **PUT** `/todos/:id`
- **Body**: `{ title, description }`
- **Response**: Updated todo object

### Toggle Todo Status
- **PATCH** `/todos/:id/status`
- **Body**: `{ isCompleted: boolean }`
- **Response**: Updated todo object

### Delete Todo
- **DELETE** `/todos/:id`
- **Response**: Deleted todo object

---

## 👥 Users Endpoints

### Create User
- **POST** `/users`
- **Body**: `{ username, email, password, display_name?, role?, active? }`
- **Response**: Created user object

### Get All Users
- **GET** `/users`
- **Response**: Array of all users

### Get Single User
- **GET** `/users/:id`
- **Response**: User object

### Update User
- **PUT** `/users/:id`
- **Body**: `{ username?, email?, password?, display_name?, role?, active? }`
- **Response**: Updated user object

### Delete User
- **DELETE** `/users/:id`
- **Response**: Deleted user object

---

## 📁 Projects Endpoints

### Create Project
- **POST** `/projects`
- **Body**: `{ name, key, description?, lead_id? }`
- **Response**: Created project object

### Get All Projects
- **GET** `/projects`
- **Response**: Array of all projects

### Get Single Project
- **GET** `/projects/:id`
- **Response**: Project object

### Update Project
- **PUT** `/projects/:id`
- **Body**: `{ name?, key?, description?, lead_id? }`
- **Response**: Updated project object

### Delete Project
- **DELETE** `/projects/:id`
- **Response**: Deleted project object

---

## 🔧 Issue Types Endpoints

### Create Issue Type
- **POST** `/issue-types`
- **Body**: `{ name }`
- **Response**: Created issue type

### Get All Issue Types
- **GET** `/issue-types`
- **Response**: Array of all issue types

### Get Single Issue Type
- **GET** `/issue-types/:id`
- **Response**: Issue type object

### Update Issue Type
- **PUT** `/issue-types/:id`
- **Body**: `{ name? }`
- **Response**: Updated issue type

### Delete Issue Type
- **DELETE** `/issue-types/:id`
- **Response**: Deleted issue type

---

## ⚠️ Status Types Endpoints

### Create Status Type
- **POST** `/status-types`
- **Body**: `{ name, description? }`
- **Response**: Created status type

### Get All Status Types
- **GET** `/status-types`
- **Response**: Array of all status types

### Get Single Status Type
- **GET** `/status-types/:id`
- **Response**: Status type object

### Update Status Type
- **PUT** `/status-types/:id`
- **Body**: `{ name?, description? }`
- **Response**: Updated status type

### Delete Status Type
- **DELETE** `/status-types/:id`
- **Response**: Deleted status type

---

## 📊 Priority Types Endpoints

### Create Priority Type
- **POST** `/priority-types`
- **Body**: `{ name, level? }`
- **Response**: Created priority type

### Get All Priority Types
- **GET** `/priority-types`
- **Response**: Array of all priority types

### Get Single Priority Type
- **GET** `/priority-types/:id`
- **Response**: Priority type object

### Update Priority Type
- **PUT** `/priority-types/:id`
- **Body**: `{ name?, level? }`
- **Response**: Updated priority type

### Delete Priority Type
- **DELETE** `/priority-types/:id`
- **Response**: Deleted priority type

---

## 🎯 Issues Endpoints

### Create Issue
- **POST** `/issues`
- **Body**: `{ issue_key, summary, project_id, description?, status_id?, priority_id?, type_id?, reporter_id?, assignee_id?, due_at? }`
- **Response**: Created issue object (populated with references)

### Get All Issues
- **GET** `/issues`
- **Response**: Array of all issues (with populated references)

### Get Single Issue
- **GET** `/issues/:id`
- **Response**: Issue object (populated with references)

### Update Issue
- **PUT** `/issues/:id`
- **Body**: Issue fields to update
- **Response**: Updated issue object

### Delete Issue
- **DELETE** `/issues/:id`
- **Response**: Deleted issue object

---

## 💬 Comments Endpoints

### Create Comment
- **POST** `/comments`
- **Body**: `{ issue_id, user_id, content }`
- **Response**: Created comment object (populated)

### Get All Comments
- **GET** `/comments`
- **Response**: Array of all comments (populated)

### Get Single Comment
- **GET** `/comments/:id`
- **Response**: Comment object (populated)

### Update Comment
- **PUT** `/comments/:id`
- **Body**: `{ content? }`
- **Response**: Updated comment object

### Delete Comment
- **DELETE** `/comments/:id`
- **Response**: Deleted comment object

---

## 🏃 Sprints Endpoints

### Create Sprint
- **POST** `/sprints`
- **Body**: `{ name, board_id?, start_date?, end_date?, status? }`
- **Response**: Created sprint object

### Get All Sprints
- **GET** `/sprints`
- **Response**: Array of all sprints (populated)

### Get Single Sprint
- **GET** `/sprints/:id`
- **Response**: Sprint object (populated)

### Update Sprint
- **PUT** `/sprints/:id`
- **Body**: Sprint fields to update
- **Response**: Updated sprint object

### Delete Sprint
- **DELETE** `/sprints/:id`
- **Response**: Deleted sprint object

---

## 🎨 Boards Endpoints

### Create Board
- **POST** `/boards`
- **Body**: `{ name, project_id? }`
- **Response**: Created board object

### Get All Boards
- **GET** `/boards`
- **Response**: Array of all boards (populated)

### Get Single Board
- **GET** `/boards/:id`
- **Response**: Board object (populated)

### Update Board
- **PUT** `/boards/:id`
- **Body**: `{ name?, project_id? }`
- **Response**: Updated board object

### Delete Board
- **DELETE** `/boards/:id`
- **Response**: Deleted board object

---

## Error Responses

All endpoints return error responses in this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate unique field)
- `500` - Internal Server Error

---

## Project Structure
```
├── controllers/
│   ├── todo.controller.js
│   ├── user.controller.js
│   ├── project.controller.js
│   ├── issue.controller.js
│   ├── comment.controller.js
│   ├── sprint.controller.js
│   ├── board.controller.js
│   ├── issueType.controller.js
│   ├── statusType.controller.js
│   └── priorityType.controller.js
├── models/
│   ├── todo.model.js
│   ├── user.model.js
│   ├── project.model.js
│   ├── issue.model.js
│   ├── comment.model.js
│   ├── sprint.model.js
│   ├── board.model.js
│   ├── issueType.model.js
│   ├── statusType.model.js
│   └── priorityType.model.js
├── routes/
│   ├── todo.routes.js
│   ├── users.routes.js
│   ├── projects.routes.js
│   ├── issues.routes.js
│   ├── comments.routes.js
│   ├── sprints.routes.js
│   ├── boards.routes.js
│   ├── issueTypes.routes.js
│   ├── statusTypes.routes.js
│   └── priorityTypes.routes.js
├── middlewares/
│   ├── asyncHandler.js
│   └── errorHandler.js
├── config/
│   └── db.js
├── server.js
├── package.json
└── .env
```
