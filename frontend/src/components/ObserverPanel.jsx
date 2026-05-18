import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const taskDescriptions = [
    "Beyaz spor ayakkabı arayın (arama çubuğunu veya kategoriyi kullanarak) ve bir tanesini sepete ekleyin.",
    "Sepetinizdeki tüm ürünlerin toplam fiyatını bulun ve not edin.",
    "Ödeme işlemini başlatın ve sadece ilerleme butonlarına tıklayarak son adıma kadar gidin.",
    "Sayfa yüklendiğinde gelen çerez bildirimini bulun ve çerezleri reddedin / sadece zorunlu çerezleri seçin.",
    "Herhangi bir ürün kartındaki kalp ikonuna tıklayarak ürünü favorilere ekleyin."
];

export const ObserverPanel = () => {
    const [visible, setVisible] = useState(false);
    const { actionLogs, logAction, currentTask, startTask, completeTask, taskReports } = useAppContext();
    const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
                setVisible(v => !v);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Timer rendering hook
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        let t;
        if (currentTask.startTime) {
            t = setInterval(() => {
                setElapsed(Math.floor((Date.now() - currentTask.startTime) / 1000));
            }, 1000);
        } else {
            setElapsed(0);
        }
        return () => clearInterval(t);
    }, [currentTask.startTime]);

    if (!visible) return null;

    return (
        <div id="observerPanel" style={{ display: 'block', width: '420px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="op-header">
                <h4>🔬 Gelişmiş UX Gözlemci Modu</h4><span>CTRL+SHIFT+T</span>
            </div>

            <div className="op-body">
                <div className="op-task-selector">
                    <label style={{ color: 'var(--orange)' }}>Sistem Görevi Seçiniz</label>
                    <select value={selectedTaskIdx} onChange={(e) => setSelectedTaskIdx(Number(e.target.value))}>
                        <option value="0">Görev 1: Beyaz Spor Ayakkabı Bul</option>
                        <option value="1">Görev 2: Toplam Fiyat Kontrolü</option>
                        <option value="2">Görev 3: Ödeme Sürecini İncele</option>
                        <option value="3">Görev 4: Çerezleri Kapatma</option>
                        <option value="4">Görev 5: Favorilere Ekleme</option>
                    </select>
                </div>

                <div className="op-task-display">
                    <strong>📝 GÖREV {selectedTaskIdx + 1} HEDEFİ:</strong>
                    <p>{taskDescriptions[selectedTaskIdx]}</p>
                </div>

                {/* TASK CONTROLS & TRACKING */}
                <div style={{ background: '#1A1A2E', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <strong style={{ fontSize: 12, color: '#fff' }}>⏳ GÖREV TAKİBİ</strong>
                        {currentTask.startTime && <span style={{ color: 'var(--orange)', fontWeight: 'bold' }}>{elapsed} sn</span>}
                    </div>

                    {!currentTask.startTime ? (
                        <button style={{ width: '100%', background: 'var(--green)', color: '#fff', border: 'none', padding: 10, borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={() => startTask(selectedTaskIdx)}>
                            🚀 GÖREVİ BAŞLAT
                        </button>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                <div style={{ flex: 1, background: '#333', padding: 6, borderRadius: 4, textAlign: 'center' }}>
                                    <div style={{ fontSize: 10, color: '#aaa' }}>Hatalar</div>
                                    <div style={{ color: 'var(--red)', fontWeight: 'bold' }}>{currentTask.errors}</div>
                                </div>
                                <div style={{ flex: 1, background: '#333', padding: 6, borderRadius: 4, textAlign: 'center' }}>
                                    <div style={{ fontSize: 10, color: '#aaa' }}>Tıklamalar</div>
                                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{actionLogs.length}</div>
                                </div>
                            </div>
                            <button style={{ width: '100%', background: 'var(--orange)', color: '#fff', border: 'none', padding: 10, borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
                                onClick={completeTask}>
                                ✅ GÖREVİ TAMAMLA VE KAYDET
                            </button>
                        </div>
                    )}
                </div>

                {/* LOGS */}
                <label className="op-notes-label" style={{ marginTop: 10 }}>📝 CANLI KULLANICI LOGLARI (localStorage)</label>
                <div className="op-log" style={{ maxHeight: '200px', background: '#0F3460' }}>
                    {actionLogs.length === 0 && <div style={{ padding: 8, color: '#666', fontSize: 11 }}>Henüz aktivite yok.</div>}
                    {actionLogs.map((log, idx) => (
                        <div key={idx} className="op-log-entry" style={{ color: log.type === 'ERROR' ? 'var(--red)' : '#ccc', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ opacity: 0.5 }}>({log.time})</span> {log.type === 'ERROR' ? '⚠️ ' : '👉 '}{log.desc}
                        </div>
                    ))}
                </div>

                {/* RAPOR SONUÇLARI */}
                {Object.keys(taskReports).length > 0 && (
                    <div style={{ marginTop: 15 }}>
                        <strong style={{ fontSize: 11, color: '#aaa' }}>KAYDEDİLEN GÖREV SONUÇLARI:</strong>
                        {Object.entries(taskReports).map(([id, rep]) => (
                            <div key={id} style={{ background: '#1A1A2E', border: '1px solid #444', padding: 6, margin: '4px 0', fontSize: 11, borderRadius: 4 }}>
                                <strong>G{Number(id) + 1}:</strong> {rep.duration} sn | {rep.errors} Hata
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
                    <button style={{ flex: 1, background: 'transparent', color: '#888', border: '1px solid #444', padding: '6px', cursor: 'pointer', borderRadius: 6, fontSize: 11 }}
                        onClick={() => { localStorage.clear(); window.location.reload(); }}>
                        🗑️ Tüm Verileri Sil
                    </button>
                </div>
            </div>
        </div>
    );
};
