import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/auth'
import Dashboard from './pages/dashboard'
import AuthGuard from './components/AuthGuard'
import Editor from './pages/editor'
import NotFound from './pages/notFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Auth />}>
          <Route path='/' />
          <Route path='/login' />
          <Route path='/register' />
        </Route>

        <Route element={<AuthGuard />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/doc/:id' element={<Editor />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
