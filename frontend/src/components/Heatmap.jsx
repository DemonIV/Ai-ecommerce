import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'hci_heatmap';
const MAX_CLICKS = 2000;
const MAX_HOVERS = 8000;
const HOVER_MS = 80;

const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { clicks: [], hovers: [] }; }
    catch { return { clicks: [], hovers: [] }; }
};
const save = (d) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
};

const heatColor = (t) => {
    const stops = [[0,0,255],[0,255,255],[0,255,0],[255,255,0],[255,128,0],[255,0,0]];
    const idx = Math.min(t, 0.9999) * (stops.length - 1);
    const i = Math.floor(idx);
    const f = idx - i;
    return stops[i].map((v, j) => Math.round(v + (stops[i + 1][j] - v) * f));
};

const drawHeatmap = (canvas, points, radius) => {
    if (!canvas || !points.length) return;
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d');
    octx.globalCompositeOperation = 'lighter';

    points.forEach(p => {
        const x = p.x * W, y = p.y * H;
        const g = octx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, 'rgba(255,255,255,0.07)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        octx.fillStyle = g;
        octx.beginPath();
        octx.arc(x, y, radius, 0, Math.PI * 2);
        octx.fill();
    });

    const src = octx.getImageData(0, 0, W, H);
    const dst = ctx.createImageData(W, H);
    for (let i = 0; i < src.data.length; i += 4) {
        const intensity = src.data[i] / 255;
        if (intensity > 0.02) {
            const [r, g, b] = heatColor(Math.min(intensity * 3, 1));
            dst.data[i] = r;
            dst.data[i + 1] = g;
            dst.data[i + 2] = b;
            dst.data[i + 3] = Math.min(255, intensity * 900);
        }
    }
    ctx.putImageData(dst, 0, 0);

    if (radius > 28) {
        points.slice(-300).forEach(p => {
            const x = p.x * W, y = p.y * H;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.65)';
            ctx.fill();
        });
    }
};

export const HeatmapTracker = () => {
    const data = useRef(load());
    const lastHover = useRef(0);

    useEffect(() => {
        const onClick = (e) => {
            data.current.clicks.push({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
            if (data.current.clicks.length > MAX_CLICKS)
                data.current.clicks = data.current.clicks.slice(-MAX_CLICKS);
            save(data.current);
        };
        const onMove = (e) => {
            const now = Date.now();
            if (now - lastHover.current < HOVER_MS) return;
            lastHover.current = now;
            data.current.hovers.push({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
            if (data.current.hovers.length > MAX_HOVERS)
                data.current.hovers = data.current.hovers.slice(-MAX_HOVERS);
            save(data.current);
        };
        document.addEventListener('click', onClick);
        document.addEventListener('mousemove', onMove);
        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('mousemove', onMove);
        };
    }, []);

    return null;
};

const ZONES = ['Sol Üst','Orta Üst','Sağ Üst','Sol Orta','Merkez','Sağ Orta','Sol Alt','Orta Alt','Sağ Alt'];

export const HeatmapModal = ({ onClose }) => {
    const [tab, setTab] = useState('click');
    const [data, setData] = useState(load);
    const canvasRef = useRef(null);

    useEffect(() => {
        drawHeatmap(canvasRef.current, tab === 'click' ? data.clicks : data.hovers, tab === 'click' ? 36 : 18);
    }, [tab, data]);

    const clear = () => { const e = { clicks: [], hovers: [] }; save(e); setData(e); };

    const zoneCounts = Array(9).fill(0);
    data.clicks.forEach(p => {
        const col = Math.min(Math.floor(p.x * 3), 2);
        const row = Math.min(Math.floor(p.y * 3), 2);
        zoneCounts[row * 3 + col]++;
    });
    const hotZone = ZONES[zoneCounts.indexOf(Math.max(...zoneCounts))];
    const activePoints = tab === 'click' ? data.clicks : data.hovers;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '22px 20px', overflowY: 'auto' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '980px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div>
                    <h2 style={{ color: '#fff', fontFamily: 'Nunito', fontSize: '24px', fontWeight: 800 }}>🔥 Isı Haritası Analizi</h2>
                    <p style={{ color: '#666', fontSize: '12px', marginTop: '3px' }}>Kullanıcı tıklama ve fare hareketlerinin görsel analizi</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={clear} style={{ padding: '9px 18px', background: '#FF3547', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>🗑️ Temizle</button>
                    <button onClick={onClose} style={{ padding: '9px 18px', background: '#2a2a2a', color: '#aaa', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>✕ Kapat</button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                    { icon: '🖱️', val: data.clicks.length, label: 'Toplam Tıklama' },
                    { icon: '✋', val: data.hovers.length, label: 'Hover Noktası' },
                    { icon: '🎯', val: data.clicks.length ? hotZone : '—', label: 'En Aktif Bölge' },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 28px', textAlign: 'center', color: '#fff', minWidth: '130px' }}>
                        <div style={{ fontSize: '26px', marginBottom: '6px' }}>{s.icon}</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Nunito', color: 'var(--orange)' }}>{s.val}</div>
                        <div style={{ fontSize: '11px', color: '#777', marginTop: '3px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {[['click', '🖱️ Tıklama Haritası'], ['hover', '✋ Hover Haritası']].map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)}
                        style={{ padding: '10px 24px', background: tab === key ? 'var(--orange)' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: tab === key ? 700 : 400, fontSize: '13px', transition: 'background 0.2s' }}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Canvas */}
            <div style={{ width: '100%', maxWidth: '980px', background: '#0d1117', borderRadius: '14px', overflow: 'hidden', position: 'relative', border: '1px solid #222', aspectRatio: '16/9' }}>
                {/* Zone grid */}
                <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', zIndex: 1, pointerEvents: 'none' }}>
                    {ZONES.map((name, i) => (
                        <div key={i} style={{ border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.12)', userSelect: 'none' }}>{name}</span>
                        </div>
                    ))}
                </div>

                {activePoints.length === 0 ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                        <div style={{ fontSize: '52px', marginBottom: '14px' }}>🌡️</div>
                        <p style={{ fontSize: '14px' }}>Henüz veri yok</p>
                        <p style={{ fontSize: '12px', marginTop: '6px', color: '#333' }}>Bu modalı kapatın, sayfada gezinin ve tıklayın</p>
                    </div>
                ) : (
                    <canvas ref={canvasRef} width={980} height={551} style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 2 }} />
                )}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <span style={{ fontSize: '11px', color: '#555' }}>Soğuk</span>
                <div style={{ width: '220px', height: '10px', borderRadius: '5px', background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000)' }} />
                <span style={{ fontSize: '11px', color: '#555' }}>Sıcak</span>
            </div>

        </div>
    );
};
