import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import Header from './components/Header/Header'
import UsersListPage from './pages/UsersListPage/UsersListPage'
import UserDetailPage from './pages/UserDetailPage/UserDetailPage'
import Toast from './components/Toast/Toast'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<UsersListPage />} />
              <Route path="/users/:id" element={<UserDetailPage />} />
            </Routes>
          </main>
          <Toast />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
