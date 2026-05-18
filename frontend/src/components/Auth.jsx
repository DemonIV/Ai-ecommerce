import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Auth = () => {
    const { login, register, setActivePage, logAction, showToast } = useAppContext();
    const [view, setView] = useState('login'); // 'login' or 'register'

    // Registration form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [newsletter, setNewsletter] = useState(true);

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPwd, setLoginPwd] = useState('');

    const [errorMsg, setErrorMsg] = useState('');

    const submitLogin = async (e) => {
        e.preventDefault();
        try {
            await login(loginEmail, loginPwd);
            showToast('Giriş Başarılı, Yönlendiriliyorsunuz...');
            setActivePage('Profile');
        } catch (err) {
            logAction('Giriş Başarısız: ' + err.message, true);
            if (err.message === 'Failed to fetch') {
                setErrorMsg('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin veya birkaç saniye bekleyip tekrar deneyin.');
            } else {
                setErrorMsg(err.message);
            }
        }
    };

    const submitRegister = async (e) => {
        e.preventDefault();
        if (pwd !== pwd2) {
            setErrorMsg('Şifreler eşleşmiyor, lütfen tekrar deneyin.');
            logAction('Kayıt Başarısız: Şifre Eşleşmeme', true);
            return;
        }
        try {
            await register(name, email, pwd);
            showToast('Müşteri kaydınız başarıyla oluşturuldu!');
            setActivePage('Profile');
        } catch (err) {
            logAction('Kayıt Başarısız: ' + err.message, true);
            if (err.message === 'Failed to fetch') {
                setErrorMsg('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin veya birkaç saniye bekleyip tekrar deneyin.');
            } else {
                setErrorMsg(err.message);
            }
        }
    };

    const inputStyle = (borderColor) => ({
        width: '100%',
        padding: '12px 14px 12px 42px',
        border: `1.5px solid ${borderColor || '#E9ECEF'}`,
        borderRadius: '10px',
        fontSize: '14px',
        outline: 'none',
        background: '#FAFBFC',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    });

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        color: 'var(--mid)',
        marginBottom: '6px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const iconWrap = { position: 'relative' };
    const iconSpan = { position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none' };

    return (
        <div className="auth-page">

            {view === 'login' ? (
                // -------------------------------------
                // L O G I N   V I E W
                // -------------------------------------
                <div className="auth-login-card">

                    <div className="auth-login-form">
                        <h2 style={{ fontSize: '28px', color: 'var(--dark)', marginBottom: '8px', fontFamily: 'Nunito', fontWeight: 800 }}>Tekrar Hoş Geldin!</h2>
                        <p style={{ color: 'var(--mid)', fontSize: '14px', marginBottom: '30px' }}>Alışverişe kaldığın yerden devam etmek için bilgilerini gir.</p>

                        {errorMsg && (
                            <div style={{ background: '#ffebee', color: 'var(--red)', padding: '12px', borderLeft: '4px solid var(--red)', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                                ⚠️ {errorMsg}
                            </div>
                        )}

                        <form onSubmit={submitLogin}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--mid)', marginBottom: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>E-Posta Adresiniz</label>
                                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required placeholder="ornek@mail.com"
                                    style={{ width: '100%', padding: '14px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--mid)', marginBottom: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Şifreniz</label>
                                <input type="password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} required placeholder="••••••••"
                                    style={{ width: '100%', padding: '14px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
                            </div>

                            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Şifre yenileme sunucusu şu an geçici olarak yanıt vermiyor.', true); logAction('Şifremi Unuttum Bağlantısına Tıklandı', true); }} style={{ fontSize: '12px', color: 'var(--orange)', textDecoration: 'none', fontWeight: 'bold' }}>Şifremi Unuttum?</a>
                            </div>

                            <button type="submit" style={{ width: '100%', padding: '16px', background: 'var(--dark2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}>
                                Giriş Yap
                            </button>
                        </form>
                    </div>

                    <div className="auth-login-promo">
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛍️</div>
                        <h3 style={{ fontSize: '24px', fontFamily: 'Nunito', marginBottom: '16px', fontWeight: 800 }}>Daha Fazla Fırsat mı Arıyorsun?</h3>
                        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '30px', opacity: 0.9 }}>
                            Üye olarak hemen %50'ye varan efsane indirim kovalama şansını yakala. Binlerce ürün seni bekliyor!
                        </p>
                        <button
                            onClick={() => { setView('register'); logAction('Kayıt Ol Yönlendirmesine Tıklandı'); setErrorMsg(''); }}
                            style={{ padding: '14px 30px', background: '#fff', color: 'var(--orange)', border: 'none', borderRadius: '30px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                            YENİ HESAP OLUŞTUR →
                        </button>
                    </div>

                </div>

            ) : (

                // -------------------------------------
                // R E G I S T E R   V I E W
                // -------------------------------------
                <div className="auth-register-card">

                    {/* Left branding panel */}
                    <div className="auth-register-sidebar">
                        <div>
                            <div style={{ fontSize: '44px', marginBottom: '20px' }}>🛍️</div>
                            <h2 style={{ fontFamily: 'Nunito', fontSize: '26px', fontWeight: 800, marginBottom: '10px', lineHeight: 1.2 }}>VIP Müşteri<br />Olun 🌟</h2>
                            <p style={{ fontSize: '13px', color: '#9AAAC4', lineHeight: 1.7, marginBottom: '28px' }}>
                                Hemen üye olun, binlerce üründe özel fiyatlardan yararlanın.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    ['🏷️', '%50\'ye varan özel indirimler'],
                                    ['⚡', 'Hızlı ve kolay ödeme'],
                                    ['📦', 'Sipariş takibi ve kolay iade'],
                                    ['💡', 'Kişiselleştirilmiş öneriler'],
                                ].map(([icon, text], i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#C5D3E8' }}>
                                        <div style={{ width: '28px', height: '28px', background: 'rgba(255,107,0,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                                            {icon}
                                        </div>
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: '12px', color: '#556', marginBottom: '10px' }}>Zaten hesabınız var mı?</p>
                            <button
                                onClick={() => { setView('login'); logAction('Kayıttan Girişe Geri Dönüldü'); setErrorMsg(''); }}
                                style={{ width: '100%', background: 'transparent', border: '2px solid rgba(255,255,255,0.2)', color: '#fff', padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                                ← Giriş Yap
                            </button>
                        </div>
                    </div>

                    {/* Right form panel */}
                    <div className="auth-register-form">
                        <h3 style={{ fontFamily: 'Nunito', fontSize: '22px', fontWeight: 800, color: 'var(--dark)', marginBottom: '4px' }}>Hesap Oluştur</h3>
                        <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '24px' }}>Bilgilerinizi girerek ücretsiz hesabınızı açın.</p>

                        {errorMsg && (
                            <div style={{ background: '#FFF5F5', color: 'var(--red)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid var(--red)', marginBottom: '20px', fontSize: '13px', fontWeight: 600, display: 'flex', gap: '8px' }}>
                                <span style={{ flexShrink: 0 }}>⛔</span>
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <form onSubmit={submitRegister}>

                            {/* Name */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>Ad Soyad</label>
                                <div style={iconWrap}>
                                    <span style={iconSpan}>👤</span>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ali Yılmaz"
                                        style={inputStyle()}
                                        onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                        onBlur={e => e.target.style.borderColor = '#E9ECEF'} />
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>E-Posta Adresi</label>
                                <div style={iconWrap}>
                                    <span style={iconSpan}>✉️</span>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ornek@posta.com"
                                        style={inputStyle()}
                                        onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                        onBlur={e => e.target.style.borderColor = '#E9ECEF'} />
                                </div>
                            </div>

                            {/* Password fields */}
                            <div className="auth-pwd-grid">
                                <div>
                                    <label style={labelStyle}>Şifre</label>
                                    <div style={iconWrap}>
                                        <span style={iconSpan}>🔒</span>
                                        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} required placeholder="Şifreniz"
                                            style={inputStyle()} />
                                    </div>
                                    <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '6px', lineHeight: 1.5 }}>
                                        En az <strong>1 büyük harf</strong> ve <strong>özel karakter</strong> içermeli (örn. A@3k!)
                                    </p>
                                </div>

                                <div>
                                    <label style={labelStyle}>Şifre Tekrar</label>
                                    <div style={iconWrap}>
                                        <span style={iconSpan}>🔑</span>
                                        <input type="password" value={pwd2} onChange={e => setPwd2(e.target.value)} required placeholder="Tekrar girin"
                                            style={inputStyle()} />
                                    </div>
                                </div>
                            </div>

                            {/* UX DARK PATTERN: Forced newsletter styling */}
                            <div style={{ background: '#EAFAF1', border: '1.5px solid #28a745', borderRadius: '10px', padding: '14px 16px', marginBottom: '22px' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={newsletter}
                                        onChange={e => { setNewsletter(e.target.checked); logAction(e.target.checked ? 'Reklam Bülteni Onaylandı' : 'Reklam Bülteni Gizlice Reddedildi'); }}
                                        style={{ accentColor: '#28a745', width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }} />
                                    <span style={{ fontSize: '12px', color: 'var(--dark)', lineHeight: 1.6 }}>
                                        <strong>VIP Bildirim İzni:</strong> İndirimleri kaçırmamam için adıma kampanya SMS'leri, otomatik promosyon e-postaları gönderilmesini kabul ediyorum. İletişim verilerimin üçüncü parti şirketlere satılmasına onay veriyorum.
                                    </span>
                                </label>
                            </div>

                            <button type="submit"
                                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00C851 0%, #00A843 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,200,81,0.3)', fontFamily: 'Nunito, sans-serif', letterSpacing: '0.3px' }}>
                                🎉 ANINDA KAYIT OL!
                            </button>

                        </form>

                        <p className="auth-mobile-login-link" style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--gray)' }}>
                            Zaten hesabın var mı?{' '}
                            <button onClick={() => { setView('login'); setErrorMsg(''); }} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                                Giriş Yap →
                            </button>
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
};
