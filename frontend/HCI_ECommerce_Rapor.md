# HCI (İnsan-Bilgisayar Etkileşimi) E-Ticaret Projesi Gözlem ve UX Raporu 

**Hazırlayan:** MOHAMMED MASHHOR ALMASHHOR  
**Öğrenci No:** 9211118091  
**Ders Yöneticisi:** Dr. Öğr. Üyesi Emel Soylu  

---

## 🚀 Full-Stack Mimari ve Sistem Çalıştırma
Uygulama Front-End ve Back-End olmak üzere iki katmanlı olarak çalışmaktadır.
Kullanıcı kayıtları (Authentication), JWT Token mekanizması ve veritabanı simülasyonu NodeJS Express sunucusu üzerinde koşmaktadır.

**Sunucuyu (Backend) Başlatma:**
```bash
cd hci-backend
npm install
node server.js
```
*Backend `http://localhost:5000` portundan hizmet verecektir. Node.js yüklü olması gerekir.*

**İstemciyi (Frontend) Başlatma:**
```bash
cd hci-eticaret
npm install
npm run dev
```

---

## 🎯 Projenin Amacı ve Kapsamı
Bu uygulama, sıradan bir e-ticaret sitesi değildir; **İnsan-Bilgisayar Etkileşimi (HCI)** dersi kapsamında kullanılabilirlik (usability) ve kullanıcı deneyimi (UX) testleri için özel olarak geliştirilmiş bir **UX Araştırma Simülasyonudur**. Proje içerisinde kullanıcı davranışlarını manipüle eden ve Dark Pattern (Karanlık Tasarım) olarak bilinen aldatıcı tasarım teknikleri bilinçli olarak yerleştirilmiştir. UX analiz süreçini yönetmek için hem Backend kullanan hem de yerel olarak ilerlemeyi anlık ölçen gizli bir "Gözlemci Paneli" (Observer Panel) mevcuttur.

---

## ⚠️ Kullanılan Dark Pattern'ler ve Beklenen Kullanıcı Hataları

### 1. Kayıt/Giriş (Auth) Manipülasyonları ve Newsletter Truvası 
* **Kullanıldığı Yer:** `Auth.jsx` (Giriş/Kayıt Sayfası)
* **Nasıl Çalışır:** "Kayıt Ol" butonu devasa ve yeşilken, "Giriş Yap" butonu sönük ve gözden kaçacak formattadır. Ayrıca kayıt formunda "Bana günde 3 kez e-posta atın" (Newsletter / Spam aboneliği) varsayılan olarak `checked` (işaretlenmiş) gelir. Arkaplan (backend), kullanıcı kaydederken çok katı şifre kuralları arar ancak arayüz (UI) şifrenin neye benzemesi gerektiğini asla yazmaz.
* **Beklenen Kullanıcı Hatası:** Kullanıcıların form doldururken otomatik check edilmiş bülten checkboxını gözden kaçırıp fark etmeden kayıt olmaları. Karmaşık şifre kuralları sebebiyle çileye çekilmeleri ve sistem tarafından sürekli "Form geçersiz" ibaresiyle yıldırılmaları.

### 2. Flash Sale Baskısı (Yapay Aciliyet)
* **Kullanıldığı Yer:** `Layout.jsx` (FlashBanner), `Modals.jsx` (ProductDetailModal)
* **Nasıl Çalışır:** Sürekli geriye sayan ama asla bitmeyen bir sayaç vardır. Ürün detaylarında "Bu fiyat 03:14 sonra bitiyor!"

### 3. Değişken Ürün İsimleri
* **Kullanıldığı Yer:** `Shop.jsx` (ProductCard)
* **Nasıl Çalışır:** Ürünlerin iki farklı adı vardır ve ekranda rastgele %50 ihtimalle biri gösterilir. Kullanıcı karşılaştırma yaparken aynı ürünü iki kere ekleyebilir.

### 4. Paket Halinde Satış (Gizlenmiş Birim Fiyat)
* **Nasıl Çalışır:** Fiyat tekil ürüne değil, toplu pakete aittir ancak bu çok küçük bir yazıyla (`📦 2'li Paket Fiyatı`) belirtilir. Şoka uğratarak sepet total'ini artırmak amaçlanmıştır.

### 5. Kafa Karıştırıcı Navigasyon (Bait and Switch)
* **Kullanıldığı Yer:** `Layout.jsx` (Navbar), `Shop.jsx` (Sidebar)
* **Nasıl Çalışır:** Navigasyon barında "Elektronik" butonuna tıklandığında sistem kasıtlı olarak "Spor", "Spor"a basıldığında "Giyim" ürünleri listeler.
* **Beklenen Kullanıcı Hatası:** Otomatize alışkanlıklarla tıklama yapan kullanıcıların çıkan sonuçların ilgisizliğinde kaybolması ve test akışını sorgulaması.

### 6. Agresif Pop-up Reklamlar
* **Kullanıldığı Yer:** `Popups.jsx`
* **Nasıl Çalışır:** Sitede 15 saniye gezindikten sonra ekranı aniden kapatan karanlık bir pop-up çıkar. Hediyemi Al butonu devasa boyuttadır, iptal etme butonu ise renksiz "fırsatları kaçırmayı seviyorum" gibi manipülatif bir alt başlıktır (Confirmshaming).

### 7. Sahte Sosyal Kanıt ve Fake Yorumlar (Fake Social Proof)
* **Nasıl Çalışır:** "Son 3 ürün", "Şu an 47 kişi sayfayı inceliyor" gibi dinamik yapay sayaçlar kurgulanmıştır. Satış baskısı (`Bandwagon effect`) ile alışveriş tetiklenir.

---

## 🛠️ Gelişmiş Test / Gözlem Modu (Full Stack Loglama)
Sistem iki ayaklı bir gözlem mekanizmasına sahiptir:
1. **Yerel Observer Panel (CTRL + SHIFT + T):** Denek bilgisayarda görev yaparken her adımını (`localStorage` ile saniye saniye kaydeder).
2. **Backend Logger:** Kullanıcının `App` içerisindeki her tıklaması (`addToCart`, `Login`, `Elektronik yerine Spor tıkladı`) saniyesi saniyesine Node.js Database katmanına (`/logs`) kaydedilir ve `/me` endpointi ile Profile çekilir.

### Öğrenci Tanımlı Test Aktiviteleri:
1. "Giriş Yapılmadan Favorilere Ekleme -> Sistemin sizi Zorla Kayıt Sayfasına Atması"
2. "Ayakkabı Sepete Ekle, Checkout Adımlarında Zorla Genişletilmiş Garanti Dayatılan Sayfayı Geç"
3. "Kayıt Ekranındaki Checkbox Tuzağını Aş ve Şifre Belirle"
4. "Pop-up Ekranını kapat / Reddet / Onayla"
5. "Çerezleri Kısıtla ve Geri Çek"

Öğretim görevlisi gözetiminde UX (Kullanıcı Deneyimi) davranış testlerinde kullanılacak bu yapılar, standart kurumsal yazılım etiğinin bilindiğini, Dark Pattern manipülasyonlarının hangi noktalara kadar gidebileceğini araştırmak amacıyla kurulmuştur. Orjinal metin ve sistem gereklilikleri sağlanmıştır.
