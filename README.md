# 🧾 Job Tracker - Backend Server

This is the backend server for the **Job Tracker** application — a modern job application portal that supports two roles:

- 👤 **Candidates**: Browse and apply for jobs.
- 🧑‍💼 **Recruiters**: Post jobs and manage applications.

Built with **Node.js**, **Express**, **Prisma ORM**, and **MySQL**.

> 🔗 [Frontend Repo](https://github.com/pinkeshroy/job-tracker)  
> 🌐 Live API: [https://job-tracker-server-jpfy.onrender.com](https://job-tracker-server-jpfy.onrender.com)


---

## ⚙️ Tech Stack

| Layer       | Technology                   |
|-------------|------------------------------|
| Runtime     | Node.js + Express.js         |
| Auth        | JWT + Bcrypt                 |
| Database    | MySQL                        |
| ORM         | Prisma                       |
| Validation  | Joi                          |
| Container   | Docker + Docker Compose      |
| Dev Tools   | Nodemon, Prisma CLI          |

---

## 📁 Folder Structure

```
job-tracker-server/
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── controllers/       # Request handlers for each feature
│   ├── middleware/        # Auth, error handling, validation, etc.
│   ├── routes/            # Express route handlers
│   ├── utils/             # Token helpers, email utilities, etc.
│   └── app.js             # Express app setup
├── .env                   # Environment variables (PORT, DB, JWT_SECRET, etc.)
├── Dockerfile             # Container setup
├── docker-compose.yml     # API + MySQL combo
├── server.js              # Entry point
├── package.json           # Metadata & scripts
└── README.md              # You're here!
```
---

## 🌱 Environment Variables (.env)
- Create a .env file at the root of your project:
```
PORT=5000
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=root
DB_NAME=job_tracker
DATABASE_URL=mysql://root:root@mysql:3306/job_tracker
JWT_SECRET=jdshvhjdbvhjfvfv
```
---

## 🚀 Local Development

### 🔧 Step 1: Clone and Install
```
git clone https://github.com/pinkeshroy/job-tracker-server.git
cd job-tracker-server
npm install
```

### 🔌 Step 2: Setup Prisma & DB
```
npx prisma db push        # Create tables
npx prisma generate       # Generate client
```
### ▶️ Step 3: Start Server
```
npm run dev               # Uses nodemon
```
## 🐳 Docker Setup (with MySQL)
### 📦 Build & Run Containers
```
docker-compose up --build
```

* This will:

- Spin up the Node.js backend on port 5001

- Launch a MySQL 8 database on port 3306

- Automatically sync Prisma schema

---

## 🔐 Authentication

### ✅ Endpoint (Live)

```
curl --location 'https://job-tracker-server-jpfy.onrender.com/'
```
* role can be "USER" or "RECRUITER"
  
---

## 📚 API Endpoints Overview

### 🔐 Auth Routes (`/api/auth`)
| Route                  | Method | Description           |
|------------------------|--------|-----------------------|
| `/api/auth/register`   | POST   | Register new user     |
| `/api/auth/login`      | POST   | User login            |

### 💼 Job Routes (`/api/job`) _(Protected)_
| Route                                         | Method | Description                            |
|----------------------------------------------|--------|----------------------------------------|
| `/api/job/`                                   | GET    | Get all job listings                   |
| `/api/job/`                                   | POST   | Create a new job (Recruiter only)      |
| `/api/job/`                                   | PUT    | Update a job                           |
| `/api/job/`                                   | DELETE | Delete a job                           |
| `/api/job/:jobId/apply`                       | POST   | Apply to a job                         |
| `/api/job/applications`                       | GET    | Get all applications (User/Recruiter)  |
| `/api/job/applications/:applicationId`        | PUT    | Update an application                  |
| `/api/job/applications/:applicationId`        | DELETE | Delete an application                  |
| `/api/job/applications/stats`                 | GET    | Get aggregated application stats       |
| `/api/job/:jobId/applications`                | GET    | Get all applications for a job         |

---

## 👥 License & Author

**📄 License:**  
This project is licensed under the **ISC License** — feel free to use, modify, and distribute it as needed.

**🧑‍💻 Author:**  
Crafted with ❤️ by [@pinkeshroy](https://github.com/pinkeshroy)

> If you find this project helpful, give it a ⭐️ on GitHub and feel free to contribute or report issues!
