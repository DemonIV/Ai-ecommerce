import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export const PopupAd = () => {
    const [visible, setVisible] = useState(false);
    const { logAction } = useAppContext();

    useEffect(() => {
        // Pop up ad appears after 15 seconds randomly
        const t = setTimeout(() => {
            setVisible(true);
            logAction('Pop-up Reklam Görüntülendi');
        }, 15000);
        return () => clearTimeout(t);
    }, [logAction]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <div style={{
                background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px',
                textAlign: 'center', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
                <div style={{
                    position: 'absolute', top: -15, right: -15, background: 'var(--red)',
                    color: '#fff', borderRadius: '50%', width: 30, height: 30, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold'
                }} onClick={() => { setVisible(false); logAction('Pop-up Kapatıldı'); }}>✕</div>

                <h2 style={{ color: 'var(--orange)', fontFamily: 'Nunito', fontSize: 24, marginBottom: 10 }}>TEBRİKLER! 🎉</h2>
                <p style={{ marginBottom: 20, color: 'var(--mid)', lineHeight: 1.5 }}>
                    Bu ayki <strong>1,000. ziyaretçimiz</strong> oldunuz! Sürpriz hediye çarkını
                    çevirerek anında 500 TL indirim kazanma şansı yakaladınız!
                </p>

                {/* DARK PATTERN: Green button says claim, small faint text says disregard */}
                <button style={{
                    width: '100%', padding: 15, background: 'var(--green)', color: '#fff',
                    border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
                    marginBottom: 10
                }} onClick={() => { setVisible(false); logAction('Pop-up Hediyesine Tıklandı'); }}>
                    HEDİYEMİ AL
                </button>

                <p style={{ fontSize: 10, color: '#aaa', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => { setVisible(false); logAction('Pop-up Reddedildi'); }}>
                    hayır, fırsatları kaçırmayı seviyorum
                </p>
            </div>
        </div>
    );
};
