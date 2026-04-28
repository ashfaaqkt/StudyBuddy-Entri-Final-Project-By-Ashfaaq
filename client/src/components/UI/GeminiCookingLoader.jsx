import { useEffect, useRef } from 'react';

// Unique loading overlay shown while Gemini generates a quiz
const GeminiCookingLoader = () => {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const W = canvas.width = canvas.offsetWidth;
        const H = canvas.height = canvas.offsetHeight;
        const cx = W / 2;
        const cy = H / 2;

        // Neural nodes
        const nodes = Array.from({ length: 18 }, (_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const r = 55 + Math.random() * 45;
            return {
                x: cx + Math.cos(angle) * r,
                y: cy + Math.sin(angle) * r,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: 2 + Math.random() * 2.5,
                pulse: Math.random() * Math.PI * 2,
            };
        });

        let t = 0;

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            t += 0.018;

            // Move nodes
            nodes.forEach((n) => {
                n.x += n.vx;
                n.y += n.vy;
                const dx = n.x - cx, dy = n.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 95) { n.vx -= dx * 0.002; n.vy -= dy * 0.002; }
                if (dist < 40) { n.vx += dx * 0.003; n.vy += dy * 0.003; }
                n.pulse += 0.04;
            });

            // Draw edges between close nodes
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 80) {
                        const alpha = (1 - d / 80) * 0.45;
                        const pulse = (Math.sin(t * 2 + i * 0.5) + 1) / 2;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(94,234,212,${alpha * (0.4 + pulse * 0.6)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach((n) => {
                const pulse = (Math.sin(n.pulse) + 1) / 2;
                const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.5);
                glow.addColorStop(0, `rgba(94,234,212,${0.9 + pulse * 0.1})`);
                glow.addColorStop(0.5, `rgba(56,189,248,${0.35 + pulse * 0.3})`);
                glow.addColorStop(1, 'rgba(56,189,248,0)');
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180,255,245,${0.85 + pulse * 0.15})`;
                ctx.fill();
            });

            // Central orb
            const orbPulse = (Math.sin(t * 1.4) + 1) / 2;
            const orbR = 18 + orbPulse * 5;
            const orb = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR * 2.5);
            orb.addColorStop(0, 'rgba(251,191,36,0.95)');
            orb.addColorStop(0.3, 'rgba(251,146,60,0.7)');
            orb.addColorStop(0.7, 'rgba(20,184,166,0.3)');
            orb.addColorStop(1, 'rgba(20,184,166,0)');
            ctx.beginPath();
            ctx.arc(cx, cy, orbR * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = orb;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
            const innerOrb = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR);
            innerOrb.addColorStop(0, 'rgba(255,255,255,0.95)');
            innerOrb.addColorStop(0.4, 'rgba(251,191,36,0.9)');
            innerOrb.addColorStop(1, 'rgba(251,146,60,0.6)');
            ctx.fillStyle = innerOrb;
            ctx.fill();

            // Three orbiting rings at different speeds
            [[70, 0.6, 'rgba(94,234,212,0.25)', 3], [95, -0.35, 'rgba(56,189,248,0.18)', 2], [115, 0.22, 'rgba(251,191,36,0.14)', 1.5]].forEach(
                ([r, speed, color, lw]) => {
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, r, r * 0.38, t * speed, 0, Math.PI * 2);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lw;
                    ctx.stroke();

                    // Dot on ring
                    const dotAngle = t * speed * 2;
                    const dx = Math.cos(dotAngle) * r;
                    const dy = Math.sin(dotAngle) * r * 0.38;
                    const rotX = cx + dx * Math.cos(t * speed) - dy * Math.sin(t * speed);
                    const rotY = cy + dx * Math.sin(t * speed) + dy * Math.cos(t * speed);
                    ctx.beginPath();
                    ctx.arc(rotX, rotY, lw * 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = color.replace(/[\d.]+\)$/, '0.9)');
                    ctx.fill();
                }
            );

            rafRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center"
            style={{ background: 'rgba(7,11,17,0.88)', backdropFilter: 'blur(12px)' }}>

            <div className="flex flex-col items-center gap-6 select-none">

                {/* Canvas animation */}
                <div className="relative" style={{ width: 240, height: 240 }}>
                    <canvas
                        ref={canvasRef}
                        style={{ width: 240, height: 240 }}
                        width={240}
                        height={240}
                    />
                </div>

                {/* Text */}
                <div className="text-center space-y-2">
                    <p className="text-xl font-semibold tracking-wide gemini-cook-shimmer">
                        Gemini cooking your quiz
                    </p>
                    <p className="text-slate-500 text-sm tracking-widest uppercase">
                        Analysing your notes&hellip;
                    </p>
                </div>

                {/* Animated dot trail */}
                <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <span
                            key={i}
                            className="gemini-cook-dot"
                            style={{ animationDelay: `${i * 0.18}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GeminiCookingLoader;
