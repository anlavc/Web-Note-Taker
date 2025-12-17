# Yaz Kenara (Web Note) 📝

Web sayfalarına not almanızı, kategorize etmenizi ve yönetmenizi sağlayan gelişmiş Chrome eklentisi.

## ✨ Özellikler

### 📌 Not Alma ve Yönetim
- **Sayfaya Özel Notlar**: Her web sayfası için başlık, içerik ve kategori ile not alabilirsiniz
- **Hızlı Not Alma**: Web sayfasındaki herhangi bir metni seçip sağ tıklayarak "Web Notuna Ekle" ile anında not ekleyebilirsiniz
- **Not Düzenleme**: Kayıtlı notlarınızı istediğiniz zaman düzenleyebilir veya silebilirsiniz
- **Dinamik İkon**: 
  - Sayfada not varsa: 🔵 Mavi ikon
  - Sayfada not yoksa: ⚪ İçi boş ikon

### 📸 Ekran Görüntüsü
- **Direkt Ekran Görüntüsü**: Notlarınıza tek tıkla ekran görüntüsü ekleyebilirsiniz
- **Otomatik Boyutlandırma**: Görüntüler otomatik olarak optimize edilir (800px genişlik, JPEG %70 kalite)
- **Görüntü Önizleme**: Eklenen ekran görüntülerini hem düzenleme hem görüntüleme modunda görebilirsiniz
- **Görüntü Yönetimi**: İstenmeyen görüntüleri kolayca kaldırabilirsiniz

### 🏷️ Kategori Yönetimi
- **Özel Kategoriler**: İş, Okul, Kişisel gibi kendi kategorilerinizi oluşturabilirsiniz
- **Renkli Etiketler**: Her kategoriye özel renk atayabilirsiniz
- **Kolay Seçim**: Not eklerken açılır menüden kategori seçebilirsiniz
- **Kategori Silme**: Kullanılmayan kategorileri silebilirsiniz

### 🔍 Gelişmiş Filtreleme ve Arama
- **Metin Arama**: Başlık, içerik veya URL'e göre notlarınızı arayabilirsiniz
- **Kategori Filtresi**: Belirli bir kategorideki notları görüntüleyebilirsiniz
- **Tarih Aralığı**: Başlangıç ve bitiş tarihi belirleyerek notları filtreleyebilirsiniz
- **Çoklu Filtre**: Tüm filtreleri aynı anda kullanabilirsiniz
- **Filtre Temizleme**: Tek tıkla tüm filtreleri sıfırlayabilirsiniz

### 📊 Dışa Aktarma (Export)
- **JSON Format**: Tüm notlarınızı yedeklemek için JSON formatında indirebilirsiniz
- **Excel (CSV) Format**: Notlarınızı Excel uyumlu CSV formatında indirebilirsiniz
  - Noktalı virgül (;) ayracı ile Türkçe Excel uyumlu
  - Kategori, tarih ve tüm bilgiler dahil
- **Ekran Görüntüleri**: Dışa aktarılan dosyalarda ekran görüntüsü bilgileri de yer alır

### 🌍 Çoklu Dil Desteği
- **Türkçe ve İngilizce**: Tam çeviri desteği
- **Dil Seçimi**: Ayarlar sayfasından istediğiniz dili seçebilirsiniz
- **Otomatik Algılama**: İlk kullanımda tarayıcı dilinize göre otomatik ayarlanır
- **Kalıcı Tercih**: Seçtiğiniz dil kaydedilir ve hatırlanır

### 🎨 Tema Desteği
- **Açık/Koyu Mod**: Göz sağlığınız için karanlık tema desteği
- **Tek Tıkla Geçiş**: Ayarlar sayfasından 🌙/☀️ butonu ile tema değiştirebilirsiniz
- **Kalıcı Tercih**: Tema tercihiniz kaydedilir

### 📋 Tablo Görünümü
- **Detaylı Liste**: Tüm notlarınızı tablo formatında görüntüleyin
- **Sütunlar**: Başlık, Kategori, Not İçeriği, Ekran Görüntüsü, URL, Tarih, İşlemler
- **Ekran Görüntüsü Önizleme**: Tabloda küçük thumbnail'ler, tıklayınca tam boyut açılır
- **Hızlı İşlemler**: Her not için düzenle/sil butonları

