import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles } from 'react-icons/hi';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, register, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(form.email, form.password);
            } else {
                await register(form.name, form.email, form.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="sb-card w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <HiOutlineSparkles className="text-emerald-300 text-3xl" />
                    </div>
                    <h1 className="font-display text-3xl text-white">StudyBuddy</h1>
                    <p className="text-slate-400 text-sm">
                        {isLogin ? 'Sign in to your workspace' : 'Create your free account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="sb-kicker">Name</label>
                            <input
                                name="name"
                                type="text"
                                className="sb-input mt-2 w-full"
                                placeholder="Your name"
                                value={form.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div>
                        <label className="sb-kicker">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="sb-input mt-2 w-full"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="sb-kicker">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="sb-input mt-2 w-full"
                            placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-amber-300 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={authLoading}
                        className="sb-btn sb-btn-primary w-full justify-center"
                    >
                        {authLoading
                            ? 'Please wait...'
                            : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-slate-400 text-sm">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        type="button"
                        onClick={() => { setIsLogin((p) => !p); setError(''); }}
                        className="text-emerald-300 hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
