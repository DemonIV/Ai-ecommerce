import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Profile = () => {
    const { user, favorites, products, logout, setActivePage, taskReports, showToast, logAction } = useAppContext();
    const [deleteStep, setDeleteStep] = useState(0);

    if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>Lütfen giriş yapın.</div>;

    const userFavs = [...favorites].map(id => products.find(p => p.id === id)).filter(Boolean);

    const handleDeleteAccount = () => {
        logAction('Hesap Silme Düğmesine Tıklandı');
        if (deleteStep === 0) {
            setDeleteStep(1);
            showToast('Hesabınızı silmek istediğinize emin misiniz? (Tüm verileriniz silinecek)');
        } else if (deleteStep === 1) {
            setDeleteStep(2);
            showToast('Son Onay: Gerçekten hesabınızı tamamen kalıcı olarak kapatmak istiyor musunuz?');
        } else {
            logAction('Hesap Silme Hatası - Sunucu İzni Yok', true);
            showToast('SİSTEM HATASI 500: Lütfen hafta içi 09:00 - 17:00 arası Müşteri Hizmetlerini arayarak talep oluşturunuz.');
            setDeleteStep(0);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                <div>
                    <h2 style={{ fontFamily: 'Nunito', fontSize: '28px', color: 'var(--dark)' }}>Hoş Geldiniz, {user.name}</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '14px', marginTop: '4px' }}>Email Hesabı: {user.email}</p>
                    <div style={{ marginTop: '15px' }}>
                        <button onClick={logout} style={{ padding: '8px 16px', background: 'var(--dark)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}>Çıkış Yap 🚪</button>
                        {/* Roach Motel Pattern */}
                        <button onClick={handleDeleteAccount} style={{ padding: '8px 16px', background: deleteStep > 0 ? 'var(--orange)' : 'transparent', color: deleteStep > 0 ? '#fff' : 'var(--red)', border: '1px solid var(--red)', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                            {deleteStep === 0 ? 'Hesabımı Sil' : deleteStep === 1 ? 'Eminim, Sil' : 'ONAYLIYORUM SİL'}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--orange)', marginBottom: '16px' }}>❤️ Favorileriniz ({favorites.size})</h3>
                    {userFavs.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#888' }}>Henüz favori ürününüz yok.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {userFavs.map(p => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                                    <div style={{ fontSize: '24px', background: 'var(--light)', padding: '8px', borderRadius: '8px' }}>{p.emoji}</div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{p.name}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--orange)', fontWeight: 'bold' }}>₺{p.price.toLocaleString('tr-TR')}</div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActivePage('Shop')} style={{ background: 'transparent', border: '1px solid var(--orange)', color: 'var(--orange)', padding: '8px', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', fontSize: '13px', fontWeight: 'bold' }}>Alışverişe Devam Et</button>
                        </div>
                    )}
                </div>

                <div style={{ background: '#1A1A2E', color: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--orange)', marginBottom: '16px' }}>🔬 UX Test Görev Durumları</h3>
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Yalnızca sizin tamamladığınız görevler listelenmektedir. Tüm anonim loglar Observer Panel'de yer alır.</p>
                    {Object.keys(taskReports).length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#aaa' }}>Hiçbir test verisi bulunamadı.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(taskReports).map(([taskId, data]) => (
                                <div key={taskId} style={{ background: '#0F3460', borderLeft: '4px solid var(--green)', padding: '12px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>Görev {Number(taskId) + 1} • {data.timestamp}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Tamamlandı ✅</span>
                                        <span style={{ fontSize: '12px' }}>⏱️ {data.duration}s | ⚠️ {data.errors} Hata</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
