# 🎓 The Academic Hub — Library Management System

A modern, responsive, full-stack web-based Library Management System built with **React.js**, **Tailwind CSS**, **Node.js (Express)**, and **MySQL** (with automated academic seed-store fallback).

---

## 📸 Key Features & Modules

### 1. 📊 Executive Dashboard
- Dynamic overview metrics: **Total Books (48,512)**, **Issued Books (12,105)**, **Overdue Books (319)**, and **Active Students (8,940)**.
- Academic hero welcome banner with rounded catalog search bar.
- Interactive **Featured Collections** horizontal carousel with star ratings and book details modals.

### 2. 📚 Book Catalog & Inventory
- Responsive grid view with book cover art, authors, publication years, and shelf locations.
- Subject filter tabs: *All Subjects, Fiction, Non-Fiction, History, Science*.
- Dynamic availability badges (**AVAILABLE** in emerald & **ISSUED** in amber).
- "View Details" modal and direct "Request Book" checkout triggers.
- Dedicated "Add New Book" modal for librarians.

### 3. ✍️ Book Issue & Return Form
- Real-time student lookup by Student ID or Student Name.
- Book selection with barcode/ISBN display and copy availability checks.
- Datepickers for issue and return due dates.
- **Side Preview Card**: Displays live student avatar profile and chosen book cover preview.
- **Active Issue List Table**: Real-time log of checkout transactions.

### 4. 🎓 Student Portal & Circulation Ledger
- Ledger records table tracking Issue ID, Student Name, Book Title, Issue Date, Due Date, Status, and Actions.
- Search and filter by status (*All, Issued, Overdue, Returned*) and time range.
- Top-right statistics: Total Records (`12,105`), Overdue Issues (`319`), and Return Rate (`98%`).
- **Return Modal**: Computes overdue fines automatically upon check-in.
- **Renew Modal**: Extends loan due dates (+14 days).

### 5. 📈 Analytics & Administrative Reports
- Monthly circulation and return trends bar chart using **Chart.js**.
- Subject distribution doughnut chart.
- Leaderboard table of most borrowed titles and demand tiers.
- 1-Click **Export CSV** download and printable **PDF Report** formatting.
- Overdue alert notice center with automated student email reminder simulation.

### 6. 🔐 Authentication & Roles
- JWT-based authentication system.
- Dual-role support: **Librarian / Admin** and **Student**.
- 1-Click instant demo login switcher between *Sarah Jenkins (Librarian)* and *Karie Berlinn (Student)*.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React Icons, Chart.js, React-Chartjs-2, Axios
- **Backend:** Node.js, Express.js, MySQL2, JSONWebToken, BcryptJS, CORS, Dotenv
- **Database:** MySQL (with structured `schema.sql`) + Built-in in-memory fallback store

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- *(Optional)* MySQL Server (v8.0+)

### 1. Clone & Setup Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd JavaML
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # (or configure .env)
npm run dev            # Starts REST API on http://localhost:5000
```

> **Note:** If MySQL is not running locally, the backend automatically activates the built-in Academic Seed Data store, allowing all modules to work out-of-the-box!

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev            # Starts Vite development server on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Schema

The database schema is located in `backend/schema.sql` and includes:
- `users`: Authentication records, roles (`librarian`, `student`, `admin`), hashed passwords.
- `students`: Enrolled student profiles, departments, membership dates.
- `books`: Catalog titles, authors, genres, ISBNs, shelf locations, available copies.
- `transactions`: Circulation records, issue dates, return due dates, status, accrued fines.
- `reports`: Saved circulation data and audit snapshots.

---

## 📡 API Endpoints

- `GET /api/health` — System status
- `POST /api/auth/login` — Authenticate and receive JWT
- `POST /api/auth/register` — Create new student/librarian account
- `GET /api/books` — Retrieve catalog books with search & genre filtering
- `POST /api/books` — Add new book (librarian only)
- `GET /api/students` — Retrieve enrolled students
- `GET /api/transactions` — Retrieve borrowing records
- `POST /api/transactions/issue` — Issue book to student
- `POST /api/transactions/:id/return` — Process return & update inventory
- `POST /api/transactions/:id/renew` — Extend borrowing loan period
- `GET /api/reports/stats` — Dashboard KPI summaries
- `GET /api/reports/analytics` — Monthly trends & genre breakdowns
- `GET /api/reports/export-csv` — Download circulation CSV

---

## 📄 License
This project is licensed under the MIT License.
