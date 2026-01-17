import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthProvider from './context/auth/AuthProvider'
import ThemeProvider from './context/theme/ThemeProvider'
import NotificationProvider  from './context/notification/NotificationProvider'
import LoadingSpinner from './components/common/LoadingSpinner'
import NotFound from './pages/NotFound'

// Lazy loading des pages protégées
const Layout = lazy(() => import('./components/layout/Layout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))
const Products = lazy(() => import('./pages/Products'))
const Settings = lazy(() => import('./pages/Settings'))

// Pages publiques (pas de lazy loading pour le login/register pour éviter le flicker)
import Login  from './pages/Login'
import Register from './pages/Register'

// Composant de suspense pour les routes protégées
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'))

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <Routes>
                {/* Routes publiques */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes protégées */}
                <Route path="/" element={
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  }>
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  </Suspense>
                }>
                  <Route index element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="users" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Users />
                    </Suspense>
                  } />
                  <Route path="products" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Products />
                    </Suspense>
                  } />
                  <Route path="settings" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Settings />
                    </Suspense>
                  } />

                  {/* 404 pour les sous-routes protégées */}
                  <Route path="*" element={
                    <div className="p-6">
                      <NotFound />
                    </div>
                  } />
                </Route>

                {/* 404 globale */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  )
}