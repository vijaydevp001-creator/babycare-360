import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChildProfile from './pages/ChildProfile';
import Children from './pages/Children';
import Vaccines from './pages/Vaccines';
import Growth from './pages/Growth';
import Appointments from './pages/Appointments';
import Nutrition from './pages/Nutrition';
import Reports from './pages/Reports';
import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard & Module Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/children" element={<ProtectedRoute><Children /></ProtectedRoute>} />
        <Route path="/children/:id" element={<ProtectedRoute><ChildProfile /></ProtectedRoute>} />
        <Route path="/vaccines" element={<ProtectedRoute><Vaccines /></ProtectedRoute>} />
        <Route path="/growth" element={<ProtectedRoute><Growth /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

        {/* Redirect old routes */}
        <Route path="/add-child" element={<Navigate to="/children" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
