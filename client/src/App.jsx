import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import NoteEditor from './pages/NoteEditor';
import QuizPage from './pages/QuizPage';
import NotFound from './pages/NotFound';
import TermsPage from './pages/TermsPage';
import ProgressChart from './components/Stats/ProgressChart';
import TimerOverlay from './components/Tools/TimerOverlay';
import GeminiChat from './components/Tools/GeminiChat';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/auth" replace />;
};

function AppShell() {
    return (
        <AppProvider>
            <Router>
                <div className="sb-shell">
                    <Header />
                    <main className="flex-1 pt-32 md:pt-24 pb-12 relative z-10">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/create-note" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
                            <Route path="/edit-note/:id" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
                            <Route path="/take-quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                            <Route path="/stats" element={<ProtectedRoute><ProgressChart /></ProtectedRoute>} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <TimerOverlay />
                    <GeminiChat />
                    <Footer />
                </div>
            </Router>
        </AppProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppShell />
        </AuthProvider>
    );
}

export default App;
