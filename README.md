# AI Form Submission

A full-stack AI-powered form builder and submission platform built with **React, Node.js, Express, PostgreSQL, and Google Gemini AI**.

The application allows users to create customizable forms, publish them, collect responses, analyze submissions, and use AI to generate insights.

## 🚀 Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected API routes
* User profile management

### 📝 Form Builder

* Create and edit forms
* Add different question/field types
* Customize form settings
* Choose different themes
* Save forms as drafts
* Publish forms using a unique URL
* Archive forms

### 📥 Form Responses

* Submit responses through public forms
* Store responses securely in PostgreSQL
* View submitted responses
* Track response counts
* Export response data as CSV

### 🤖 AI Features

* AI-powered form generation
* AI analysis of form responses
* Generate insights from collected data
* Gemini-powered recommendations

### 📊 Analytics

* Total forms
* Total responses
* Form views
* Response conversion rate
* Submission analytics
* Insights dashboard
* Charts and visualizations

### 🎨 UI

* Modern React interface
* Responsive design
* Multiple themes
* Dashboard
* Form builder
* Analytics pages
* Public form pages

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* React Hooks
* Context API

### Backend

* Node.js
* Express.js
* JWT
* REST API
* Middleware architecture

### Database

* PostgreSQL
* Neon PostgreSQL
* `pg` Node.js driver

### AI

* Google Gemini API

### Development Tools

* Git
* GitHub
* Nodemon
* npm

---

## 📁 Project Structure

```text
AI-Form-Submission/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── migrate.js
│   │
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── auth.controller.js
│   │   ├── form.controller.js
│   │   ├── insight.controller.js
│   │   └── response.controllers.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── repositories/
│   │   ├── form.repo.js
│   │   ├── response.repo.js
│   │   └── user.repo.js
│   │
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── auth.routes.js
│   │   ├── form.routes.js
│   │   ├── insight.routes.js
│   │   └── response.routes.js
│   │
│   ├── services/
│   │   ├── ai.services.js
│   │   ├── analytics.service.js
│   │   ├── auth.service.js
│   │   ├── form.service.js
│   │   ├── gemini.service.js
│   │   ├── insights.service.js
│   │   └── response.service.js
│   │
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/mohsinirfanpalla/Ai-form-Submission.git
```

Move into the project:

```bash
cd Ai-form-Submission
```

---

# 🔧 Backend Setup

Go to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

DATABASE_URL=your_neon_postgresql_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

Run the database migration:

```bash
npm run migrate
```

Start the backend:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/api/health
```

---

# 🎨 Frontend Setup

Open another terminal and go to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

The project uses environment variables for sensitive information.

Never commit your real `.env` file to GitHub.

Required backend variables:

| Variable         | Description                         |
| ---------------- | ----------------------------------- |
| `PORT`           | Backend server port                 |
| `CLIENT_URL`     | Frontend URL                        |
| `DATABASE_URL`   | PostgreSQL/Neon database connection |
| `JWT_SECRET`     | Secret used to sign JWT tokens      |
| `JWT_EXPIRES_IN` | JWT expiration time                 |
| `GEMINI_API_KEY` | Google Gemini API key               |
| `GEMINI_MODEL`   | Gemini model name                   |

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

Use your own real values locally.

---

# 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  │ HTTP Requests
  ▼
Express REST API
  │
  ├── Authentication
  │
  ├── Forms
  │
  ├── Responses
  │
  ├── Analytics
  │
  └── AI Services
  │
  ├───────────────┐
  ▼               ▼
PostgreSQL       Gemini AI
  │               │
  └───────┬───────┘
          ▼
      API Response
          │
          ▼
    React Dashboard
```

---

# 🔐 Security

The project follows several basic security practices:

* JWT authentication
* Protected routes
* Password hashing
* Environment variables for secrets
* CORS configuration
* Input validation
* Centralized error handling
* Secrets excluded through `.gitignore`

---

# 📊 Main API Areas

```text
/api/auth
/api/forms
/api/responses
/api/ai
/api/insights
```

The backend follows a layered architecture:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
PostgreSQL
```

This separation keeps business logic, database operations, and HTTP handling organized.

---

# 🧠 AI Integration

Google Gemini is used to provide AI-powered functionality such as:

* Generating forms
* Understanding responses
* Creating insights
* Summarizing submitted information

The Gemini API key is stored in the backend environment variables and is never exposed to the frontend.

---

# 🧪 Development

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

---

# 📦 Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

The generated production files will be placed in the frontend build directory.

Configure the backend and database using production environment variables before deployment.

---

# 👨‍💻 Author

**Mohsin**

BCA Student

GitHub:

https://github.com/mohsinirfanpalla

---

# 📄 License

This project is created for learning, development, and portfolio purposes.

````

### Put it at the root

Create:

```text
D:\AI-Form-Submission\README.md
````

**Don't put your real API keys or database URL in the README.** Your `.env` stays local and ignored by Git.

Then from:

```text
D:\AI-Form-Submission>
```

run:

```powershell
git add README.md
git commit -m "Add project README"
git push
```

Since you've now got **both `backend/` and `frontend/` in the root Git repository**, your GitHub repo will look much cleaner. 🚀