## 🚀 Kurulum

1. Bu projeyi bilgisayarınıza indirin veya klonlayın:
   ```bash
   git clone [repository-url]
   ```

2. Google Chrome'u açın ve adres çubuğuna şunu yazın:
   ```
   chrome://extensions
   ```

3. Sağ üst köşedeki **Geliştirici Modu** (Developer Mode) anahtarını açın

4. **Paketlenmemiş öğe yükle** (Load unpacked) butonuna tıklayın

5. İndirdiğiniz proje klasörünü seçin

6. Eklenti yüklendi! 🎉

## 📖 Kullanım

### Not Ekleme
1. Bir web sayfasına gidin
2. Tarayıcı araç çubuğundaki eklenti ikonuna tıklayın
3. Başlık, not ve kategori girin
4. İsterseniz ekran görüntüsü ekleyin (📷 butonu)
5. **Kaydet** butonuna basın

### Hızlı Not Alma
1. Web sayfasında bir metni seçin
2. Sağ tıklayın
3. "Web Notuna Ekle" seçeneğine tıklayın
4. Seçili metin otomatik olarak nota eklenir

### Not Yönetimi
1. Popup penceresindeki **⚙️ Ayarlar** butonuna tıklayın
2. Tüm notlarınızı görün, arayın, filtreleyin
3. Notları düzenleyin veya silin
4. JSON veya CSV olarak dışa aktarın

### Kategori Oluşturma
1. Ayarlar sayfasını açın
2. "Kategori Yönetimi" bölümüne gidin
3. Kategori adı girin ve renk seçin
4. **Kategori Ekle** butonuna tıklayın

### Dil Değiştirme
1. Ayarlar sayfasını açın
2. Sağ üstteki dil seçiciyi kullanın
3. Türkçe veya English seçin

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **Manifest V3**: Chrome'un en yeni eklenti standardı
- **Vanilla JavaScript**: Framework kullanmadan saf JavaScript
- **Chrome Storage API**: Notların güvenli saklanması
- **Chrome Tabs API**: Ekran görüntüsü alma
- **Chrome Context Menus API**: Sağ tık menüsü
- **CSS Variables**: Tema desteği için

### Dosya Yapısı
```
chromeeklenti/
├── manifest.json          # Eklenti yapılandırması
├── background.js          # Arka plan işlemleri (ikon, context menu)
├── popup.html            # Ana popup arayüzü
├── popup.js              # Popup mantığı
├── options.html          # Ayarlar sayfası
├── options.js            # Ayarlar mantığı
├── i18n.js               # Çoklu dil desteği
├── styles.css            # Tüm stiller (tema desteği ile)
├── _locales/             # Dil dosyaları
│   ├── tr/
│   │   └── messages.json
│   └── en/
│       └── messages.json
└── icons/                # Eklenti ikonları
    ├── icon16.png
    ├── icon48.png
    ├── icon128.png
    └── icon16_empty.png
```

### Depolama Yapısı
- **Notlar**: URL'ye göre anahtar-değer çiftleri
- **Kategoriler**: `categories` anahtarı altında dizi
- **Tema**: `theme` anahtarı (light/dark)
- **Dil**: `language` anahtarı (tr/en)

### Veri Formatı
```javascript
{
  "https://example.com": {
    "title": "Not Başlığı",
    "content": "Not içeriği...",
    "url": "https://example.com",
    "categoryId": "cat_1234567890",
    "screenshot": "data:image/jpeg;base64,...",
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "categories": [
    {
      "id": "cat_1234567890",
      "name": "İş",
      "color": "#3b82f6"
    }
  ],
  "theme": "dark",
  "language": "tr"
}
```

## 🔒 Gizlilik

- Tüm notlarınız **yerel olarak** tarayıcınızda saklanır
- Hiçbir veri dışarıya gönderilmez
- İnternet bağlantısı gerektirmez
- Tamamen çevrimdışı çalışır

## 📝 Lisans

Bu proje açık kaynaklıdır ve özgürce kullanılabilir.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📧 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

---

**Yaz Kenara** ile notlarınızı düzenli tutun! 📚✨
