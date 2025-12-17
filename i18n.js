const translations = {
    "tr": {
        "appName": "Yaz Kenara",
        "appDesc": "Gezdiğiniz web sayfalarına notlar alın, kategorize edin ve saklayın.",
        "optionsBtn": "Ayarlar",
        "loading": "Yükleniyor...",
        "noUrl": "URL bulunamadı",
        "editBtn": "Düzenle",
        "deleteBtn": "Sil",
        "titleLabel": "Başlık",
        "titlePlaceholder": "Bir başlık girin...",
        "noteLabel": "Not",
        "notePlaceholder": "Notunuzu buraya yazın...",
        "saveBtn": "Kaydet",
        "cancelBtn": "İptal",
        "savedNotesTitle": "Kayıtlı Notlar",
        "exportJsonBtn": "JSON Olarak İndir",
        "exportCsvBtn": "Excel (CSV) Olarak İndir",
        "clearAllBtn": "Tüm Notları Sil",
        "tableTitle": "Başlık",
        "tableUrl": "URL",
        "tableDate": "Tarih",
        "tableActions": "İşlemler",
        "emptyState": "Henüz kaydedilmiş not yok.",
        "confirmDelete": "Bu notu silmek istediğinize emin misiniz?",
        "confirmClearAll": "TÜM notları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
        "alertNoExport": "Dışa aktarılacak not yok.",
        "alertEnterContent": "Lütfen bir başlık veya içerik girin.",
        "searchPlaceholder": "Notlarda ara...",
        "contextMenuTitle": "Web Notuna Ekle",
        "categoryManagementTitle": "Kategori Yönetimi",
        "categoryNameLabel": "Kategori Adı",
        "categoryColorLabel": "Renk",
        "addCategoryBtn": "Kategori Ekle",
        "tableCategory": "Kategori",
        "noCategory": "Kategorisiz",
        "categoryLabel": "Kategori",
        "tableNote": "Not İçeriği",
        "filterTitle": "Filtreler",
        "filterCategoryLabel": "Kategori",
        "filterStartDateLabel": "Başlangıç Tarihi",
        "filterEndDateLabel": "Bitiş Tarihi",
        "clearFiltersBtn": "Filtreleri Temizle",
        "allCategories": "Tüm Kategoriler",
        "takeScreenshotBtn": "📷 Ekran Görüntüsü Al",
        "searchLabel": "Ara",
        "searchInputPlaceholder": "Başlık, içerik veya URL...",
        "categoryPlaceholder": "örn. İş, Kişisel...",
        "tableScreenshot": "Ekran Görüntüsü"
    },
    "en": {
        "appName": "Web Note",
        "appDesc": "Leave notes on specific web pages and export them.",
        "optionsBtn": "Options",
        "loading": "Loading...",
        "noUrl": "No URL found",
        "editBtn": "Edit",
        "deleteBtn": "Delete",
        "titleLabel": "Title",
        "titlePlaceholder": "Enter a title...",
        "noteLabel": "Note",
        "notePlaceholder": "Enter your note here...",
        "saveBtn": "Save Note",
        "cancelBtn": "Cancel",
        "savedNotesTitle": "Saved Notes",
        "exportJsonBtn": "Export to JSON",
        "exportCsvBtn": "Export to Excel (CSV)",
        "clearAllBtn": "Clear All Notes",
        "tableTitle": "Title",
        "tableUrl": "URL",
        "tableDate": "Date",
        "tableActions": "Actions",
        "emptyState": "No notes saved yet.",
        "confirmDelete": "Are you sure you want to delete this note?",
        "confirmClearAll": "Are you sure you want to delete ALL notes? This cannot be undone.",
        "alertNoExport": "No notes to export.",
        "alertEnterContent": "Please enter a title or content.",
        "searchPlaceholder": "Search notes...",
        "contextMenuTitle": "Add to Web Note",
        "categoryManagementTitle": "Manage Categories",
        "categoryNameLabel": "Category Name",
        "categoryColorLabel": "Color",
        "addCategoryBtn": "Add Category",
        "tableCategory": "Category",
        "noCategory": "No Category",
        "categoryLabel": "Category",
        "tableNote": "Note",
        "filterTitle": "Filters",
        "filterCategoryLabel": "Category",
        "filterStartDateLabel": "Start Date",
        "filterEndDateLabel": "End Date",
        "clearFiltersBtn": "Clear Filters",
        "allCategories": "All Categories",
        "takeScreenshotBtn": "📷 Take Screenshot",
        "searchLabel": "Search",
        "searchInputPlaceholder": "Title, content or URL...",
        "categoryPlaceholder": "e.g. Work, Personal...",
        "tableScreenshot": "Screenshot"
    }
};

let currentLocale = 'tr'; // Default

async function initI18n() {
    const result = await chrome.storage.local.get('language');
    if (result.language) {
        currentLocale = result.language;
    } else {
        // Simple auto-detect
        const uiLang = chrome.i18n.getUILanguage();
        if (uiLang.startsWith('en')) currentLocale = 'en';
        else currentLocale = 'tr';
    }

    applyTranslations();

    // Wire up selector if exists
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = currentLocale;
        langSelect.addEventListener('change', async (e) => {
            currentLocale = e.target.value;
            await chrome.storage.local.set({ language: currentLocale });
            applyTranslations();
            // Optional: Reload context menu title if dynamic update needed (requires background reload mostly)
        });
    }
}

function getMessage(key) {
    if (translations[currentLocale] && translations[currentLocale][key]) {
        return translations[currentLocale][key];
    }
    // Fallback to EN then key
    return (translations['en'][key]) || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const message = getMessage(key);

        if (message) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = message;
            } else {
                element.textContent = message;
            }
        }
    });

    // Update global chrome.i18n.getMessage wrapper if we want to shim it? 
    // Not possible to overwrite chrome API strictly, but we can export a helper.
}

// Override standard getMessage for our usage
window.t = getMessage;

// Shim chrome.i18n.getMessage so we don't have to refactor all code
const originalGetMessage = chrome.i18n.getMessage;
chrome.i18n.getMessage = function (messageName, substitutions) {
    if (translations[currentLocale] && translations[currentLocale][messageName]) {
        return translations[currentLocale][messageName];
    }
    return translations['en'][messageName] || messageName;
};

document.addEventListener('DOMContentLoaded', initI18n);
