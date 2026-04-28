import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles, HiCheck } from 'react-icons/hi';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
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
        if (!isLogin && !agreedToTerms) {
            setError('Please agree to the Terms & Conditions to create an account.');
            return;
        }
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

                    {!isLogin && (
                        <button
                            type="button"
                            onClick={() => { setAgreedToTerms((p) => !p); setError(''); }}
                            className="flex items-start gap-3 w-full text-left group"
                        >
                            {/* Custom checkbox */}
                            <span className={`
                                flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center
                                transition-all duration-200
                                ${agreedToTerms
                                    ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]'
                                    : 'border-white/20 bg-white/5 group-hover:border-emerald-400/60'
                                }
                            `}>
                                {agreedToTerms && <HiCheck className="text-[#0b0f14] text-xs font-bold" />}
                            </span>
                            <span className="text-slate-400 text-sm leading-snug group-hover:text-slate-300 transition-colors">
                                I have read and agree to the{' '}
                                <Link
                                    to="/terms"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-emerald-300 hover:underline"
                                >
                                    Terms &amp; Conditions
                                </Link>
                            </span>
                        </button>
                    )}

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
                        onClick={() => { setIsLogin((p) => !p); setError(''); setAgreedToTerms(false); }}
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
