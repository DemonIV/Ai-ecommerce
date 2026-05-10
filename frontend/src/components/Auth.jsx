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
            setErrorMsg(err.message);
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
            setErrorMsg(err.message + ' (Şifreniz en az 8 hane, 1 Büyük harf ve 1 Özel Karakter [@$!%*?&] içermelidir)');
        }
    };

    return (
        <div style={{ padding: '60px 20px', background: '#F8F9FA', minHeight: '70vh', display: 'flex', justifyContent: 'center' }}>

            {view === 'login' ? (
                // -------------------------------------
                // L O G I N   V I E W
                // -------------------------------------
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', display: 'flex', width: '100%', maxWidth: '850px', overflow: 'hidden' }}>

                    <div style={{ flex: 1, padding: '50px 40px', background: '#ffffff' }}>
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

                    <div style={{ flex: 1, background: 'var(--orange)', color: '#fff', padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
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
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', overflow: 'hidden', padding: '40px' }}>

                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '28px', color: 'var(--green)', fontFamily: 'Nunito', fontWeight: 800 }}>VIP Müşteri Olun 🌟</h2>
                        <p style={{ color: 'var(--mid)', fontSize: '14px', marginTop: '8px' }}>Yeni bir dünya keşfetmek için bilgilerinizi eksiksiz doldurun.</p>
                    </div>

                    {errorMsg && (
                        <div style={{ background: '#ffebee', color: 'var(--red)', padding: '12px', borderLeft: '4px solid var(--red)', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                            ⛔ {errorMsg}
                        </div>
                    )}

                    <form onSubmit={submitRegister}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--dark)', marginBottom: '6px', fontWeight: '600' }}>Ad Soyad</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ali Yılmaz"
                                style={{ width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f8f9fa' }} />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--dark)', marginBottom: '6px', fontWeight: '600' }}>E-Posta Adresi</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ornek@posta.com"
                                style={{ width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f8f9fa' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--dark)', marginBottom: '6px', fontWeight: '600' }}>Geçiş Şifresi Oluşturun</label>
                                <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} required placeholder="Güvenli Kilit"
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f8f9fa' }} />
                                {/* Dark Pattern: Fake Password Strength Meter */}
                                {pwd.length > 0 && (
                                    <div style={{ marginTop: '6px', fontSize: '11px', color: pwd.length > 8 ? 'var(--orange)' : 'var(--red)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ height: '4px', background: pwd.length > 8 ? 'var(--orange)' : 'var(--red)', width: pwd.length > 8 ? '60%' : '30%', borderRadius: '2px' }}></div>
                                        {pwd.length > 8 ? 'Ortalama Güvenlik' : 'Çok Zayıf Şifre'}
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--dark)', marginBottom: '6px', fontWeight: '600' }}>Şifre Doğrulama</label>
                                <input type="password" value={pwd2} onChange={e => setPwd2(e.target.value)} required placeholder="Tekrar Girin"
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f8f9fa' }} />
                            </div>
                        </div>

                        {/* UX DARK PATTERN: Forced newsletter styling */}
                        <div style={{ background: '#eafaf1', border: '1px inset #28a745', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '12px', color: 'var(--dark)', cursor: 'pointer', lineHeight: '1.6' }}>
                                <input type="checkbox" checked={newsletter} onChange={e => { setNewsletter(e.target.checked); logAction(e.target.checked ? 'Reklam Bülteni Onaylandı' : 'Reklam Bülteni Gizlice Reddedildi') }}
                                    style={{ accentColor: '#28a745', marginTop: '3px', width: '20px', height: '20px', cursor: 'pointer' }} />
                                <span>
                                    <strong>VIP Bildirim İzni:</strong> İndirimleri kaçırmamam için adıma kampanya SMS'leri, otomatik promosyon e-postaları gönderilmesini kabul ediyorum. İletişim verilerimin üçüncü parti şirketlere satılmasına onay veriyorum.
                                </span>
                            </label>
                        </div>

                        <button type="submit" style={{ width: '100%', padding: '18px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 20px rgba(40,167,69,0.3)', width: '100%' }}>
                            🎉 ANINDA KAYIT OL!
                        </button>

                        {/* Sneaky back to login link */}
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--mid)' }}>
                            Vazgeçtiniz mi? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); logAction('Kayıttan Girişe Geri Dönüldü'); setErrorMsg(''); }} style={{ color: 'var(--mid)', textDecoration: 'underline' }}>Giriş ekranına dönün.</a>
                        </p>
                    </form>
                </div>
            )}

        </div>
    );
};
