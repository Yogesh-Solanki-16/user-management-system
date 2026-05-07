# User Management System

A modern React-based user management application with CRUD operations, search/filter capabilities, and a responsive UI.

## Features

- User list with pagination
- Create, read, update, and delete users
- Search by name or email
- Filter by gender and role
- Sort by name and age
- Dark/Light theme toggle
- Responsive design
- Toast notifications
- Stats dashboard

## Screenshots

### Home Page
![Home Page](/home.png)

### User Table
![User Table](/table1.png)

### Add User
![Add User](/add%20user.png)

### Edit User
![Edit User](/edit.png)

### View User Details
![View User](/view.png)

## Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- Custom CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Configure your API base URL in `.env`:
   ```env
   VITE_API_BASE_URL=https://dummyjson.com
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

- `VITE_API_BASE_URL`: The base URL for the API (default: https://dummyjson.com)

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── DeleteConfirmModal/
│   ├── Header/
│   ├── Pagination/
│   ├── SearchFilter/
│   ├── SkeletonLoader/
│   ├── Toast/
│   ├── UserModal/
│   └── UserTable/
├── context/          # React context providers
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── pages/            # Page components
│   ├── UserDetailPage/
│   └── UsersListPage/
├── styles/           # Global styles
│   └── global.css
├── utils/            # Utility functions
│   └── api.js
├── App.jsx
└── main.jsx
```

## License

MIT
