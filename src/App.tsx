import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './login/Login';
import Signup from './signup/Signup';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from './utils/components/ProtectedRoute';
import GoogleCallback from './callback/GoogleOAuthCallback';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/google/callback" element={<GoogleCallback/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
