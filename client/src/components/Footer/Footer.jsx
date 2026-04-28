import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="mt-auto relative z-10">
            <div className="w-full px-4 md:px-8 py-6 border border-white/10 rounded-t-2xl bg-[rgba(17,25,35,0.9)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="font-display text-lg text-white">
                            Study<span className="text-emerald-300">Buddy.</span>
                        </p>
                        <Link
                            to="/terms"
                            className="text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-300 transition-colors"
                        >
                            Terms &amp; Conditions
                        </Link>
                    </div>

                    <div className="text-center md:text-right space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Developed by</p>
                        <p className="text-sm font-semibold text-slate-200">
                            <span>Ashfaaq KT For Entri Elevate</span>
                            <span className="block">Final Main Project - MERN</span>
                        </p>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 mt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-slate-600">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                        <span>Built by</span>
                        <a
                            href="https://ashfaaqkt.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-emerald-300 transition-colors font-medium"
                        >
                            Ashfaaq KT
                        </a>
                        <span className="text-slate-700">·</span>
                        <a
                            href="https://ashtechnologiesolutions.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-emerald-300 transition-colors font-medium"
                        >
                            AshTech
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
