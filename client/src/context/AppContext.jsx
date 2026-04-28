import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const { user } = useAuth();

    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(false);
    const [quizScores, setQuizScores] = useState([]);

    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work');
    const [isChatOpen, setIsChatOpen] = useState(false);

    // ── Timer ──────────────────────────────────────────────────────────────
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play().catch(() => null);
            if (mode === 'work') {
                alert('Work session done! Take a break.');
                setMode('break');
                setTimeLeft(5 * 60);
            } else {
                alert('Break over! Back to work.');
                setMode('work');
                setTimeLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive((prev) => !prev);
    const resetTimer = () => { setIsActive(false); setMode('work'); setTimeLeft(25 * 60); };

    // ── Notes API ──────────────────────────────────────────────────────────
    const fetchNotes = useCallback(async (search = '') => {
        if (!user) return;
        setNotesLoading(true);
        try {
            const params = search ? { search } : {};
            const { data } = await api.get('/notes', { params });
            setNotes(data);
        } catch (err) {
            console.error('Failed to fetch notes:', err);
        } finally {
            setNotesLoading(false);
        }
    }, [user]);

    const fetchScores = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await api.get('/ai/scores');
            setQuizScores(data);
        } catch (err) {
            console.error('Failed to fetch scores:', err);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchNotes();
            fetchScores();
        } else {
            setNotes([]);
            setQuizScores([]);
        }
    }, [user, fetchNotes, fetchScores]);

    const addNote = useCallback(async (noteData) => {
        const { data } = await api.post('/notes', noteData);
        setNotes((prev) => [data, ...prev]);
        return data;
    }, []);

    const updateNote = useCallback(async (updatedNote) => {
        const { _id, ...payload } = updatedNote;
        const { data } = await api.put(`/notes/${_id}`, payload);
        setNotes((prev) => prev.map((n) => (n._id === data._id ? data : n)));
        return data;
    }, []);

    const deleteNote = useCallback(async (id) => {
        await api.delete(`/notes/${id}`);
        setNotes((prev) => prev.filter((n) => n._id !== id));
    }, []);

    const addScore = useCallback(async (scoreData) => {
        const { data } = await api.post('/ai/scores', scoreData);
        setQuizScores((prev) => [...prev, data]);
        return data;
    }, []);

    return (
        <AppContext.Provider value={{
            notes,
            notesLoading,
            fetchNotes,
            addNote,
            updateNote,
            deleteNote,
            quizScores,
            addScore,
            timeLeft, isActive, mode,
            toggleTimer, resetTimer,
            setTimeLeft, setMode,
            isChatOpen, setIsChatOpen,
        }}>
            {children}
        </AppContext.Provider>
    );
};
