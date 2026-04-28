import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineShieldCheck } from 'react-icons/hi';

const SECTIONS = [
    {
        title: '1. About This Project',
        body: `StudyBuddy is an AI-powered study notes and quiz platform developed by Ashfaaq Feroz Muhammad (Ashfaaq KT) as the Final Full Stack MERN Project for the Entri Elevate Full Stack Development programme. It is an educational capstone submission demonstrating end-to-end proficiency across MongoDB, Express, React, and Node.js — including JWT authentication, REST API design, Google Gemini AI integration, and cloud deployment.`,
    },
    {
        title: '2. Acceptance of Terms',
        body: `By creating an account on StudyBuddy, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please do not register or use the service.`,
    },
    {
        title: '3. Use of the Service',
        body: `StudyBuddy is provided for personal, educational, and non-commercial use only. You agree not to misuse the platform, attempt to reverse-engineer it, or use it for any purpose that violates applicable laws. You are responsible for keeping your login credentials secure and for all activity that occurs under your account.`,
    },
    {
        title: '4. User Data & Privacy',
        body: `When you register, we collect your name, email address, and a securely hashed password (bcrypt). Your notes and quiz scores are stored in a private MongoDB database and are accessible only to you via JWT-authenticated API calls. We do not sell, share, or monetise your personal data. Data may be stored on third-party cloud services (MongoDB Atlas, Render) subject to their own privacy policies.`,
    },
    {
        title: '5. AI-Generated Content',
        body: `StudyBuddy uses the Google Gemini API to generate summaries, quizzes, tables, and rewrites from your note content. AI-generated output is provided for study assistance only and may not always be accurate. You should independently verify any AI-generated information before relying on it for academic or professional purposes. Your note content is sent to Google's servers solely to generate responses; refer to Google's privacy policy for details on how they handle API data.`,
    },
    {
        title: '6. Intellectual Property',
        body: `The StudyBuddy application — including its source code, UI design, and documentation — is licensed under the MIT License (see Section 9). Notes and content you create remain your own intellectual property. The MIT licence grants anyone the right to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided the original copyright notice is retained.`,
    },
    {
        title: '7. Disclaimer of Warranties',
        body: `StudyBuddy is provided "as is" and "as available" without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. As an educational project, the service may experience downtime, data loss, or feature changes without prior notice. Use it at your own discretion.`,
    },
    {
        title: '8. Limitation of Liability',
        body: `To the fullest extent permitted by law, Ashfaaq Feroz Muhammad and AshTech shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, StudyBuddy, even if advised of the possibility of such damages.`,
    },
    {
        title: '9. MIT License',
        body: `MIT License\n\nCopyright (c) 2026 Ashfaaq Feroz Muhammad\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`,
        mono: true,
    },
    {
        title: '10. Changes to These Terms',
        body: `These terms may be updated at any time as the project evolves. Continued use of StudyBuddy after changes are posted constitutes acceptance of the revised terms.`,
    },
    {
        title: '11. Contact',
        body: `For any questions regarding these terms, reach out to:\n\nAshfaaq Feroz Muhammad\nEmail: ashfaaqktmail@gmail.com\nGitHub: github.com/ashfaaqkt\nWebsite: ashfaaqkt.com`,
    },
];

const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="sb-container max-w-3xl mx-auto space-y-8 py-4">
            <button type="button" onClick={() => navigate(-1)} className="sb-btn sb-btn-ghost">
                <HiOutlineArrowLeft /> Back
            </button>

            <div className="sb-card space-y-3">
                <div className="flex items-center gap-3">
                    <HiOutlineShieldCheck className="text-emerald-300 text-3xl flex-shrink-0" />
                    <div>
                        <p className="sb-kicker">Legal</p>
                        <h1 className="font-display text-2xl md:text-3xl text-white">Terms &amp; Conditions</h1>
                    </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Effective date: <span className="text-slate-300">January 1, 2026</span> &nbsp;·&nbsp;
                    StudyBuddy — Final Full Stack MERN Project &nbsp;·&nbsp;
                    Entri Elevate &nbsp;·&nbsp; Developed by <span className="text-emerald-300">Ashfaaq KT</span>
                </p>
            </div>

            <div className="space-y-5">
                {SECTIONS.map((s) => (
                    <div key={s.title} className="sb-card space-y-3">
                        <h2 className="font-display text-base text-white">{s.title}</h2>
                        {s.mono ? (
                            <pre className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-white/5 rounded-xl p-4 overflow-x-auto">
                                {s.body}
                            </pre>
                        ) : (
                            <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-center text-slate-600 text-xs pb-4">
                StudyBuddy · Entri Elevate Final Full Stack MERN Project · © 2026 Ashfaaq Feroz Muhammad
            </p>
        </div>
    );
};

export default TermsPage;
