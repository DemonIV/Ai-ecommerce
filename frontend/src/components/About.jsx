import React from 'react';

export const About = () => {
    return (
        <div className="main-layout" style={{ display: 'block', padding: '40px 20px', maxWidth: '800px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontFamily: 'Nunito', fontSize: '32px', color: 'var(--orange)', marginBottom: '20px' }}>
                    Hakkımızda
                </h2>

                <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--mid)', marginBottom: '24px' }}>
                    Bu uygulama sıradan bir e-ticaret sitesi değildir; <strong>İnsan-Bilgisayar Etkileşimi (HCI)</strong> dersi kapsamında
                    kullanılabilirlik (usability) ve kullanıcı deneyimi (UX) testleri için özel olarak geliştirilmiş bir
                    <strong> UX Araştırma Simülasyonudur</strong>. Proje içerisinde kullanıcı davranışlarını manipüle eden ve
                    Dark Pattern (Karanlık Tasarım) olarak bilinen aldatıcı tasarım teknikleri bilinçli olarak yerleştirilmiştir.
                </p>

                <div style={{ background: 'var(--light)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--orange)', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--dark)', marginBottom: '10px' }}>👨‍💻 Proje Sahibi</h3>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--orange)' }}>MOHAMMED MASHHOR ALMASHHOR</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                        <a href="https://github.com/MOHAMMEDALMASHHOR" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dark)', textDecoration: 'none', fontWeight: '600' }}>
                            🐙 GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/mohmammed-almashhor-668459258?miniProfileUrn=urn%3Ali%3Afsd_profile%3AACoAAD9tRXABgBRzP-58mqkd5Hkmri-YYG_Y6A0&lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3BpgynbbruTv6OE89hFYD2wg%3D%3D" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0077b5', textDecoration: 'none', fontWeight: '600' }}>
                            💼 LinkedIn
                        </a>
                    </div>
                </div>

                <div style={{ background: '#FFF3E8', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--dark)', marginBottom: '10px' }}>👩‍🏫 Akademik Gözetim</h3>
                    <p style={{ fontSize: '15px', color: 'var(--mid)', lineHeight: '1.6' }}>
                        Bu proje, İnsan-Bilgisayar Etkileşimi dersi kapsamında hazırlanmıştır ve
                        <strong> Dr. Öğr. Aycan Pekpazar</strong> tarafından denetlenmektedir.
                    </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Proje İçi Araştırma Konuları:</h4>
                    <ul style={{ paddingLeft: '20px', color: 'var(--mid)', lineHeight: '1.8', fontSize: '14px' }}>
                        <li>Flash kampanya panikleri (Yapay Aciliyet)</li>
                        <li>Gizli kargo ve hizmet ücretleri</li>
                        <li>Kafa karıştırıcı navigasyon yönlendirmeleri</li>
                        <li>Paket bazlı yanıltıcı fiyatlandırmalar</li>
                        <li>Otomatik seçili ek hizmetler (Sepete sızma)</li>
                        <li>Çerezlerde (Cookies) yönlendirici ve tek taraflı buton hiyerarşisi</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
